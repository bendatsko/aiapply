import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, auth, googleProvider, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';  // You might need to install date-fns


const AddTemplateModal = ({ isOpen, onClose, onAddSuccess, user }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [latexFile, setLatexFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleFileChange = (e, setFile) => {
        if (e.target.files.length) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file, path) => {
        if (!file) return null;
        const fileRef = ref(storage, path);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('latexFile', latexFile);
        formData.append('previewImage', previewImage);
        formData.append('title', title);
    
        try {
            const response = await fetch('http://localhost:5000/upload-template-files', {
                method: 'POST',
                body: formData,
            });
            
            const fileData = await response.json();
            if (response.ok) {
                // Construct file paths using the UUID returned from the server
                const latexFilePath = `${fileData.uniqueId}/resume.tex`;
                const previewImagePath = `${fileData.uniqueId}/preview.jpeg`;
                
                // Now, include the uniqueId in your Firestore document
                await addDoc(collection(db, 'templates'), {
                    title: fileData.title, // or just "title", if you prefer
                    description,
                    publishedBy: "AiApply",
                    publishDate: format(new Date(), 'yyyy-MM-dd'),  // Format the current date
                    latexFileURL: latexFilePath,
                    preview: previewImagePath,
                    uniqueId: fileData.uniqueId,  // Store the uniqueId
                });
        
                onClose();
                onAddSuccess(); // Call the callback after success
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };
    
    
    

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create a New Template</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description (markdown)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>LaTeX File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => handleFileChange(e, setLatexFile)}
                            accept=".tex"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Preview Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => handleFileChange(e, setPreviewImage)}
                            accept="image/*"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddTemplateModal;
