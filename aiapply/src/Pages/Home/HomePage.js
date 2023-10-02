import React from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';
import placeholder from '../../images/placeholder.JPG'; // Please ensure this path is correct.

function HomePage() {
    console.log("HomePage rendered");

    return (<div className="home-container">


                <Navbar/>
            <div className="banner text-center py-5">
                <div className="banner-content">
                    <h1 className="display-4 mb-4">AiApply</h1>
                    <p className="lead mb-4">Empower your career journey with our AI-driven resume customization!</p>
                    <Link className="btn btn-accent btn-lg" to="/login">Create Your Resume</Link>
                </div>
            </div>
            <div className="content-container py-5">
                <h2 className="mb-4">What Do We Offer?</h2>
                <div className="row justify-content-center">
                    {[{
                        title: "Personalized Profiles",
                        content: "Create a comprehensive user profile through our intuitive interface, inputting your experiences and credentials, to help tailor your resume effectively."
                    }, {
                        title: "Smart Parsing",
                        content: "Upload your existing resumes. Our AI will smartly parse and integrate the information to your user profile, making the profile creation process seamless."
                    }, {
                        title: "Dynamic Tailoring",
                        content: "AiApply examines job postings and adapts your resume by emphasizing relevant experiences, ensuring that your application stands out to employers."
                    }, {
                        title: "Flexible Formats",
                        content: "Download your tailored resumes in multiple formats, including LaTeX and Word Document, granting you the flexibility to choose the format that suits your application needs."
                    },].map(({title, content}, index) => (<div className="col-md-5 mb-4" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{title}</h5>
                                    <p className="card-text">{content}</p>
                                </div>
                            </div>
                        </div>))}
                </div>
            </div>
            <div className="team-container py-5">
                <h2 className="mb-4">Meet Our Team</h2>
                <div className="row justify-content-center">
                    {[{
                        name: "John Doe",
                        title: "CEO & Founder",
                        description: "With extensive experience in the tech industry, John is passionate about leveraging AI to help individuals advance their careers."
                    }, {
                        name: "Jane Smith",
                        title: "CTO",
                        description: "Jane's innovative approach to technology has played a crucial role in the development of our cutting-edge AI resume customization tool."
                    },].map(({name, title, description}, index) => (<div className="col-md-5 mb-4" key={index}>
                            <div className="card">
                                <img src={placeholder} alt="Team Member" className="card-img-top"/>
                                <div className="card-body">
                                    <h5 className="card-title">{name}</h5>
                                    <p className="card-subtitle mb-2 text-muted">{title}</p>
                                    <p className="card-text">{description}</p>
                                </div>
                            </div>
                        </div>))}
                </div>
            </div>
            <div className="footer py-4">
                <div className="container text-center">
                    <p>&copy; 2023 AiApply. All Rights Reserved.</p>
                    <p><Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link></p>
                </div>
            </div>
        </div>);
}

export default HomePage;
