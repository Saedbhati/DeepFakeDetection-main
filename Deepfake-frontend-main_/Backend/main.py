from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from deepface import DeepFace
from werkzeug.utils import secure_filename
import cv2

app = Flask(__name__)
CORS(app)

# Directory to save uploaded files
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cosine_similarity(vector1, vector2):
    dot_product = np.dot(vector1, vector2)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    return dot_product / (norm_vector1 * norm_vector2)

def convert_to_native_types(obj):
    if isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    return obj

@app.route('/detect', methods=['POST'])
def detect():
    if 'realMedia' not in request.files or 'fakeMedia' not in request.files:
        return jsonify({"message": "Both realMedia and fakeMedia files are required"}), 400

    real_media = request.files['realMedia']
    fake_media = request.files['fakeMedia']

    # Validate file types
    if not (allowed_file(real_media.filename) and allowed_file(fake_media.filename)):
        return jsonify({"message": "Only PNG and JPG files are allowed"}), 400

    try:
        # Secure the filenames
        real_filename = secure_filename(real_media.filename)
        fake_filename = secure_filename(fake_media.filename)
        
        real_media_path = os.path.join(UPLOAD_FOLDER, real_filename)
        fake_media_path = os.path.join(UPLOAD_FOLDER, fake_filename)

        # Save files
        real_media.save(real_media_path)
        fake_media.save(fake_media_path)

        # Verify images can be opened
        real_img = cv2.imread(real_media_path)
        fake_img = cv2.imread(fake_media_path)
        
        if real_img is None or fake_img is None:
            raise ValueError("Unable to read one or both images")

        # Get face embeddings
        try:
            representation_real = DeepFace.represent(img_path=real_media_path, model_name="Facenet512", enforce_detection=True)
            representation_fake = DeepFace.represent(img_path=fake_media_path, model_name="Facenet512", enforce_detection=True)

            vector_real = representation_real[0]["embedding"]
            vector_fake = representation_fake[0]["embedding"]

            similarity_score = cosine_similarity(vector_real, vector_fake)
            
            return jsonify({
                "message": "Analysis completed successfully",
                "similarity_score": convert_to_native_types(similarity_score),
                "is_likely_deepfake": convert_to_native_types(similarity_score < 0.7)
            }), 200

        except Exception as e:
            raise ValueError(f"Face analysis error: {str(e)}")

    except Exception as e:
        return jsonify({"message": str(e)}), 400

    finally:
        # Clean up files in finally block to ensure they're always removed
        for path in [real_media_path, fake_media_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except:
                    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8877, debug=True)