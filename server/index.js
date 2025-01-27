import OpenAI from "openai";
import express from "express";
import { exec } from "child_process";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors"; // Import the CORS package

// Load environment variables from .env
dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors()); // This allows requests from any origin, including http://localhost:3001

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY, // Use API_KEY from .env
});

async function generateImages(imagePrompts) {
  const images = [];

  for (const prompt of imagePrompts) {
    try {
      const response = await axios.post('https://backend.craiyon.com/generate', {
        prompt: prompt,
      });

      // Craiyon returns a list of image URLs in its response
      const imageUrls = response.data.images.map((img) => `data:image/png;base64,${img}`);
      images.push(...imageUrls); // Collect all images as Base64 strings
    } catch (error) {
      console.error(`Error generating image for prompt "${prompt}":`, error);
    }
  }

  return images;
}

app.post("/generate-video", async (req, res) => {
  try {
    const { numPictures, videoDuration, title, description } = req.body;

    // Step 1: Generate image descriptions
    const imagePrompts = [];
    for (let i = 0; i < numPictures; i++) {
      const prompt = `${description} with a unique art style, style variation ${i + 1}`;
      imagePrompts.push(prompt);
    }

    // Step 2: Use OpenAI's API to generate images
    const images = [];
    for (const prompt of imagePrompts) {
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size: "512x512",
      });
      images.push(response.data[0].url); // Collect generated image URLs
    }
    console.log(images);
    // Step 3: Download images and create a video
    const imagePaths = [];
    for (let i = 0; i < images.length; i++) {
      const imagePath = `./image_${i}.png`;
      const imageResponse = await axios.get(images[i], { responseType: "stream" });
      const writer = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(writer);
      imagePaths.push(imagePath);

      await new Promise((resolve) => writer.on("finish", resolve));
    }

    // Use FFmpeg to create a video
    const outputVideoPath = "./output_video.mp4";
    const duration = videoDuration / numPictures;

    const ffmpegCommand = `ffmpeg ${imagePaths
      .map((path) => `-loop 1 -t ${duration} -i ${path}`)
      .join(" ")} -filter_complex "concat=n=${numPictures}:v=1:a=0" ${outputVideoPath}`;

    exec(ffmpegCommand, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate video" });
      }

      res.download(outputVideoPath, "video.mp4", (err) => {
        if (err) {
          console.error("Error serving video:", err);
        }

        // Cleanup temporary files
        imagePaths.forEach((path) => fs.unlinkSync(path));
        fs.unlinkSync(outputVideoPath);
      });
    });
  } catch (error) {
    console.error("Error generating video:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
