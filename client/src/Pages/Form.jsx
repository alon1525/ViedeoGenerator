import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function URLSubmit() {
  const [urls, setUrls] = useState(["", "", ""]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  function handleInputChange(index, event) {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  }

  async function handleSubmit() {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "https://junior-developer-home-task-exam-backend.vercel.app/fetch-metadata",
        { urls }
      );
      const resultsContainer = document.querySelector(".results-container");
      const hasError = response.data.some(item =>
        item.title === 'Error' || 
        item.description === 'Error fetching metadata' || 
        item.image === 'Error'
      );

      if (hasError) {
        setError('An error occurred while fetching data.');
      }
      else{
        setResults(response.data);
        setError("");
        setSubmitted(true);
        resultsContainer.classList.remove("fade-out");
      }
    } catch (err) {
      setError("Failed to fetch metadata. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  }

  function handleGoBack() {
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.classList.add("fade-out");
    setTimeout(() => {
      setSubmitted(false);
      setError(""); // Clear the error state when going back
    }, 500);
  }

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo" style={{ left: 20, position: "absolute" }}>
          <p>LOGO .</p>
        </div>
      </nav>

      {!submitted ? (
        <div className="form-box">
          <h1 className="headline">Submit Your URLs</h1>
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
                disabled={loading} // Disable button during loading
              />
            </div>
          </div>

          {loading && <div className="loader">Loading...</div>} {/* Loader */}
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className={`results-container ${submitted ? 'fade-in' : ''}`}>
          <div className="results-cards">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div className="result-card" key={index}>
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                  {result.image && <img src={result.image} alt="Metadata" />}
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}
    </div>
  );
}

export default URLSubmit;
