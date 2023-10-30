import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './TemplateDetailsModal.css'; // Import your custom CSS file for styling

function ResumeDetailsModal({ isOpen, onClose, resume, deleteResume }) {
    if (!resume) return null;

    // Convert Firestore timestamp to JavaScript Date
    const createdAtDate = resume.createdAt ? new Date(resume.createdAt.seconds * 1000) : null;

    const jobPosting = resume.jobPosting;

    // Create the latexPath by replacing 'preview.jpeg' with 'latex.tex'
    const latexPath = resume.previewImagePath.replace('preview.jpeg', 'resume.tex');

    const handleDeleteResume = async () => {
        // Call the existing deleteResume function
        deleteResume(resume.id);

        // Make an API request to delete the associated files
        const deleteFilesResponse = await fetch('http://localhost:5000/delete-user-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: resume.userId, // Assuming you have userId in resume object
                resumeId: resume.id,
            }),
        });

        const result = await deleteFilesResponse.json();
        if (deleteFilesResponse.ok) {
            console.log(result.message);
        } else {
            console.error(result.error);
        }

        onClose(); // Close the modal after deletion
    };


    const handleShowLatex = () => {
        // Navigate to or display the latexPath
        window.open(latexPath, '_blank'); // This will open the LaTeX file in a new tab
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered className="template-details-modal">
            <Modal.Header closeButton>
                <Modal.Title>Resume Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className="template-modal-content">

                        <div className="template-image-container">
                            <img src={resume.previewImagePath} alt={resume.title} className="template-image" />
                        </div>
                        <div className="template-details-container">
                            <h3>{resume.title}</h3>
                            <p>
                                <strong>Created:</strong> {createdAtDate ? createdAtDate.toLocaleDateString() : 'Unknown'}
                            </p>
                            <strong>Job Posting:</strong>
                            <div className="job-posting-container">
                                 {jobPosting}
                            </div>
                            <div className="template-buttons">
                                <Button variant="primary" onClick={handleShowLatex}>Show Latex</Button>
                                <Button variant="danger" onClick={handleDeleteResume}>Delete Resume</Button>
                            </div>
                        </div>


                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default ResumeDetailsModal;
