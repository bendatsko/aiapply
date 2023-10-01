import openai
import os
from dotenv import load_dotenv
from datetime import datetime

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
Name: Ava Torres
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

TEMPLATE = r"""
%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------


% only three bullet points man. you really need to work on this.

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item[$\circ$]\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
\begin{document}
\begin{center}
	\textbf{\Huge \scshape Benjamin Datsko} \\ \vspace{1pt}
	\small (248) 909-5982 $|$ \href{mailto:bdatsko@umich.edu}{\underline{bdatsko@umich.edu}} $|$ 
	\href{https://linkedin.com/in/bendatsko/}{\underline{linkedin.com/in/bendatsko}} $|$
	\href{https://github.com/bendatsko}{\underline{github.com/bendatsko}}
\end{center}

%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
\resumeSubheading
{University of Michigan -- College of Engineering}{Ann Arbor, MI}
{Bachelor of Science and Engineering in Computer Science, Electrical Engineering Minor}{Aug. 2021 - Apr. 2025}
\resumeItemListStart
\resumeItem{Courses: CS Theory, Computational Linear Algebra, Data Structures and Algorithms, Discrete Mathematics.}

\resumeItemListEnd
\resumeSubHeadingListEnd

%-----------EXPERIENCe-----------
\section{Experience \scriptsize \scshape [SEE MORE AT \href{https://datsko.dev/projects}{\underline{DATSKO.DEV}}]}
 
\resumeSubHeadingListStart
\resumeSubheading
{Undergraduate Research Scientist}{Ann Arbor, MI}
{Michigan Integrated Circuits Laboratory -- Flynn Research Group}{Aug. 2022 -- Present}
\resumeItemListStart
\resumeItem{Created low-noise power supply for integrated circuits testing leveraging LiPo battery cells; added comprehensive battery management system into C++-based real-time operating system; achieved signal clarity 2x cleaner than industry-grade power supplies for half the cost.}
\resumeItem{Formulated 130,000-parameter computational neural network using PyTorch for real-time object recognition to test model-on-chip RISC-V machine learning accelerator (ASIC). \textbf{Pending IEEE journal publication.}}
\resumeItem{Overhauled 40-GHz modulated RF signal source using high-resolution DAC, FPGA, and up-converter; leveraged MATLAB to produce circular single-tone, QAM, etc., sequences run on FPGA (configured in SystemVerilog).}
\resumeItem{Revised multi-axis high-torque motor control calibration system for over-the-air testing of 64-element 28-GHz digital beamformer with MATLAB and Raspberry Pi. Designed, tested, and assembled two-sided motherboard interfacing with Kintex RF FPGA; implemented beamforming algorithm in VHDL. \textbf{Pending IEEE journal publication.}}
\resumeItemListEnd

\resumeSubheading
{Strategy/Software Engineer}{Ann Arbor, MI}
{University of Michigan Solar Car Team}{Aug. 2022 -- Present}
{\textbf{}}{}
\resumeItemListStart
\resumeItem{Led project combining the University of Michigan Solar Car's four distinct simulators (C++ race simulator, Java fluid dynamics simulator, Unity vehicle dynamics simulator, and Python weather simulator) into web application.}
\resumeItem{Built a React front-end (using OAuth 2.0), four Flask-based simulator APIs, and an EJS REST API for interfacing with MongoDB container (Docker) to link user data to raw simulation output and statistical analysis results.}          
\resumeItemListEnd

\resumeSubheading
{Gators STR Swim Team Head Coach}{Oxford, MI}
{USA Swimming}{Apr. 2021 -- Sep. 2022}
\resumeItemListStart
\resumeItem{Created training regimen and supervised training sessions, providing direct feedback to $\sim$250 athletes.}
\resumeItem{Evaluated the effectiveness of programming through statistical analysis, witnessing growth in 90\% of athletes.}
\resumeItemListEnd

\resumeSubheading
{Information Technology Intern}{Flint, MI}
{Hurley Medical Center - Main Campus}{Jun. 2021 -- Aug. 2021}
\resumeItemListStart
\resumeItem{Devised Shell scripts to automate disk encryption and perform proprietary operating system cloning.}
\resumeItem{Performed hardware and software-level maintenance on medical devices, servers, and workstations.}
\resumeItemListEnd
\resumeSubHeadingListEnd
  

%-----------PROJECTS-----------
\section{Projects}
\resumeSubHeadingListStart
\resumeProjectHeading
{\textbf{High-Altitude Payload for UV Radiation Detection} $|$ \emph{Arduino, Altium Designer}}{}
\resumeItemListStart
\resumeItem{Engineered weather balloon payload system to conduct UV radiation intensity measurements at altitudes of 86,000 feet; data analysis provided crucial insights into long-term ozone degradation trends in southeast Michigan.}
\resumeItem{Wrote C firmware based on Super-Loop architecture to gather GPS and sensor data and Python script to parse GPS NMEA strings, extract waypoint data, and plot 42-mile-long flight path (using Google Maps API).}
\resumeItemListEnd
\resumeProjectHeading
{\textbf{Pathfinding Algorithm Visualizer} $|$ \emph{Javascript, Adobe XD}}{}
\resumeItemListStart
\resumeItem{Constructed a web application for visualizing four pathfinding algorithms (A*, Dijkstra's, BFS, and DFS) incorporating real-time start/end point editing and obstacle drawing with cursor; written in Vanilla JavaScript.}
\resumeItemListEnd
\resumeProjectHeading
{\textbf{Microsoft Partner, Realms Contributor} $|$ \emph{Java, Adobe Creative Cloud, Blender}}{}
\resumeItemListStart
\resumeItem{Developed three licensed games for Minecraft Realms -- \emph{The Missing Sandwich}, \emph{Annoying Ghosts}, and \emph{Witchcraft and Wizardry} -- utilizing Java, Adobe Creative Cloud, Blender; led team of six; garnered 600,000+ downloads.}
\resumeItemListEnd
\resumeSubHeadingListEnd


%-----------PROGRAMMING SKILLS-----------
\section{Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
	\small{\item{
		\textbf{Languages}{: C, C++, C\#, Java, JavaScript, Unix, Python, Django, Swift, Rust, MySQL, NoSQL, Verilog, RTOS.} \\
		\textbf{Technologies}{: Flask, Git, GraphQL, Kubernetes, LIDAR (feedback control), Machine Learning (OpenCV, PyTorch), Matplotlib, Node, NumPy, React, SCSS, TailwindCSS, WordPress, Azure, GSuite, Microsoft 365, Inventor, Altium.} \\
        \textbf{Extracurriculars}{: U-M Club Swim Team, U-M Climbing Team, U-M Solar Car Team, U-M Rocketry Club (MASA).} \\
	}}
\end{itemize}


%-------------------------------------------
\end{document}
"""

print("Generating resume from profile...")
messages = [
    {"role": "system", "content": "You are a LaTeX-specialized AI assistant and a MIT Google Resume expert at RIVIAN ENGINEERING that has very technical engineering knowledge and is a concise and effective communicator that builds and critiques resumes. you are a professional in everything."},
    {"role": "user", "content": f"Fill in this LaTeX resume template with the following profile: {PROFILE}. The job posting is for: {JOB}. Use the resume template: {TEMPLATE}.  The response should be a complete LaTeX document that fits within one page, 3-4 bullets using the STAR method and quantification (if necessary) for the PERFECT resume for highly competitive positions (you can use multiple independent clauses together, too, so long as you separate them with a semicolon (do not capitalize after a semicolon unless it is a proper noun); however, do not use a semicolon if you can reasonably separate it into bullet points and you can write enough for it. dont go over four of them strung together though or else your bullet may be too long). If a line past line 1 happens to span before the half way point of the line, try to trim it such that it fits on one line or add more information to fill two lines if it is necessary. Also be sure to wrap text properly if job title is very long (e.g. longer than 'Consortium for Monitoring, Technology, and Verification - University of Michigan' you could just remove university of michigan and put it in the company). only modify placeholder content. if something sounds bad embellish a lot to make the resume perfect. Please do 2-4 bullet points. GPA should be its own bullet points. DO NOT repeat skills. you shoudl always be as good as an MIT student with a 4.0. Be sure that the grammar is perfect given the vibe of the job posting and make sure it's absolutely fantastic and wholeheartedly logical."}
]

response = openai.ChatCompletion.create(
    model=model_engine,
    messages=messages,
)

# Log the response and timestamp
current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
log_entry = f"Timestamp: {current_time}\nResponse:\n{response}\n\n"
with open("log.txt", "a") as log_file:
    log_file.write(log_entry)

# Extract LaTeX code
latex_code = response.choices[0]['message']['content']

# Find the index where the LaTeX code starts and ends, and trim the string accordingly
start_index = latex_code.find('\\documentclass')
end_index = latex_code.rfind('\\end{document}')

# Check and slice the LaTeX string
if start_index != -1 and end_index != -1:
    latex_code = latex_code[start_index:end_index + len('\\end{document}')]

    # Save the LaTeX code to a file
    with open("build.tex", "w") as f:
        f.write(latex_code)
    
    # Compile the LaTeX file into a PDF
    os.system("pdflatex -interaction=nonstopmode build.tex")

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




