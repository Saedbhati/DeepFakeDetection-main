import React, { useEffect, useState } from 'react';
import StickyHeader from './Stickyheader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../Styles/Detect.css';
import '../Styles/Stickyheader.css';

const DetectPage = () => {
  const [realMedia, setRealMedia] = useState(null);
  const [fakeMedia, setFakeMedia] = useState(null);
  const [realPreview, setRealPreview] = useState(null);
  const [fakePreview, setFakePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const sanitizeFilename = (filename) => {
    // Remove invalid characters from filename
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  };

  const handleFileChange = (e, setMedia, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      // Allow both images and videos
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Please upload only image or video files');
        return;
      }

      // Sanitize the filename before setting it
      const sanitizedFile = new File([file], sanitizeFilename(file.name), {
        type: file.type,
      });

      setMedia(sanitizedFile);

      // Show preview for images and videos
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
      setShowResult(false);
    }
  };

  const detect = async () => {
    if (!realMedia || !fakeMedia) {
      setError("Please upload both real and fake media files.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowResult(false);

    const formData = new FormData();
    formData.append("realMedia", realMedia);
    formData.append("fakeMedia", fakeMedia);

    try {
      const response = await fetch("http://localhost:8877/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Server Error (${response.status}): ${errorMessage || 'No response from server'}`
        );
      }

      const data = await response.json();
      if (!data || typeof data.cosine_similarity === 'undefined') {
        throw new Error('Invalid response format from server');
      }

      setResult({
        similarityScore: data.cosine_similarity ? data.cosine_similarity.toFixed(2) : "N/A",
        isLikelyDeepfake: data.is_likely_deepfake
      });
      setShowResult(true);
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes('Failed to fetch')) {
        setError("Cannot connect to the server. Please ensure the server is running at http://localhost:8877");
      } else if (error instanceof TypeError) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeResult = () => {
    setShowResult(false);
  };

  return (
    <div className="detect-container">
      <StickyHeader />
      <div className="detection-area">
        {error && <div className="error-message">{error}</div>}
        <div className="media-container">
          <div className="media-box" data-aos="zoom-out" data-aos-duration="500" data-aos-once="true">
            <h2>Real video/picture</h2>
            <div className="upload-area" data-aos="zoom-out" data-aos-duration="500" data-aos-once="true">
              <input
                type="file"
                id="real-media"
                hidden
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e, setRealMedia, setRealPreview)}
              />
              <label htmlFor="real-media" style={{ cursor: 'pointer' }}>
                {realPreview ? (
                  realMedia && realMedia.type.startsWith('video/') ? (
                    <video src={realPreview} controls className="preview-image" />
                  ) : (
                    <img src={realPreview} alt="Real preview" className="preview-image" />
                  )
                ) : (
                  'Click to upload'
                )}
              </label>
            </div>
          </div>

          <div className="media-box" data-aos="zoom-out" data-aos-duration="500" data-aos-once="true">
            <h2>Deep fake video/picture</h2>
            <div className="upload-area" data-aos="zoom-out" data-aos-duration="500" data-aos-once="true">
              <input
                type="file"
                id="fake-media"
                hidden
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e, setFakeMedia, setFakePreview)}
              />
              <label htmlFor="fake-media" style={{ cursor: 'pointer' }}>
                {fakePreview ? (
                  fakeMedia && fakeMedia.type.startsWith('video/') ? (
                    <video src={fakePreview} controls className="preview-image" />
                  ) : (
                    <img src={fakePreview} alt="Fake preview" className="preview-image" />
                  )
                ) : (
                  'Click to upload'
                )}
              </label>
            </div>
          </div>
        </div>
        <button
          className="action-button download"
          data-aos="zoom-out"
          data-aos-duration="500"
          data-aos-once="true"
          onClick={detect}
          disabled={loading || !realMedia || !fakeMedia}
        >
          {loading ? 'Processing...' : 'Check Score'}
        </button>
      </div>

      {showResult && (
        <div className="result-overlay">
          <div 
            className="result-card" 
            data-aos="flip-up" 
            data-aos-duration="800"
          >
            <button className="close-button" onClick={closeResult}>×</button>
            <h2 className="result-title">Detection Results</h2>
            <div className="result-content">
              <div className="result-item">
                <span className="result-label">Similarity Score:</span>
                <span className="result-value">{result.similarityScore}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Likely Deepfake:</span>
                <span className={`result-value ${result.isLikelyDeepfake ? 'deepfake' : 'authentic'}`}>
                  {result.isLikelyDeepfake ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            {result.isLikelyDeepfake ? (
              <div className="result-warning">
                <span className="warning-icon">⚠️</span>
                <p>This image appears to be manipulated</p>
              </div>
            ) : (
              <div className="result-success">
                <span className="success-icon">✓</span>
                <p>This image appears to be authentic</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="corner-icons">
        <img src="/Brain.svg" alt="" className="corner-icon left" data-aos="fade-up" data-aos-duration="500" data-aos-once="true" />
        <img src="/Brain-1.svg" alt="" className="corner-icon right" data-aos="fade-up" data-aos-duration="500" data-aos-once="true" />
      </div>
    </div>
  );
};

export default DetectPage;