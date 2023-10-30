import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ProfilePage.css';
import { Button, Modal } from "react-bootstrap";

function ProfilePage({ userId, isProfileModalOpen, onProfileUpdated, onModalClose }) {
    const [aboutUser, setAboutUser] = useState('');
    const [activeTab, setActiveTab] = useState('education');
    const [formData, setFormData] = useState({
        education: [],
        experience: [],
        skills: [],
        projects: [],
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (userId) {
                try {
                    const userRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setAboutUser(userData.aboutUser || '');
                        setFormData({
                            education: userData.education || [],
                            experience: userData.experience || [],
                            skills: userData.skills || [],
                            projects: userData.projects || [],
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };
        fetchProfile();
    }, [userId]);

    const handleTabChange = (e, tabName) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveTab(tabName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userId) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, { aboutUser, ...formData });
                onProfileUpdated({ message: 'User profile updated!', type: 'success' });
                onModalClose();
            } catch (error) {
                console.error('Error updating profile: ', error);
                onProfileUpdated({ message: 'Failed to update profile', type: 'error' });
            }
        } else {
            onProfileUpdated({ message: 'Error updating profile: User Id is missing', type: 'error' });
        }
    };

    const handleAddEntry = (section) => () => {
        setFormData(prevData => ({
            ...prevData,
            [section]: [...prevData[section], { title: '', description: '' }]
        }));
    };

    const handleRemoveEntry = (section, index) => () => {
        setFormData(prevData => ({
            ...prevData,
            [section]: prevData[section].filter((_, i) => i !== index)
        }));
    };

    const handleEntryChange = (section, index, field) => (event) => {
        setFormData(prevData => {
            const entries = [...prevData[section]];
            entries[index][field] = event.target.value;
            return { ...prevData, [section]: entries };
        });
    };

    return (
        <Modal show={isProfileModalOpen} onHide={onModalClose}>

                <form onSubmit={handleSubmit} className="profile-form">
                    <Modal.Header closeButton>
                        <Modal.Title>My Portfolio</Modal.Title>
                    </Modal.Header>
                    <div className="profile-tabs">
                        {['education', 'experience', 'skills', 'projects'].map((section) => (
                            <button
                                key={section}
                                className={`tab ${activeTab === section ? 'active-tab' : ''}`}
                                onClick={(e) => handleTabChange(e, section)}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        ))}
                    </div>

                    {['education', 'experience', 'skills', 'projects'].map((section) => (
                        activeTab === section ? (
                            <div key={section} className="profile-section">
                                {formData[section].map((entry, index) => (
                                    <div key={index} className="entry">
                                        <input
                                            className="profile-input"
                                            value={entry.title}
                                            onChange={handleEntryChange(section, index, 'title')}
                                            placeholder="Title"
                                        />
                                        <textarea
                                            className="profile-textarea"
                                            value={entry.description}
                                            onChange={handleEntryChange(section, index, 'description')}
                                            placeholder="Description"
                                        />
                                        <button type="button" onClick={handleRemoveEntry(section, index)}
                                                className="profile-button remove-button">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddEntry(section)} className="profile-button add-button">
                                    Add Entry
                                </button>
                            </div>
                        ) : null
                    ))}
                    <Modal.Footer>
                        <Button variant="secondary" className={"profile-close-button"} onClick={onModalClose}>Close</Button>
                        <Button type="submit" className="update-profile-button" onClick={handleSubmit}>Save All Changes</Button>
                    </Modal.Footer>
                </form>


        </Modal>
    );
}

export default ProfilePage;
