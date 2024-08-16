import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { jest } from '@jest/globals';
import cheerio from 'cheerio';

const app = express();
app.use(express.json());

// Mock the /fetch-metadata endpoint for testing
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

// Test cases
describe('POST /fetch-metadata', () => {
  it('should return metadata for valid URLs', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: '<html><head><title>Test Title</title><meta name="description" content="Test Description"><meta property="og:image" content="http://example.com/image.jpg"></head></html>',
    });

    const res = await request(app)
      .post('/fetch-metadata')
      .send({ urls: ['http://example.com'] });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('title', 'Test Title');
    expect(res.body[0]).toHaveProperty('description', 'Test Description');
    expect(res.body[0]).toHaveProperty('image', 'http://example.com/image.jpg');
  });

  it('should handle errors gracefully when fetching metadata fails', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    const res = await request(app)
      .post('/fetch-metadata')
      .send({ urls: ['http://invalid-url.com'] });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('title', 'N/A');
    expect(res.body[0]).toHaveProperty('description', 'N/A');
    expect(res.body[0]).toHaveProperty('image', 'N/A');
  });
});
