import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {doc, setDoc} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import {db} from '../../firebase';

const NewResumeModal = ({
                            isOpen,
                            onClose,
                            user,
                            fetchResumeData,
                            templates
                        }) => {

    const [title, setTitle] = useState('');
    const [jobPosting, setJobPosting] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    useEffect(() => {
        // Reset form when modal is opened
        if (isOpen) {
            setTitle('');
            setJobPosting('');
            setSelectedTemplateId(templates[0]?.id || '');
        }
    }, [isOpen, templates]);

    if (!user) {
        return null;
    }

    console.log("user " + user.id + " is visiting new resume modal");

    const generateResume = async () => {
        try {
            const resumeId = uuidv4();
            const previewImagePath = `/users/${user.uid}/${resumeId}/preview.jpeg`;

            const newResume = {
                createdAt: new Date(),
                previewImagePath,
                title, // Use the state title
                userId: user.uid,
                jobPosting, // Store the job posting
                templateId: selectedTemplateId // Store the selected template ID
            };

            // Add the new resume to Firestore with resumeId as the document ID
            const resumeRef = doc(db, 'resumes', resumeId);
            await setDoc(resumeRef, newResume);

            await fetch('http://localhost:5000/create-directory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: user.uid, resumeId: resumeId})
            });

            setTimeout(() => {
                fetchResumeData();
            }, 5000);

            onClose(); // Close the modal
        } catch (error) {
            console.error("Error creating new resume: ", error);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Job Posting (URL or Description):</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={jobPosting}
                            onChange={(e) => setJobPosting(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Choose a Template:</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                        >
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={generateResume}>Generate</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewResumeModal;
