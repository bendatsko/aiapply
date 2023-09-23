import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';
import Navbar from './Navbar'; // Importing Navbar Component
import ThreeAnimation from './ThreeAnimation'; // Adjust path as needed

function HomePage() {
      console.log("HomePage rendered");

  return (
    <div className="home-container">
      <Navbar />
      <div className="banner text-white text-center py-5">
  <div className="banner-content">
    <h1 className="display-4 mb-4">AiApply</h1>
    <p className="lead mb-4">Customize your resume with the power of AI today</p>
    <Link className="btn btn-light btn-lg" to="/purchase">Get Started</Link>
  </div>
    <div className="three-animation-container">
        <div className="three-animation">
        <ThreeAnimation />
        </div>
    </div>
    </div>
      <div className="content-container py-5">
        <h2 className="mb-4">What Do We Offer?</h2>
        <div className="row">
          {[
            {
              title: "Personalized Profiles",
              content: "Create a comprehensive user profile through our intuitive interface, inputting your experiences and credentials, to help tailor your resume effectively."
            },
            {
              title: "Smart Parsing",
              content: "Upload your existing resumes. Our AI will smartly parse and integrate the information to your user profile, making the profile creation process seamless."
            },
            {
              title: "Dynamic Tailoring",
              content: "AiApply examines job postings and adapts your resume by emphasizing relevant experiences, ensuring that your application stands out to employers."
            },
            {
              title: "Flexible Formats",
              content: "Download your tailored resumes in multiple formats, including LaTeX and Word Document, granting you the flexibility to choose the format that suits your application needs."
            },
          ].map(({ title, content }, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">{content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
