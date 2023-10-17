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


@app.route('/generate_resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        user_id = data.get('user_id')
        profile = data.get('profile')
        job = data.get('job')
        template = data.get('template')
        additional_data = data.get('additional_data')  # Extract additional data
        print("Received user_id: ", user_id)


        project_ref = db.collection('projects').add({
            'user_id': user_id,
            'latex_code': latex_code,
            'created_at': firestore.SERVER_TIMESTAMP,
            'additional_data': additional_data  # Storing additional data to Firestore
        })




if __name__ == '__main__':
    app.run(debug=True)

