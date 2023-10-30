import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance

function AdminPanel({ onClose, onAddTemplateClick }) {
    const [userCount, setUserCount] = useState(0); // State to hold the total user count
    const [resumeCount, setResumeCount] = useState(0); // State to hold the total resume count

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetching the total number of users
                const userCollectionRef = collection(db, 'users');
                const userSnapshot = await getDocs(userCollectionRef);
                setUserCount(userSnapshot.size);

                // Fetching the total number of resumes
                const resumeCollectionRef = collection(db, 'resumes');
                const resumeSnapshot = await getDocs(resumeCollectionRef);
                setResumeCount(resumeSnapshot.size);

            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);



    return (
        <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Admin Panel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Total Users Registered: {userCount}</p>
                <p>Total Resumes Generated: {resumeCount}</p>
                <Button onClick={onAddTemplateClick}>Add Template</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
}

export default AdminPanel;
