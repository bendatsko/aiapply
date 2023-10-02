import React from 'react';
import Navbar from '../Home/Navbar'; // Adjust the path as needed.
import './AboutPage.css'; // Make sure to create this file.

function AboutPage() {
    return (
        <div className="about-container">
            <Navbar />

            <div className="section">
                <h2 className="mb-4">How it Works</h2>
                <ol>
                    <li>
                        <h5>Input your User Profile</h5>
                        <p>Create a comprehensive user profile, inputting your experiences, credentials, and skills, to help tailor your resume effectively.</p>
                    </li>
                    <li>
                        <h5>Input your Job Posting</h5>
                        <p>Submit the job postings you are interested in. Our system will analyze the requirements and desired skills listed in the postings.</p>
                    </li>
                    <li>
                        <h5>Receive a Customized Resume</h5>
                        <p>Get a tailor-made resume emphasizing your relevant experiences, ensuring that your application stands out to employers.</p>
                    </li>
                </ol>
            </div>

            <div className="section">
                <h2 className="mb-4">Our Story</h2>
                <p>
                    It all started with us, John and Ryan, having acquired a diverse set of skills and experiences throughout our lives.
                    We found the process of applying for jobs tedious and time-consuming, as it required constantly putting our "best foot forward."
                    Each application felt like a chore, considering the highly competitive industry we are in.
                </p>
                <p>
                    We've been through countless resume review sessions with friends, realizing how crucial such reviews are, yet also realizing
                    not everyone has access to this kind of feedback. So, we thought, why not create a platform where everyone can have their resume
                    reviewed by a hypothetical recruiter? A tool that allows you to control and personalize your application to fit the role you are
                    applying for perfectly.
                </p>
                <p>
                    And thus, AiApply was born, with the mission to empower every individual's career journey with our AI-driven resume customization tool.
                </p>
            </div>

            <div className="footer py-4">
                <div className="container text-center">
                    <p>&copy; 2023 AiApply. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
