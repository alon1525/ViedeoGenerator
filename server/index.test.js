// server.test.js
import request from 'supertest';
import app from './index.js'; // Adjust the path if necessary
import axios from 'axios';

jest.mock('axios');

describe('Fetch Metadata API', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  it('should limit requests to 5 per second', async () => {
    const urls = ['https://www.youtube.com/']; // Test URL

    // Send 6 requests in quick succession
    const responses = await Promise.all(
      Array.from({ length: 6 }, () => request(app).post('/fetch-metadata').send({ urls }))
    );

    expect(responses[0].statusCode).toBe(200); // First 5 requests should succeed
    expect(responses[1].statusCode).toBe(200);
    expect(responses[2].statusCode).toBe(200);
    expect(responses[3].statusCode).toBe(200);
    expect(responses[4].statusCode).toBe(200);
    expect(responses[5].statusCode).toBe(429); // Sixth request should be rate-limited
  });

  it('should fetch metadata from a valid URL', async () => {
    // Mock the actual HTTP request
    axios.get.mockResolvedValue({
      data: '<html><head><title>YouTube</title><meta name="description" content="YouTube is a video sharing platform"/><meta property="og:image" content="https://www.youtube.com/s/desktop/7a233ed4/img/favicon_32x32.png"/></head></html>'
    });

    const response = await request(app)
      .post('/fetch-metadata')
      .send({ urls: ['https://www.youtube.com/'] });


    expect(response.statusCode).toBe(200);
    expect(response.body[0].title).toBe('YouTube');
    expect(response.body[0].description).toBe('Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.');
    expect(response.body[0].image).toBe('https://www.youtube.com/s/desktop/7a233ed4/img/favicon_32x32.png');
  });

  it('should return an error for an invalid URL', async () => {
    // Mock an error response from axios
    axios.get.mockRejectedValue(new Error('Invalid URL'));

    const response = await request(app)
      .post('/fetch-metadata')
      .send({ urls: ['invalid-url'] });

    expect(response.statusCode).toBe(500); // Internal Server Error
    expect(response.body.error).toBe('Internal Server Error');
  });
});
