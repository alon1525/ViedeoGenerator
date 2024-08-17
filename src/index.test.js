// src/__tests__/server.test.js
import request from 'supertest';
import app from '../index.js'; // Adjust the path if necessary
import axios from 'axios';

jest.mock('axios');

describe('Fetch Metadata API', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });




  test('should return an error for an invalid URL', async () => {
    // Mock an error response from axios
    axios.get.mockRejectedValue(new Error('Invalid URL'));
    const response = await request(app)
      .post('/fetch-metadata')
      .send({ urls: ['invalid-url'] });

    expect(response.statusCode).toBe(200); // Internal Server Error
    expect(response.body[0].image).toBe('Error');
  });

  test('should limit requests to 5 per second', async () => {
    const urls = ['https://www.youtube.com/']; // Test URL
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to avoid rate limiting
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
});
