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
from termcolor import colored
import subprocess
from pdf2image import convert_from_path

# Be sure to install poppler "brew install poppler"


filename = f"input_{int(time.time())}.tex"
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Initialize Firestore DB
cred = credentials.Certificate('aiapply-d1325-firebase-adminsdk-9i1rz-ed9caa2f62.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()



import requests


def compile_latex_to_pdf(latex_file_path):
    try:
        result = subprocess.run(
            ['pdflatex', '-output-directory', os.path.dirname(latex_file_path), latex_file_path],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("LaTeX file compiled to PDF successfully.")
        print("Subprocess output:", result.stdout.decode())
    except subprocess.CalledProcessError as e:
        print(f"Error compiling LaTeX file: {e}")
        print("Subprocess stderr:", e.stderr.decode())


def convert_pdf_to_jpeg(pdf_file_path, output_dir):
    try:
        images = convert_from_path(pdf_file_path)
        if images:
            image_path = os.path.join(output_dir, 'preview.jpeg')
            images[0].save(image_path, 'JPEG')
            print(f"PDF converted to JPEG at {image_path}.")
            return image_path
        else:
            print("No images found in PDF.")
            return None
    except Exception as e:
        print(f"Error converting PDF to JPEG: {e}")
        return None

# Add this function to your Flask app
def save_cat_image(directory_path):
    try:
        # URL of an API that provides cat images
        cat_image_url = "https://cataas.com/cat"
        response = requests.get(cat_image_url)

        if response.status_code == 200:
            with open(os.path.join(directory_path, 'preview.jpeg'), 'wb') as file:
                file.write(response.content)
            return True
    except Exception as e:
        print(f"Error saving cat image: {e}")
        return False



@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    data = request.json
    resume_data = data['resumeData']
    user_profile = data['userProfile']
    template_unique_id = resume_data['templateUniqueId']
    user_id = resume_data['userId']
    resume_id = resume_data['resumeId']

    print(colored(f"Received resume data for user {user_id}", "blue"))
    print(colored(f"Processing resume with Template ID: {template_unique_id}", "blue"))

    # Fetch LaTeX template
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    template_path = os.path.join(base_dir, 'frontend', 'public', 'templates', template_unique_id, 'resume.tex')
    with open(template_path, 'r') as file:
        latex_template = file.read()
    print(colored("LaTeX template:", "green"))
    print(latex_template)  # Debug print

    # Create a structured prompt for OpenAI
    prompt = create_openai_prompt(user_profile, resume_data)
    print(colored("Sending data to OpenAI API...", "yellow"))

    # Generate resume content with OpenAI
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1024  # Adjust as needed
        )
        generated_content = response.choices[0].text.strip()
        print(colored("Generated content:", "green"))
        print(generated_content)  # Debug print


        # Format the generated content to fit the LaTeX template
        formatted_resume = format_for_latex(generated_content, latex_template)
        print(colored("Formatted LaTeX content:", "green"))
        print(formatted_resume)  # Debug print

        # Save the formatted resume as a .tex file in the user's resume directory
        resume_directory = os.path.join(base_dir, 'frontend', 'public', 'users', user_id, resume_id)
        os.makedirs(resume_directory, exist_ok=True)
        latex_file_path = os.path.join(resume_directory, 'resume.tex')
        with open(latex_file_path, 'w') as file:
            file.write(formatted_resume)
        print(colored(f"Saved formatted resume to {latex_file_path}", "green"))

       # Compile LaTeX to PDF
        compile_latex_to_pdf(latex_file_path)

        # Convert PDF to JPEG
        pdf_file_path = latex_file_path.replace('.tex', '.pdf')
        convert_pdf_to_jpeg(pdf_file_path, resume_directory)



        return jsonify({"message": "Resume generated and saved successfully"}), 200
    except Exception as e:
        print(colored(f"Error in generating resume: {e}", "red"))
        return jsonify({"error": str(e)}), 500




def create_openai_prompt(user_profile, job_application):
    # Format the user profile and job application into a structured prompt
    # For example, list skills, experiences, education, and the target job description
    prompt = f"Create a professional resume for the following profile:\n\n{user_profile}\n\nApplying for:\n{job_application}\n\n"
    return prompt

def format_for_latex(generated_content, latex_template):
    # Format the generated content to fit the LaTeX template
    # This might involve replacing placeholders in the LaTeX template with the generated content
    formatted_resume = latex_template.replace("[CONTENT_PLACEHOLDER]", generated_content)
    return formatted_resume




@app.route('/delete-user-resume', methods=['POST'])
def delete_user_resume():
    data = request.json
    user_id = data['userId']
    resume_id = data['resumeId']

    # Construct the path to the resume directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_path = os.path.join(base_dir, 'frontend', 'public', 'users', user_id, resume_id)

    try:
        # Check if directory exists and then remove it
        if os.path.exists(directory_path):
            shutil.rmtree(directory_path)
            return jsonify({"message": "User resume files deleted successfully"}), 200
        else:
            return jsonify({"error": "Directory does not exist"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

