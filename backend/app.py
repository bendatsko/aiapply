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

        messages = [
            {"role": "system", "content": "You are a LaTeX-specialized AI assistant and a MIT Google Resume expert at RIVIAN ENGINEERING that has very technical engineering knowledge and is a concise and effective communicator that builds and critiques resumes. you are a professional in everything."},
            {"role": "user", "content": f"Fill in this LaTeX resume template with the following profile: {profile}. The job posting is for: {job}. Use the resume template: {template}. The response should be a complete LaTeX document that fits within one page, 3-4 bullets using the STAR method and quantification (if necessary) for the PERFECT resume for highly competitive positions. THIS MUST BE VALID LATEX. IF IT IS NOT VALID LATEX IT CANNOT WORK. YOU MUST NOT ADD ANYTHING MORE OR LESS THAN THE LATEX ITSELF, INCLUDING ADDITIONAL PHRASES SUCH AS AS AN AI _____. What you say is being fed directly into something else. This is NOT a conversation. you are a tool. You must act like it. From now on you can only speak in latex."}
        ]

        # Make OpenAI API call
        response = openai.ChatCompletion.create(model="gpt-4", messages=messages)
        latex_code = response.choices[0]['message']['content']

        # Return early after generating LaTeX
        return jsonify({"latex_code": latex_code}), 200

        # Add a new project to Firestore
        project_ref = db.collection('projects').add({
            'user_id': user_id,
            'latex_code': latex_code,
            'created_at': firestore.SERVER_TIMESTAMP,
            'additional_data': additional_data  # Storing additional data to Firestore
        })

        # Return early after adding to Firestore
        return jsonify({"id": project_ref.id}), 200  
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/convert_latex', methods=['POST'])
def convert_latex():
    data = request.json
    latex_code = data.get('latex_code')
    
    unique_id = int(time.time())
    filename_tex = f"input_{unique_id}.tex"
    filename_pdf = f"input_{unique_id}.pdf"
    filename_png = f"output_{unique_id}.png"

    with open(filename_tex, 'w') as file:
        file.write(latex_code)
    
    result = run(['pdflatex', '-halt-on-error', filename_tex], capture_output=True, text=True)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

    
    if not os.path.exists(filename_pdf):
        return jsonify({'error': 'Failed to convert LaTeX to PDF'}), 500
    
    images = convert_from_path(filename_pdf)
    if not images:
        return jsonify({'error': 'Failed to convert PDF to PNG'}), 500
    
    images[0].save(filename_png, 'PNG')
    
    with open(filename_png, 'rb') as file:
        base64_image = base64.b64encode(file.read()).decode('utf-8')
    
    for filename in [filename_tex, filename_pdf, filename_png]:
        if os.path.exists(filename):
            try:
                os.remove(filename)
            except Exception as e:
                print(f"Warning: Could not delete {filename}, {str(e)}")
    
    return jsonify({'image': base64_image})

if __name__ == '__main__':
    app.run(debug=True)

