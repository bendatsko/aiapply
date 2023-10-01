import openai
from datetime import datetime
import os

# Load OpenAI API Key
openai.api_key = os.environ.get("OPENAI_API_KEY")
model_engine = "gpt-4"

def process_template(profile, job, template):
    # OpenAI API call and template processing should be done here.
    # Use the OpenAI API to fill in the template based on the provided profile and job.
    
    messages = [
        {"role": "system", "content": "You are a LaTeX-specialized AI assistant and a MIT Google Resume expert at RIVIAN ENGINEERING that has very technical engineering knowledge and is a concise and effective communicator that builds and critiques resumes. you are a professional in everything."},
        {"role": "user", "content": f"Fill in this LaTeX resume template with the following profile: {profile}. The job posting is for: {job}. Use the resume template: {template}."}
    ]
    
    response = openai.ChatCompletion.create(
        model=model_engine,
        messages=messages,
    )
    
    latex_code = response.choices[0]['message']['content']
    start_index = latex_code.find('\\documentclass')
    end_index = latex_code.rfind('\\end{document}')
    
    if start_index != -1 and end_index != -1:
        latex_code = latex_code[start_index:end_index + len('\\end{document}')]
        return latex_code
    else:
        raise ValueError("Incomplete or invalid LaTeX code returned by API")
