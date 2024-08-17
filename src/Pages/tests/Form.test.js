// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import Form from '../Form';
// import axios from 'axios';

// jest.mock('axios');

// describe('Form Component', () => {
//   beforeEach(() => {
//     axios.post.mockClear();
//   });
  


//   it('should display metadata when valid URLs are submitted', async () => {
//     // Mock successful response
//     axios.post.mockResolvedValue({
//       data: [
//         { title: 'YouTube', description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', image: 'https://www.youtube.com/s/desktop/7a233ed4/img/favicon_32x32.png' },
//         { title: 'YouTube', description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', image: 'https://www.youtube.com/s/desktop/7a233ed4/img/favicon_32x32.png' },
//         { title: 'YouTube', description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.', image: 'https://www.youtube.com/s/desktop/7a233ed4/img/favicon_32x32.png' }
//       ]
//     });

//     render(<Form />);

//     fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.youtube.com/' } });
//     fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://www.youtube.com/' } });
//     fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://www.youtube.com/' } });

//     fireEvent.click(screen.getByValue('Submit'));

//     await waitFor(() => {
//       expect(screen.getByText('YouTube')).toBeInTheDocument();
//       expect(screen.getByText('Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.')).toBeInTheDocument();
//       expect(screen.getByAltText('Metadata')).toBeInTheDocument();
//     });
//   });

//   it('should show an error message for invalid URLs', async () => {
//     axios.post.mockResolvedValue({
//       data: [{ title: 'Error', description: 'Error fetching metadata', image: 'Error' }]
//     });

//     render(<Form />);

//     fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'invalid-url' } });
//     fireEvent.click(screen.getByValue('Submit'));

//     await waitFor(() => {
//       expect(screen.getByText('Invalid Url. Please try again.')).toBeInTheDocument();
//     });
//   });

//   it('should handle form submission error', async () => {
//     axios.post.mockRejectedValue(new Error('Network Error'));

//     render(<Form />);

//     fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.youtube.com/' } });
//     fireEvent.click(screen.getByValue('Submit'));

//     await waitFor(() => {
//       expect(screen.getByText('Failed to fetch metadata. Please try again.')).toBeInTheDocument();
//     });
//   });
// });
