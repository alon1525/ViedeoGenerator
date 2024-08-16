import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from "body-parser";


const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


// Rate Limiting
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per windowMs
});

app.use(limiter);

// Fetch Metadata Endpoint
app.post('/fetch-metadata', async (req, res) => {
  try {
    const { urls } = req.body;
    const metadataArray = [];

    for (let url of urls) {
      if (url != ""){
        try {
          const response = await axios.get(url);
          const html = response.data;
          const $ = cheerio.load(html);
  
          const title = $('head title').text();
          const description = $('meta[name="description"]').attr('content');
          const image = $('meta[property="og:image"]').attr('content');
  
          metadataArray.push({ title, description, image });
        } catch (error) {
          console.error(`Error fetching URL: ${url}`, error);
          metadataArray.push({ title: 'N/A', description: 'N/A', image: 'N/A' });
        }
      }
    }

    res.json(metadataArray);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 5021;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
