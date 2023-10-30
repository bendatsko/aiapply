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
import uuid
import shutil  # Import shutil for directory deletion


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
    

@app.route('/delete-template-files', methods=['POST'])
def delete_template_files():
    data = request.json
    unique_id = data['uniqueId']  # Get the unique directory ID

    # Construct the path to the directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_path = os.path.join(base_dir, 'frontend', 'public', 'templates', unique_id)

    try:
        # Check if directory exists and then remove it
        if os.path.exists(directory_path):
            shutil.rmtree(directory_path)
            return jsonify({"message": "Template files deleted successfully"}), 200
        else:
            return jsonify({"error": "Directory does not exist"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/add-template', methods=['POST'])
def add_template():
    try:
        data = request.json
        template_collection = db.collection('templates')
        template_collection.add(data)
        return jsonify({"message": "Template added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create-directory', methods=['POST'])
def create_directory():
    data = request.json
    user_id = data['userId']
    resume_id = data['resumeId']

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_path = os.path.join(base_dir, 'frontend', 'public', 'users', user_id, resume_id)

    try:
        os.makedirs(directory_path, exist_ok=True)
        if save_cat_image(directory_path):
            return jsonify({"message": "Directory and cat image created successfully"}), 200
        else:
            return jsonify({"error": "Directory created but failed to save cat image"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload-template-files', methods=['POST'])
def upload_template_files():
    latex_file = request.files['latexFile']
    preview_image = request.files['previewImage']
    title = request.form['title']

    # Generate a unique identifier for the directory
    unique_id = str(uuid.uuid4())

    # Ensure directory for the template exists
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_path = os.path.join(base_dir, 'frontend', 'public', 'templates', unique_id)
    os.makedirs(directory_path, exist_ok=True)

    # Save files
    latex_file_path = os.path.join(directory_path, "resume.tex")
    preview_image_path = os.path.join(directory_path, "preview.jpeg")

    latex_file.save(latex_file_path)
    preview_image.save(preview_image_path)

    # Return the file paths along with the unique ID and readable title
    return jsonify({
        "uniqueId": unique_id,
        "title": title,
        "latexFilePath": latex_file_path,
        "previewImagePath": preview_image_path
    }), 200





if __name__ == '__main__':
    app.run(debug=True)

