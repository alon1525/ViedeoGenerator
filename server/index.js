import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per windowMs
});

app.use(limiter);

// Fetch Metadata Endpoint
app.post('/fetch-metadata', async (req, res) => {
  const { urls } = req.body;
  const metadataArray = [];

  for (let url of urls) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('head title').text();
      const description = $('meta[name="description"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');

      metadataArray.push({ title, description, image });
    } catch (error) {
      metadataArray.push({ title: 'N/A', description: 'N/A', image: 'N/A' });
    }
  }

  res.json(metadataArray);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
