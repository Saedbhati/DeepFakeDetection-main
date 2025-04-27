from deepface import DeepFace
import os
import numpy as np

def extract_features(path:os.PathLike):
    """
    Extract features from a folder of aligned images using DeepFace.
    
    Args:
        path (os.PathLike): Path to the folder containing the aligned images

    Returns:
        return stack of  featrues in a numpy array
    """
    features = []
    for i in os.listdir(path):
        features.append(
    DeepFace.represent(
        os.path.join(path, i),
        model_name="Facenet512",
        enforce_detection=False  # <-- Pass it here INSIDE the represent function
    )[0]["embedding"]
)

    return np.stack(features)


