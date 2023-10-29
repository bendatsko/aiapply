import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import './TemplateDetailsModal.css'; // Import your custom CSS file for styling

function TemplateDetailsModal({isOpen, onClose, template}) {
    if (!template) return null;

    const handleCreateResume = () => {
        // Logic to create resume with the template
    };

    const handleOpenInOverleaf = () => {
        // Logic to open in Overleaf
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered className="template-details-modal">
            <Modal.Header closeButton>
                <Modal.Title>Template Previewer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="template-modal-content">
                    <div className="template-image-container">
                        <img src={template.previewPath} alt={template.title} className="template-image"/>
                    </div>
                    <div className="template-details-container">
                        <h3>{template.title}</h3>
                        <p><strong>Publish Date:</strong> {template.publishDate}</p>
                        <p><strong>Published By:</strong> {template.publishedBy}</p>
                        <p className="template-description">{template.description}</p>
                        <div className="template-buttons">
                            <Button variant="primary" onClick={handleCreateResume}>Create Resume With Template</Button>
                            <Button variant="secondary" onClick={handleOpenInOverleaf}>Open in Overleaf</Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default TemplateDetailsModal;
