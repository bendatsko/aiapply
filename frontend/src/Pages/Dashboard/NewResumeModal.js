import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import "./NewResumeModal.css";
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
    const [selectedTemplateUniqueId, setSelectedTemplateUniqueId] = useState('');
    const [loading, setLoading] = useState(false); // Add this line



    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setJobPosting('');
            setSelectedTemplateId(templates[0]?.id || '');
            setSelectedTemplateUniqueId(templates[0]?.uniqueId || '');
        }
    }, [isOpen, templates]);

    if (!user) {
        return null;
    }

    const handleTemplateChange = (e) => {
        const selectedId = e.target.value;
        setSelectedTemplateId(selectedId);
        const selectedTemplate = templates.find(template => template.id === selectedId);
        setSelectedTemplateUniqueId(selectedTemplate?.uniqueId || '');
    };

    console.log("user " + user.id + " is visiting new resume modal");

    const generateResume = async () => {
        setLoading(true); // Start loading

        try {
            const resumeId = uuidv4();
            const previewImagePath = `/users/${user.uid}/${resumeId}/preview.jpeg`;

            const newResume = {
                createdAt: new Date(),
                previewImagePath,
                title,
                userId: user.uid,
                jobPosting,
                templateId: selectedTemplateId,
                templateUniqueId: selectedTemplateUniqueId,
                resumeId  // Add resumeId here
            };

            const resumeRef = doc(db, 'resumes', resumeId);
            await setDoc(resumeRef, newResume);

            await fetch('http://localhost:5000/create-directory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: user.uid, resumeId: resumeId})
            });

            const userProfileRef = doc(db, 'users', user.uid);
            const userProfileDoc = await getDoc(userProfileRef);
            const userProfileData = userProfileDoc.exists() ? userProfileDoc.data() : {};

            const dataToSend = {
                resumeData: newResume,
                userProfile: userProfileData
            };

            await fetch('http://localhost:5000/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            setTimeout(() => {
                fetchResumeData();
            }, 300);

            setLoading(false); // Stop loading after successful operation
            onClose();
        } catch (error) {
            console.error("Error creating new resume: ", error);
            setLoading(false); // Stop loading after successful operation

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
                            onChange={handleTemplateChange}
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
                <Button variant="secondary" className={"closeButton"} onClick={onClose}>Close</Button>
                <Button variant="primary" className={"generateResumeButton"} onClick={generateResume} disabled={loading}>
                    {loading && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: '5px' }} // Add right padding here
                        />
                    )}
                    Generate
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewResumeModal;
