import cv2
import os
import shutil
from PIL import Image

def process_video(video_path, output_dir, target_width=540, quality=60):
    # If the output directory exists, clear it first so we don't have stray old frames
    if os.path.exists(output_dir):
        print(f"Clearing existing output directory: {output_dir}")
        shutil.rmtree(output_dir)
        
    os.makedirs(output_dir, exist_ok=True)
        
    vidcap = cv2.VideoCapture(video_path)
    fps = vidcap.get(cv2.CAP_PROP_FPS) or 24.0
    total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video FPS: {fps}, Total Frames: {total_frames}")
    
    # We want to skip the first 1 second (fps frames)
    skip_frames = int(round(fps))
    print(f"Skipping first {skip_frames} frames (1.0 second)")
    
    # Fast forward the capture by skip_frames
    for _ in range(skip_frames):
        vidcap.read()
        
    success, frame = vidcap.read()
    count = 1
    
    while success:
        # Convert BGR (OpenCV) to RGB (Pillow)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(rgb_frame)
        
        # Resize if width exceeds target_width
        w, h = img.size
        if w > target_width:
            new_h = int(h * (target_width / w))
            img = img.resize((target_width, new_h), Image.Resampling.LANCZOS)
            
        # Save as WebP
        frame_name = f"ezgif-frame-{count:03d}.webp"
        frame_path = os.path.join(output_dir, frame_name)
        img.save(frame_path, "WEBP", quality=quality)
        
        success, frame = vidcap.read()
        count += 1
        
    extracted_count = count - 1
    print(f"Extracted and optimized {extracted_count} frames to {output_dir}")
    return extracted_count

if __name__ == "__main__":
    video = r"c:\Users\favaz\Websites\Mice Media\public\micemedia home mobile.mp4"
    output = r"c:\Users\favaz\Websites\Mice Media\public\New_fps-sequences-mobile"
    
    process_video(video, output, target_width=540, quality=60)
