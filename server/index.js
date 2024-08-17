import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

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

app.get('/', (req, res) => {
  res.send("server is running")
})

// Fetch Metadata Endpoint
app.post('/fetch-metadata', async (req, res) => {
  try {
    const { urls } = req.body;
    const metadataArray = [];

    for (let url of urls) {
      if (url != "") {
        try {
          const response = await axios.get(url);
          const html = response.data;
          const { document } = (new JSDOM(html)).window;
          
          const title = document.querySelector('head title')?.textContent || 'N/A';
          const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'N/A';
          const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'N/A';

          if (image === "N/A" && description === "N/A" && title === "N/A"){
            metadataArray = [{ url, title: 'Error', description: 'Error fetching metadata', image: 'Error' }];
            break;
          }
          else{
            metadataArray.push({ title, description, image });
          }
        } catch (error) {
          console.error(`Error fetching URL: ${url}`, error);
          metadataArray.push({ url, title: 'Error', description: 'Error fetching metadata', image: 'Error' });
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

export default app