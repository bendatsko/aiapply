import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import './TemplateDetailsModal.css'; // Import your custom CSS file for styling

function ResumeDetailsModal({isOpen, onClose, resume, deleteResume}) {
    if (!resume) return null;

    // Convert Firestore timestamp to JavaScript Date
    const createdAtDate = resume.createdAt ? new Date(resume.createdAt.seconds * 1000) : null;

    const handleDeleteResume = () => {
        deleteResume(resume.id);
        onClose(); // Close the modal after deletion
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
                            <img src={resume.previewImagePath} alt={resume.title} className="template-image"/>
                        </div>
                        <div className="template-details-container">
                            <h3>{resume.title}</h3>
                            <p>
                                <strong>Created:</strong> {createdAtDate ? createdAtDate.toLocaleDateString() : 'Unknown'}
                            </p>
                            <div className="template-buttons">
                                <Button variant="danger" onClick={handleDeleteResume}>Delete Resume</Button>
                                <Button variant="secondary" onClick={onClose}>Close</Button>
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
