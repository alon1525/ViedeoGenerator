import React, { useState } from 'react';
import axios from 'axios';
import "../App.css"; // Import the CSS file for styling

export default function Form(){
const [urls, setUrls] = useState(['', '', '']);
const [metadata, setMetadata] = useState([]);
const [error, setError] = useState(null);

const handleInputChange = (index, event) => {
  const newUrls = [...urls];
  newUrls[index] = event.target.value;
  setUrls(newUrls);
};

const fetchMetadata = async () => {
  try {
    setError(null);
    const response = await axios.post('/fetch-metadata', { urls });
    setMetadata(response.data);
  } catch (err) {
    setError('Failed to fetch metadata. Please check the URLs and try again.');
  }
};

return (
  <div className="app-container">
    <h1 className="app-title">URL Metadata Fetcher</h1>
    <div className="input-container">
      {urls.map((url, index) => (
        <input
          key={index}
          type="text"
          value={url}
          onChange={(e) => handleInputChange(index, e)}
          placeholder={`Enter URL ${index + 1}`}
          className="url-input"
        />
      ))}
    </div>
    <button onClick={fetchMetadata} className="submit-button">Submit</button>
    {error && <p className="error-message">{error}</p>}
    <div className="metadata-container">
      {metadata.map((data, index) => (
        <div key={index} className="metadata-card">
          <h3 className="metadata-title">{data.title || 'No Title'}</h3>
          <p className="metadata-description">{data.description || 'No Description'}</p>
          {data.image ? (
            <img src={data.image} alt="Metadata" className="metadata-image" />
          ) : (
            <p className="metadata-no-image">No Image Available</p>
          )}
        </div>
      ))}
    </div>
  </div>
);
}