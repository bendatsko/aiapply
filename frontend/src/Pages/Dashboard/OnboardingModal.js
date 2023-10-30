import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import './OnboardingModal.css';
import aiApplyImage from '../../images/Newspaper.svg'; // Importing the image

function OnboardingModal({ isOpen, onClose }) {
    const markdown = `
# Welcome to AiApply! 🚀


**Embark on your journey to crafting the perfect resume with AiApply. Let's make you stand out!**

- 📁 **Build Your Portfolio**: Start by adding your unique, employable experiences to 'My Portfolio'. Don't worry, you only have to do this once!
- 📄 **Tailored Resumes**: Use the 'New Resume' button to create a tailored resume for each job application. Every role is different, and so should be your resume!
- ✨ **Fine-Tuning**: Need to refine your application? Whether it's a complete overhaul, minor tweaks, or recruiter insights, we've got you covered.
- 🎨 **Templates & Community**: Get inspired by a variety of templates, or dive into the Community Tab for a peek at what fellow applicants are crafting.


`;

    // Custom components for Markdown elements
    const components = {
        img: ({ node, ...props }) => (
            <img 
                {...props} 
                className="centered-image" // Add a class for styling
            />
        )
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered className="onboarding-modal">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>Let's Go!</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OnboardingModal;
