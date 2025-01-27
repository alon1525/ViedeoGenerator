import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function URLSubmit() {
  const [formData, setFormData] = useState({
    numPictures: 1,
    videoDuration: 10,
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setVideoLink("");

    try {
      console.log("dsdsad");
      const response = await axios.post(
        "http://localhost:3000/generate-video",
        {
          numPictures: parseInt(formData.numPictures, 10),
          videoDuration: parseInt(formData.videoDuration, 10),
          title: formData.title,
          description: formData.description,
        },
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const videoBlob = response.data;
        const videoURL = URL.createObjectURL(videoBlob);
        setVideoLink(videoURL);
      } else {
        setError("Failed to generate the video. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while generating the video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo" style={{ left: 20, position: "absolute" }}>
          <p>LOGO .</p>
        </div>
      </nav>

      <div className="form-box">
        <h1 className="headline">Generate Your Video</h1>
        <div className="form-container">
          <div className="input-box">
            <label htmlFor="numPictures">Number of Pictures:</label>
            <input
              type="number"
              id="numPictures"
              name="numPictures"
              value={formData.numPictures}
              onChange={handleInputChange}
              min="1"
              className="input-field"
            />
          </div>

          <div className="input-box">
            <label htmlFor="videoDuration">Video Duration (seconds):</label>
            <input
              type="number"
              id="videoDuration"
              name="videoDuration"
              value={formData.videoDuration}
              onChange={handleInputChange}
              min="1"
              className="input-field"
            />
          </div>

          <div className="input-box">
            <label htmlFor="title">Video Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="input-box">
            <label htmlFor="description">Video Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="input-box">
            <input
              type="button"
              className="submit"
              value="Generate Video"
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>

        {loading && <div className="loader">Generating video...</div>}
        {error && <p className="error-message">{error}</p>}

        {videoLink && (
          <div className="video-download">
            <p>Video generated successfully!</p>
            <a href={videoLink} download="video.mp4" className="download-link">
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default URLSubmit;
