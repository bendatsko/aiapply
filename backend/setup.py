import openai
import os
import json
from dotenv import load_dotenv
from datetime import datetime

# Make a json file that holds all of the templates. Then select them by name in this the python file instead of having random shit.
# Pass user input parameters to this from the front end. Make a new file. Generate the resume, generate a UUID, and store it with that UUID in the user folder.

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")
model_engine = "gpt-4"

JOB = r"""
RIVIAN Software Engineering, Summer 2024 Internships
Palo Alto, California
Internships
About Rivian

Rivian is on a mission to keep the world adventurous forever. This goes for the emissions-free Electric Adventure Vehicles we build, and the curious, courageous souls we seek to attract. 

As a company, we constantly challenge what’s possible, never simply accepting what has always been done. We reframe old problems, seek new solutions and operate comfortably in areas that are unknown. Our backgrounds are diverse, but our team shares a love of the outdoors and a desire to protect it for future generations. 


Role Summary

Internship Term: Summer 2024
 
This is a bucket application, and is not an official opening. Your application can be considered for Rivian’s 2024 internship programs. If you are selected, you will receive an invitation to interview for an open posting.
 
Rivian internships are experiences optimized for student candidates. To be eligible, you must be an undergraduate or graduate student in an accredited program during the internship term with an expected graduation date between December 2024 and June 2026.
 
If you are not pursuing a degree, please see our full time positions on our Rivian careers site.
 
Note that if your university has specific requirements for internship programs, it is your responsibility to fulfill those requirements.

Responsibilities

Applying to this opening will place you into consideration for Rivian’s 2024 internship program.
Teams your application can be considered for include:
Digital Platforms
Mobile Development (Android or iOS)
Internal Applications
DevOps
Security
Fullstack Development
Front-end Development
Back-end Development

Qualifications

Must be currently pursuing a bachelors, masters, or PhD degree
Actively pursuing a degree or one closely related in Computer Science, Computer Engineering, or similar. 
Experience in software development and coding in one or more of the following languages: Python, Java, Javascript, Kotlin, Ruby, GoLang, Typescript, or similar.
Experience and familiarity with data structures and algorithms. 
Must have excellent written and verbal communication skills
Ability to navigate ambiguity in a fast-paced environment
Capable of working as a member of a team across several cross functional disciplines, including with external stakeholders

"""

PROFILE = r"""
Name: piss fuck
LinkedIn: https://www.linkedin.com/ryankima
GitHub: https://www.github.com/ryankima
Phone Number: 734-787-8832
Email: ryankima@umich.edu

Education:
	Michigan State Univeristy, Bachelor of Bartending, Minor in being unpleasant; GPA: 2.7, August 2021 to Present. Coursework: {Fill in with what you think would be appropriate, separated by commas}; Expected Graduation: May 2025; Location: East Lansing, MI

	Technische Universität Berlin; Study Abroad; International laboratory experience in robotics programming; May 2022 to June 2022; Location: Berlin, Germany

Experience:
Engineering Development Group Intern Natick, MA
The Mathworks May 2023 - Aug 2023
Pioneered code generation pipeline allowing for GPU hardware acceleration through Vulkan yielding 2x speed ups in matrix operations with generated compute shaders. Leveraged open source software to reduce future development time and introduce novel optimizations in code
generation pipeline. Expanded GPU acceleration code generation to target additional hardware platforms through the usage of IREE. Created MLIR conversion passes to convert internal code generated intermediate representation allowing for the
utilization of pretrained third party machine learning models

Student Fellow Ann Arbor, MI
Consortium for Monitoring, Technology, and Verification - University of Michigan Jun 2022 - May 2023
◦ Overhauled existing software architecture for low-cost Geiger Counter resulting in increased hardware performance,
greater device compatibility, and lower future maintenance requirements
◦ Developed software to read from sensors connected to Raspberry Pi for monitoring radiation in the environment
◦ Created custom wiring harnessing to connect sensors with custom PCB while maintaining vibration safety,
durability, and ease of maintenance. Identified design flaws in PCBs for future revision improvements
◦ Wrote and delivered presentations for national conferences to effectively convey research

Instructional Assistant Ann Arbor, MI
University of Michigan Aug 2022 - Dec 2022
◦ Developed course lessons for introductory engineering to effectively teach concepts of introductory electrical
engineering, radiation science, and radiation detection in a team-focused environment
◦ Ensured safety compliance of students handling radiological sources with aspects of lesson planning, personal
protective equipment, and execution of labs
◦ Analyzed, improved, and tested circuit design of Geiger counter made in the class by adjusting low-pass filter values
and tuning software to increase the device’s sensitivity to radiation

Assistant in Research Ann Arbor, MI
University of Michigan Sep 2021 - May 2022
◦ Developed firmware for custom sensors connected to autonomous drone running PX4 autopilot utilizing reliable
communication protocols with SPI and UART
◦ Performed design analysis to balance weight and power of system computers for aerial drone applications with
necessary computational strength
◦ Created custom hardware development environment to test communications protocols and boards rapidly

Languages: C/C++, Python, Java, HTML5, CSS, JavaScript, C#, SQL, Matlab
Tools: XCode, Visual Studio, Git, Github, Computer-aided Design (CAD), Raspberry Pi, SolidWorks, MySQL,
MongoDB, Android Studio, Flask, IREE, MLIR, Vulkan, GPU, Compilers
"""

USER_ID = "abcd1234"

# Define the directory path based on the user ID
user_directory = os.path.join("users", USER_ID)

if not os.path.exists(user_directory):
    os.makedirs(user_directory)

template_path = "templates/jakes-resume.tex"

# Load the template
with open(template_path, 'r') as file:
    TEMPLATE = file.read()


print("Generating resume from profile...")
messages = [
    {"role": "system", "content": "You are a LaTeX-specialized AI assistant and a MIT Google Resume expert at RIVIAN ENGINEERING that has very technical engineering knowledge and is a concise and effective communicator that builds and critiques resumes. you are a professional in everything."},
    {"role": "user", "content": f"Fill in this LaTeX resume template with the following profile: {PROFILE}. The job posting is for: {JOB}. Use the resume template: {TEMPLATE}.  The response should be a complete LaTeX document that fits within one page, 3-4 bullets using the STAR method and quantification (if necessary) for the PERFECT resume for highly competitive positions (you can use multiple independent clauses together, too, so long as you separate them with a semicolon (do not capitalize after a semicolon unless it is a proper noun); however, do not use a semicolon if you can reasonably separate it into bullet points and you can write enough for it. dont go over four of them strung together though or else your bullet may be too long). If a line past line 1 happens to span before the half way point of the line, try to trim it such that it fits on one line or add more information to fill two lines if it is necessary. Also be sure to wrap text properly if job title is very long (e.g. longer than 'Consortium for Monitoring, Technology, and Verification - University of Michigan' you could just remove university of michigan and put it in the company). only modify placeholder content. if something sounds bad embellish a lot to make the resume perfect. Please do 2-4 bullet points. GPA should be its own bullet points. DO NOT repeat skills. you should always be as good as an MIT student with a 4.0. Be sure that the grammar is perfect given the vibe of the job posting and make sure it's absolutely fantastic and wholeheartedly logical."}
]

response = openai.ChatCompletion.create(
    model=model_engine,
    messages=messages,
)

# Extract LaTeX code
latex_code = response.choices[0]['message']['content']

# Find the index where the LaTeX code starts and ends, and trim the string accordingly
start_index = latex_code.find('\\documentclass')
end_index = latex_code.rfind('\\end{document}')

# Check and slice the LaTeX string
if start_index != -1 and end_index != -1:
    latex_code = latex_code[start_index:end_index + len('\\end{document}')]

    # Save the LaTeX code to a file inside the user's directory
    output_tex_path = os.path.join(user_directory, "build.tex")
    with open(output_tex_path, "w") as f:
        f.write(latex_code)

    # Compile the LaTeX file into a PDF inside the user's directory
    os.system(f"pdflatex -interaction=nonstopmode -output-directory={user_directory} {output_tex_path}")

    print("Resume generated")
else:
    if start_index == -1 and end_index == -1:
        print("Error: No LaTeX code found.")
    elif start_index == -1:
        print("Error: LaTeX code missing \\documentclass.")
    elif end_index == -1:
        print("Error: LaTeX code missing \\end{document}.")
    else:
        print("Error: Incomplete or invalid LaTeX code returned by API")
