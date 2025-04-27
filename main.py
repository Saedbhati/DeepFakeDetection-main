from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from deepface import DeepFace
from werkzeug.utils import secure_filename
import cv2
from utils import extract_frames
from face_align import align_n_detect
from feature_extraction import extract_features
from typing import Union
import datetime
import logging
import traceback
from pathlib import Path

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Directory structure using Path for better cross-platform compatibility
BASE_FOLDER = Path.cwd() / 'media_files'
REAL_FOLDER = BASE_FOLDER / 'real'
FAKE_FOLDER = BASE_FOLDER / 'fake'

# Create directories safely
for folder in [REAL_FOLDER, FAKE_FOLDER]:
    folder.mkdir(parents=True, exist_ok=True)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov'}

def allowed_file(filename: str, allowed_extensions: set) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def extract_features_from_video(video_path: Union[str, os.PathLike], num_frames: int = 32):
    # Convert to Path object for better path handling
    video_path = Path(video_path)
    # Create working directory in the same folder as the video
    working_dir = video_path.parent / video_path.stem
    working_dir.mkdir(parents=True, exist_ok=True)
    
    # Extract frames
    extract_frames(str(video_path), num_frames)
    
    # Align and detect faces
    align_n_detect(str(working_dir))
    
    # Extract features
    features = extract_features(str(working_dir))
    
    # Clean up working directory after processing
    try:
        import shutil
        shutil.rmtree(working_dir)
    except Exception as e:
        logger.warning(f"Could not clean up working directory {working_dir}: {e}")
        
    return features

def extract_features_from_image(image_path: Union[str, os.PathLike]):
    features = extract_features(image_path)
    return features

def euclidean_similarity(feature1: np.ndarray, feature2: np.ndarray) -> float:
    """
    Calculate the Euclidean distance between two feature vectors.
    
    Args:
        feature1 (np.ndarray): First feature vector
        feature2 (np.ndarray): Second feature vector
        
    Returns:
        float: Euclidean distance between the vectors
    """
    if feature1.shape != feature2.shape:
        raise ValueError("Feature vectors must have the same shape")
    return np.linalg.norm(feature1 - feature2)

def cosine_similarity(feature1: np.ndarray, feature2: np.ndarray) -> float:
    """
    Calculate average cosine similarity between two batches of feature vectors.
    """
    if feature1.shape != feature2.shape:
        raise ValueError("Feature vectors must have the same shape")
    
    dot_product = np.sum(feature1 * feature2, axis=1)
    norm_product = np.linalg.norm(feature1, axis=1) * np.linalg.norm(feature2, axis=1)
    cos_similarities = dot_product / norm_product
    return np.mean(cos_similarities)


@app.route('/detect', methods=['POST'])
def detect():
    real_media_path = None
    fake_media_path = None
    
    try:
        if 'realMedia' not in request.files or 'fakeMedia' not in request.files:
            return jsonify({
                "error": "Missing files",
                "message": "Both realMedia and fakeMedia files are required"
            }), 400

        real_media = request.files['realMedia']
        fake_media = request.files['fakeMedia']

        # Validate file sizes
        max_size = 10 * 1024 * 1024  # 10MB limit
        if len(real_media.read()) > max_size or len(fake_media.read()) > max_size:
            return jsonify({
                "error": "File too large",
                "message": "Files must be less than 10MB"
            }), 400
        
        # Reset file pointers
        real_media.seek(0)
        fake_media.seek(0)

        # Generate safe paths
        real_filename = secure_filename(real_media.filename)
        fake_filename = secure_filename(fake_media.filename)
        
        real_media_path = REAL_FOLDER / real_filename
        fake_media_path = FAKE_FOLDER / fake_filename

        logger.debug(f"Saving files to: {real_media_path} and {fake_media_path}")

        # Save files
        real_media.save(str(real_media_path))
        fake_media.save(str(fake_media_path))

        # Process files
        real_features = extract_features_from_video(str(real_media_path)) if allowed_file(real_filename, ALLOWED_VIDEO_EXTENSIONS) \
            else extract_features_from_image(str(real_media_path))
        
        fake_features = extract_features_from_video(str(fake_media_path)) if allowed_file(fake_filename, ALLOWED_VIDEO_EXTENSIONS) \
            else extract_features_from_image(str(fake_media_path))

        cos_similarity = cosine_similarity(real_features, fake_features)
        euc_similarity = euclidean_similarity(real_features, fake_features)

        return jsonify({
            "message": "Analysis completed successfully",
            "cosine_similarity": float(cos_similarity),
            "euclidean_similarity": float(euc_similarity),
            "is_likely_deepfake": bool(cos_similarity < 0.7)
        }), 200

    except Exception as e:
        logger.error(f"Error processing files: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500

    finally:
        # Clean up files
        for path in [real_media_path, fake_media_path]:
            if path and path.exists():
                try:
                    path.unlink()
                except Exception as e:
                    logger.error(f"Error deleting file {path}: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify server status"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8877, debug=True)













