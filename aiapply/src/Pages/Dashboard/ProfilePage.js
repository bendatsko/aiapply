import React, { useState, useEffect } from 'react'; // Import useEffect
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../../firebase';
import './ProfilePage.css';

function ProfilePage({ userId, onProfileUpdated, onModalClose }) {
  console.log('UserId in ProfilePage:', userId);
  const [aboutUser, setAboutUser] = useState(''); // New State for About User

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setAboutUser(userDoc.data().aboutUser || '');
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
        await updateDoc(userRef, { aboutUser });
        onProfileUpdated({ message: 'User profile updated!', type: 'success' });
        onModalClose();
      } else {
        console.error('UserId is undefined');
        onProfileUpdated({ message: 'Error updating profile: User Id is missing', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      onProfileUpdated({ message: 'Failed to update profile', type: 'error' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2 className="about-user-title">Who are you?</h2>
      <textarea 
          value={aboutUser} 
          onChange={(e) => setAboutUser(e.target.value)} 
          placeholder="Hi, I am [Your Name] and I am [Your Professional/Educational Background and Experience]..."
          className="about-user-textarea"
      />
      <p>Your information will be used to enhance your resume and align it with potential job roles to help you stand out.</p>
      <button type="submit" className="update-profile-button">Update Profile</button>    
    </form>
  );
}

export default ProfilePage;
