import cv2
import os
import numpy as np



def extract_frames(video_path, num_frames):
    """
    Extract frames from a video at equal intervals using numpy.linspace and save them in a folder.
    
    Args:
        video_path (str): Path to the video file
        num_frames (int): Number of frames to extract
        
    Returns:
        list: List of extracted frames as numpy arrays
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")
    
    # Create output directory based on video filename
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    output_dir = os.path.join(os.path.dirname(video_path), video_name)
    os.makedirs(output_dir, exist_ok=True)
    
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    
    # Get total number of frames in the video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames < num_frames:
        raise ValueError(f"Video has only {total_frames} frames, but {num_frames} frames were requested")
    
    # Generate evenly spaced frame indices using linspace
    frame_indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
    
    frames = []
    for i, frame_idx in enumerate(frame_indices):
        # Set the frame position
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        
        # Read the frame
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
            # Save the frame
            frame_path = os.path.join(output_dir, f"frame_{i:04d}.jpg")
            cv2.imwrite(frame_path, frame)
        else:
            break
    
    # Release the video capture object
    cap.release()
    
    return frames

