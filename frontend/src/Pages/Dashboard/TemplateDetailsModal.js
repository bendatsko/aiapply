import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { deleteDoc, doc } from 'firebase/firestore'; // Import these
import { db } from '../../firebase'; // Adjust the import path as necessary
import './TemplateDetailsModal.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function TemplateDetailsModal({ isOpen, onClose, template, isAdmin, onTemplateDelete }) {

    if (!template) return null;

    const handleCreateResume = () => {
        // Logic to create resume with the template
    };

    const handleOpenInOverleaf = () => {
        // Logic to open in Overleaf
    };

    const handleDeleteTemplate = async () => {
        try {
            await deleteDoc(doc(db, 'templates', template.id));
            // After deleting from Firebase, delete the files from the server
            const response = await fetch('http://localhost:5000/delete-template-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uniqueId: template.uniqueId }), // Send the unique ID
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete template files');
            }
    
            onClose();
            if (onTemplateDelete) {
                onTemplateDelete();  // Call this function after deleting
            }
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };
    

    const createMarkup = (markdownText) => {
        const rawMarkup = marked(markdownText, { sanitize: true });
        return { __html: DOMPurify.sanitize(rawMarkup) };
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
                        <div className="template-description" dangerouslySetInnerHTML={createMarkup(template.description)}></div>
                        <div className="template-buttons">
                            <Button variant="primary" onClick={handleCreateResume}>Create Resume With Template</Button>
                            <Button variant="secondary" onClick={handleOpenInOverleaf}>Open in Overleaf</Button>
                            {isAdmin && <Button variant="danger" onClick={handleDeleteTemplate}>Delete Template</Button>}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default TemplateDetailsModal;
