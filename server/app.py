import asyncio
from hume import AsyncHumeClient
from hume.expression_measurement.stream import Config
from hume.expression_measurement.stream.socket_client import StreamConnectOptions
import cv2
import base64
import time
import ssl
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading

# Ensure we use a secure HTTPS context for all Hume API requests
ssl._create_default_https_context = ssl.create_default_context

# -------------------------------------------------------------------
# Flask app setup for API communication
# -------------------------------------------------------------------
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])  # Enable CORS for frontend communication

# Global variable to store current emotion
current_emotion = "Calm"
emotion_lock = threading.Lock()

@app.route('/api/emotion', methods=['GET'])
def get_emotion():
    """Legacy endpoint: returns last detected emotion (not used for new flow)"""
    with emotion_lock:
        return jsonify({"emotion": current_emotion})

def update_emotion(emotion: str):
    """Thread-safe function to update current emotion"""
    global current_emotion
    with emotion_lock:
        current_emotion = emotion

# -------------------------------------------------------------------
# Define fine-grained emotion lists for mapping into broad categories
# -------------------------------------------------------------------
SADNESS_EMOTIONS = [
    "Awkwardness", "Boredom", "Contemplation", "Disappointment",
    "Distress", "Doubt", "Embarrassment", "Empathic Pain", "Pain",
    "Sadness", "Shame", "Sympathy", "Tiredness"
]

ANGER_EMOTIONS = [
    "Anger", "Contempt", "Disgust", "Envy", "Guilt"
]

CALM_EMOTIONS = [
    "Calmness", "Contentment", "Realization"
]

HAPPY_EMOTIONS = [
    "Craving", "Determination", "Ecstasy", "Entrancement",
    "Excitement", "Joy", "Pride", "Triumph",
    "Admiration", "Adoration", "Aesthetic Appreciation", "Amusement",
    "Love", "Nostalgia", "Relief", "Romance", "Satisfaction"
]

STRESSED_EMOTIONS = [
    "Anxiety", "Awe", "Fear", "Horror"
]

CURIOUS_EMOTIONS = [
    "Interest", "Surprise (positive)", "Surprise (negative)", "Confusion"
]


def categorize_hume_emotion(emotion_label: str) -> str:
    """
    Map a detailed Hume emotion name into one of our broad categories.
    """
    if emotion_label in SADNESS_EMOTIONS:
        return "Sad😢"
    elif emotion_label in ANGER_EMOTIONS:
        return "Anger😡"
    elif emotion_label in CALM_EMOTIONS:
        return "Calm😌"
    elif emotion_label in HAPPY_EMOTIONS:
        return "Happy😊"
    elif emotion_label in STRESSED_EMOTIONS:
        return "Stressed😫"
    elif emotion_label in CURIOUS_EMOTIONS:
        return "Curious😕"
    else:
        # Default to Calm to ensure only the six categories are produced
        return "Calm😌"


async def analyze_base64_image(b64_image: str) -> str:
    """
    Analyze a single base64-encoded image using Hume streaming API
    and return a broad emotion category string compatible with the frontend.
    """
    hume_client = AsyncHumeClient(api_key="jXvKPYTvVWO3XqqzGgi6WjoSmstGguywD3Mtvekscq67YU1R")
    model_config = Config(face={})
    stream_options = StreamConnectOptions(config=model_config)

    async with hume_client.expression_measurement.stream.connect(options=stream_options) as hume_stream:
        result = await hume_stream.send_file(b64_image)
        if not result.face or not result.face.predictions:
            return "Calm"

        # Pick the highest-scoring emotion across first face
        prediction = result.face.predictions[0]
        top_emotion = max(prediction.emotions, key=lambda e: e.score)
        category = categorize_hume_emotion(top_emotion.name)
        return category


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Accept a captured data URL image and return a single categorized emotion."""
    try:
        payload = request.get_json(silent=True) or {}
        data_url = payload.get('image', '')
        if not isinstance(data_url, str) or not data_url:
            return jsonify({"error": "Missing image"}), 400

        # Expect a data URL like: data:image/jpeg;base64,XXXXX
        if "," in data_url:
            b64_part = data_url.split(",", 1)[1]
        else:
            b64_part = data_url

        # Run analysis once
        emotion = asyncio.run(analyze_base64_image(b64_part))

        # Update global for legacy GET users (optional)
        update_emotion(emotion)

        return jsonify({"emotion": emotion})
    except Exception as e:
        print(f"/api/analyze error: {e}")
        return jsonify({"error": "Failed to analyze image"}), 500


def print_emotion_data(emotion_category: str, face_position: str, emotion_name: str, score: float):
    """
    Print the detected emotion data in a structured format.
    """
    print(f"Emotion: {emotion_name}")
    print(f"Category: {emotion_category}")
    print(f"Score: {score:.3f}")


async def main():
    """
    Main async loop:
      - Initialize Hume streaming client
      - Open camera and detect face + emotion
      - Print emotion detection results
      - Update emotion every 10 seconds
    """
    face_in_view_before = False
    last_emotion_update = time.time()
    EMOTION_UPDATE_INTERVAL = 5  # seconds

    # Add your Hume API key
    hume_client = AsyncHumeClient(api_key="jXvKPYTvVWO3XqqzGgi6WjoSmstGguywD3Mtvekscq67YU1R")
    model_config = Config(face={})
    stream_options = StreamConnectOptions(config=model_config)

    # Try opening the default camera, fallback across indices if needed
    current_camera_index = 0
    MAX_CAMERA_ATTEMPTS = 3
    video_capture = None
    for _ in range(MAX_CAMERA_ATTEMPTS):
        video_capture = cv2.VideoCapture(current_camera_index)
        if video_capture.isOpened():
            ret, test_frame = video_capture.read()
            if ret:
                print(f"Camera opened at index {current_camera_index}")
                break
            else:
                print(f"Index {current_camera_index} opened but no frame; releasing.")
                video_capture.release()
        else:
            print(f"Failed to open camera at index {current_camera_index}")
        current_camera_index += 1
    else:
        print("Could not open any camera. Exiting.")
        return

    previous_emotion_category = None

    # Open Hume streaming socket
    async with hume_client.expression_measurement.stream.connect(options=stream_options) as hume_stream:
        while True:
            ret, frame = video_capture.read()
            if not ret or frame is None:
                # Attempt camera reconnect on read failure
                print("Frame read error; reconnecting camera...")
                video_capture.release()
                video_capture = cv2.VideoCapture(current_camera_index)
                if not video_capture.isOpened():
                    print("Reconnection failed. Exiting loop.")
                    break
                continue

            try:
                # Encode frame as JPEG and then Base64 for Hume
                _, jpeg_buffer = cv2.imencode('.jpg', frame)
                if jpeg_buffer is None:
                    print("Failed to encode frame to JPEG")
                    continue
                b64_image = base64.b64encode(jpeg_buffer).decode('utf-8')

                # Send image to Hume and get predictions
                result = await hume_stream.send_file(b64_image)

                # Detect user entry/exit events
                faces_present_now = bool(result.face and result.face.predictions)
                if faces_present_now and not face_in_view_before:
                    print("🎯 User entered camera view")
                elif not faces_present_now and face_in_view_before:
                    print("👋 User left camera view")
                face_in_view_before = faces_present_now

                # If a face is detected, compute position & emotion category
                if faces_present_now:
                    for prediction in result.face.predictions:
                        # Calculate horizontal offset from frame center
                        if prediction.bbox:
                            bbox = prediction.bbox
                            face_center_x = bbox.x + bbox.w / 2
                            frame_center_x = frame.shape[1] / 2
                            offset_px = int(face_center_x - frame_center_x)
                            if offset_px < 0:
                                position_label = f"Left {-offset_px} px"
                            elif offset_px > 0:
                                position_label = f"Right {offset_px} px"
                            else:
                                position_label = "Center 0 px"
                        else:
                            position_label = "Unknown"

                        # Choose the highest-scoring emotion and map to category
                        top_emotion = max(prediction.emotions, key=lambda e: e.score)
                        category = categorize_hume_emotion(top_emotion.name)

                        # Always print the currently detected emotion
                        print(
                            f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Detected: {category} "
                            f"(raw: {top_emotion.name} {top_emotion.score:.3f}) | Position: {position_label}"
                        )

                        # Only print when category changes to avoid spam
                        if category != previous_emotion_category:
                            print_emotion_data(category, position_label, top_emotion.name, top_emotion.score)
                        previous_emotion_category = category

                        # Update global emotion every 10 seconds
                        current_time = time.time()
                        if current_time - last_emotion_update >= EMOTION_UPDATE_INTERVAL:
                            update_emotion(category)
                            last_emotion_update = current_time
                            print(f"🔄 Updated emotion to frontend: {category}")

                # Throttle loop to avoid overloading Hume API
                await asyncio.sleep(2)

            except Exception as proc_err:
                print(f"Error during frame processing: {proc_err}")

    # Clean up resources
    video_capture.release()


def run_flask_server():
    """Run Flask server in a separate thread"""
    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)


if __name__ == "__main__":
    print("Starting Flask API server on http://localhost:5001")
    print("Press Ctrl+C to stop")
    run_flask_server()
