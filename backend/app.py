import os
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from subprocess import run
import time
import base64
from pdf2image import convert_from_path

filename = f"input_{int(time.time())}.tex"


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Initialize Firestore DB
cred = credentials.Certificate('aiapply-d1325-firebase-adminsdk-9i1rz-ed9caa2f62.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()



import requests

# Add this function to your Flask app
def save_cat_image(directory_path):
    try:
        # URL of an API that provides cat images
        cat_image_url = "https://cataas.com/cat"  # This is an example; replace with your preferred API
        response = requests.get(cat_image_url)

        if response.status_code == 200:
            with open(os.path.join(directory_path, 'preview.jpeg'), 'wb') as file:
                file.write(response.content)
            return True
    except Exception as e:
        print(f"Error saving cat image: {e}")
        return False



@app.route('/create-directory', methods=['POST'])
def create_directory():
    data = request.json
    user_id = data['userId']
    resume_id = data['resumeId']

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_path = os.path.join(base_dir, 'aiapply', 'public', 'users', user_id, resume_id)

    try:
        os.makedirs(directory_path, exist_ok=True)
        if save_cat_image(directory_path):
            return jsonify({"message": "Directory and cat image created successfully"}), 200
        else:
            return jsonify({"error": "Directory created but failed to save cat image"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)

