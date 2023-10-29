import React, {useEffect, useState} from 'react'; // Import useEffect
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../../firebase';
import './ProfilePage.css';
import {Button, Modal} from "react-bootstrap";

function ProfilePage({userId, onProfileUpdated, onModalClose}) {
    console.log('UserId in ProfilePage:', userId);
    const [aboutUser, setAboutUser] = useState(''); // New State for About User
    const [formData, setFormData] = useState({
        education: [],
        workExperience: [],
        skills: [],
        projects: [],
    });


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (userId) {
                    const userRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setAboutUser(userData.aboutUser || '');
                        setFormData({
                            education: userData.education || [],
                            workExperience: userData.workExperience || [],
                            skills: userData.skills || [],
                            projects: userData.projects || [],
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchProfile();
    }, [userId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userId) {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    aboutUser,
                    ...formData
                });
                onProfileUpdated({message: 'User profile updated!', type: 'success'});
                onModalClose();
            } else {
                console.error('UserId is undefined');
                onProfileUpdated({message: 'Error updating profile: User Id is missing', type: 'error'});
            }
        } catch (error) {
            console.error('Error updating profile: ', error);
            onProfileUpdated({message: 'Failed to update profile', type: 'error'});
        }
    };


    const handleAddEntry = (section) => () => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: [...prevData[section], {title: '', description: ''}],
        }));
    };

    const handleRemoveEntry = (section, index) => () => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: prevData[section].filter((_, i) => i !== index),
        }));
    };

    const handleEntryChange = (section, index, field) => (event) => {
        setFormData((prevData) => {
            const entries = [...prevData[section]];
            entries[index][field] = event.target.value;
            return {...prevData, [section]: entries};
        });
    };


    const handleSaveEntry = (section, index) => async () => {
        try {
            if (userId) {
                const userRef = doc(db, 'users', userId);
                // Update only the specific section and index
                const updatedEntry = formData[section][index];
                const updatedData = {...formData};
                updatedData[section] = formData[section].map((entry, idx) => idx === index ? updatedEntry : entry);

                await updateDoc(userRef, updatedData);
                onProfileUpdated({message: `Entry in ${section} updated!`, type: 'success'});
            } else {
                console.error('UserId is undefined');
                onProfileUpdated({message: 'Error updating entry: User Id is missing', type: 'error'});
            }
        } catch (error) {
            console.error(`Error updating entry in ${section}: `, error);
            onProfileUpdated({message: `Failed to update entry in ${section}`, type: 'error'});
        }
    };


    return (
        <form onSubmit={handleSubmit} className="profile-form">
            {['education', 'workExperience', 'skills', 'projects'].map((section) => (
                <div key={section} className="profile-section">
                    <div className="section-header">
                        <h2 className="profile-section-title">{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
                        <button type="button" onClick={handleAddEntry(section)} className="profile-button add-button">
                            Add
                        </button>
                    </div>

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
                            <button type="button" onClick={handleSaveEntry(section, index)}
                                    className="profile-button save-button">
                                Save Entry
                            </button>
                        </div>
                    ))}


                </div>

            ))}
            <Modal.Footer>
                <Button variant="primary" onClick={onModalClose} className={"close-profile-button"}>Close</Button>
                <Button type="primary" className="update-profile-button">Save All Changes</Button>
            </Modal.Footer>
        </form>
    );
}

export default ProfilePage;
