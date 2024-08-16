// src/Components/URLSubmit.jsx
import React, { useState } from 'react';
import '../App.css'; // Import the CSS file for styling

function URLSubmit() {
  const [urls, setUrls] = useState(['', '', '']); // State for 3 URL inputs
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (index, event) => {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    try {
      // Replace '/fetch-metadata' with your actual API endpoint
      const response = await fetch('/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await response.json();
      setResults(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch metadata. Please try again.');
    }
  };

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo" style={{ left: 20, position: 'absolute' }}>
          <p>LOGO .</p>
        </div>
      </nav>

      <div className="form-box">
        <h1 className="headline">Submit Your URLs</h1> {/* Added headline */}
        <div className="url-input-container">
          {urls.map((url, index) => (
            <div className="input-box" key={index}>
              <input
                type="text"
                className="input-field"
                value={url}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={`Enter URL ${index + 1}`}
              />
            </div>
          ))}
          <div className="input-box">
            <input
              type="button"
              className="submit"
              value="Submit"
              onClick={handleSubmit}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="results-container">
          {results.length > 0 && (
            results.map((result, index) => (
              <div className="result-card" key={index}>
                <h3>{result.title}</h3>
                <p>{result.description}</p>
                {result.image && <img src={result.image} alt="Metadata" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default URLSubmit;
