// Dashboard.js
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firestore instance
import UserContext from './UserContext'; // Import UserContext
import './Dashboard.css';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from Bootstrap.
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaUserCircle } from 'react-icons/fa'; // Importing user icon from react-icons
import ProfilePage from './ProfilePage'; // Import the ProfilePage component
import axios from 'axios';
import AdminRibbon from './AdminRibbon';
import TemplateCard from './TemplateCard'; // Import the TemplateCard component
import ResumeCard from './ResumeCard';
import Confetti from 'react-confetti';


function Dashboard() {
  const location = useLocation();
  const userId = location.state ? location.state.userId : null;
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const user = useContext(UserContext);
  const [jobPosting, setJobPosting] = useState(''); // New state for Job Posting
  const [isLoading, setIsLoading] = useState(false); // New state for Loading state
  const [loadingMessage, setLoadingMessage] = useState(''); // New state for Loading message
  const navigate = useNavigate(); // Define navigate for redirecting to another page
  const [selectedTemplate, setSelectedTemplate] = useState('Template 1'); // Define selectedTemplate state
  const [isAddTemplateModalOpen, setAddTemplateModalOpen] = useState(false);
  const [latexCode, setLatexCode] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [templates, setTemplates] = useState([]); // State to hold the templates
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState({});
  const [resumes, setResumes] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLatexModalOpen, setLatexModalOpen] = useState(false);
  const [selectedLatex, setSelectedLatex] = useState('');
  const [latexPreviewSrc, setLatexPreviewSrc] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const projectsCollectionRef = collection(db, 'projects');
        const q = query(projectsCollectionRef, where('user_id', '==', userId || user.uid));
        const projectsSnapshot = await getDocs(q);
        const projects = projectsSnapshot.docs.map(doc => doc.data());
        console.log('Fetched Projects:', projects); // Log the fetched projects
        setResumes(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchResumes();
  }, [user, userId]);
  


  const openAddTemplateModal = useCallback(() => {
    setAddTemplateModalOpen(true);
  }, []);

  const closeAddTemplateModal = useCallback(() => {
    setAddTemplateModalOpen(false);
  }, []);

  const addTemplate = async () => {
    // Getting the input values
    const title = templateTitle;
    const description = templateDescription;
    const code = latexCode;
  
    try {
      // Adding the new template to Firestore
      const templatesCollectionRef = collection(db, 'templates');
      await addDoc(templatesCollectionRef, {
        title,
        description,
        code,
      });
      console.log('Template successfully added!');
    } catch (e) {
      console.error('Error adding template: ', e);
    }
  };
  
  
// Function to handle pencil icon click
const handlePencilClick = (latexCode) => {
  // Set the selected LaTeX code
  setSelectedLatex(latexCode);

  // Open the LaTeX modal
  setLatexModalOpen(true);

  // You can also call your API here to generate the preview based on the LaTeX code
  // and then set the preview source to the state
  // Example:
  // axios.post('YOUR_API_ENDPOINT', { latex: latexCode })
  // .then(response => setLatexPreviewSrc(response.data.previewSrc))
  // .catch(error => console.error('Error generating LaTeX preview:', error));
};

// Function to close the LaTeX modal
const closeLatexModal = () => {
  setLatexModalOpen(false);
  setSelectedLatex('');
  setLatexPreviewSrc('');
};
  
  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        try {
          const userDocRef = doc(db, 'users', userId || user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if(userDoc.exists()) {
            setUserData(userDoc.data());
          } else { // User document doesn't exist, creating a new one
            await setDoc(userDocRef, {
              email: user.email,
              displayName: user.displayName,
              resumeCount: 0,
              preferences: {}, // Any default preferences
            });
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    
    fetchData();
  }, [user, userId]);

  const [isModalOpen, setModalOpen] = useState(false);
  
  const openModal = useCallback(() => {
    console.log("Opening modal");
    setModalOpen(true);
  }, []);
  
  
  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);


  const openProfileModal = useCallback(() => {
    setProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setProfileModalOpen(false);
  }, []);
  
  
  const generateResume = async () => {
    setIsLoading(true);
    setLoadingMessage(' Generating...');
  
    try {
      const userDocRef = doc(db, 'users', userId || user.uid);
      const userDoc = await getDoc(userDocRef);
      const userProfile = userDoc.data().aboutUser || {}; // Replace with actual key if different
  
      const response = await axios.post('http://localhost:5000/generate_resume', {
        user_id: userId || user.uid, // include user ID here
        profile: userProfile,
        job: jobPosting,
        template: selectedTemplate,
      });
      
  
      if (response.status === 200) {
        // Increment resumeCount in Firebase
        await setDoc(userDocRef, { resumeCount: (userDoc.data().resumeCount || 0) + 1 }, { merge: true });
        
        // Update local state if necessary
        setUserData((prevData) => ({
          ...prevData,
          resumeCount: (prevData.resumeCount || 0) + 1,
        }));
        
        // Store the generated resume in Firebase
        const resumesCollectionRef = collection(db, 'resumes'); // Now defined
        const resumeDocRef = doc(resumesCollectionRef);
        await setDoc(resumeDocRef, {
          userId: userId || user.uid,
          jobPosting: jobPosting,
          template: selectedTemplate, // This should be now defined
          generatedAt: new Date().toISOString(),
        });
        
        // Reset loading state and redirect or update UI
        setIsLoading(false);

        setShowConfetti(true);
        setLoadingMessage('Resume Generated!');
            // Reset loading state and redirect or update UI after a delay to allow user to see the confetti
      setTimeout(() => {
        setIsLoading(false);
        setShowConfetti(false);
      }, 3000);
        // navigate('/output_page');
      } else {
        console.error('Error generating resume:', response);
      }
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  const handleProfileUpdated = (notificationData) => {
    console.log('Profile updated:', notificationData);

    // Display the notification
    setNotification(notificationData);

    // Close the modal after a successful update
    closeProfileModal();

    // Clear the notification after a certain time (e.g., 3000 milliseconds)
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesCollectionRef = collection(db, 'templates');
        const templatesSnapshot = await getDocs(templatesCollectionRef);
        
        const fetchedTemplates = await Promise.all(templatesSnapshot.docs.map(async doc => {
          const templateData = doc.data();
          
          try {
            const response = await axios.post('http://localhost:5000/convert_latex', {
              latex_code: templateData.code
            });
            
            if(response.data.image) {
              return { ...templateData, imageSrc: `data:image/png;base64,${response.data.image}` };
            } else {
              console.error('Failed to get image for template', templateData);
              return templateData; // Return without imageSrc if conversion failed
            }
          } catch(error) {
            console.error('Error converting LaTeX to image for template', templateData, error);
            return templateData; // Return without imageSrc if request failed
          }
        }));
        
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    
    fetchTemplates();
  }, []);


  return (
<div className="dashboard-container">
{showConfetti && <Confetti />}
      {userData && userData.role === 'admin' && (
        // Render AdminRibbon component for admin users
        <AdminRibbon onAddTemplate={openAddTemplateModal} />

      )}

      
      <nav className="navbar">
      <FaUserCircle onClick={openProfileModal} className="profile-icon" /> {/* User Icon */}

      <div className="search-container">
        </div>
        <div className="account-container">
          <span>{userData ? userData.displayName : 'Loading...'}</span>
        </div>
      </nav>
            <div className="beta-notice">
        <div className="alert alert-warning" role="alert">
          <strong>Beta Notice:</strong> AiApply is still in beta. It may contain inaccuracies or errors.
        </div>
      </div>
      <section className="templates-section">
        <h2>Templates</h2>
        <div className="template-container">

          
        <div className="new-resume">
        <button className="plus-button" onClick={openModal}>+</button>
      </div>


  {templates.map((template, index) => (
    <TemplateCard key={index} imageSrc={template.imageSrc} />
  ))}
</div>




      </section>

      
      
      <section className="projects-grid">
        <h2>Your Projects</h2>
        <div className="projects-container">
            {resumes.map((resume, index) => (
      <ResumeCard key={index} resume={resume} onPencilClick={handlePencilClick} />
    ))}

        </div>
      </section>




      <Modal
  show={isModalOpen}
  onHide={closeModal}
  dialogClassName="modal-dialog"
>
  <Modal.Header closeButton>
    <Modal.Title>Create Resume</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="templateSelect">Select Template:</label>
          <select 
            id="templateSelect" 
            className="form-control"
            onChange={async (e) => {
              const selected = e.target.value;
              // Here, find the selected template object from your templates array
              const selectedTemplateObj = templates.find(template => template.title === selected);
              
              if(selectedTemplateObj) {
                // If you need to fetch or generate the preview, do it here
                setSelectedTemplateData(selectedTemplateObj);
              }
            }}
          >
            {templates.map((template, index) => (
              <option key={index} value={template.title}>
                {template.title}
              </option>
            ))}
          </select>
        </div>
        <div className="template-preview">
          {selectedTemplateData.imageSrc && (
            <>
              <img src={selectedTemplateData.imageSrc} alt="Template Preview" />
              <p>Template: {selectedTemplateData.title}</p>
            </>
          )}
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="resumeName">Name:</label>
          <input 
            type="text" 
            id="resumeName" 
            className="form-control"
            placeholder="Enter the Name of the Resume" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobPosting">Job Posting:</label>
          <textarea 
            id="jobPosting"
            value={jobPosting} 
            onChange={(e) => setJobPosting(e.target.value)} 
            className="form-control job-posting-textarea" 
            placeholder="Copy and paste the job posting here"
          />
        </div>
        <div className="informative-text">
          <p>AI Apply will now use the profile you provided and the job posting you provided to generate a targeted resume where the best foot of the user is being put forward.</p>
        </div>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
    <Button variant="primary" onClick={generateResume}>
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {loadingMessage}
        </>
      ) : (
        'Generate'
      )}
    </Button>
  </Modal.Footer>
</Modal>





      
      <Modal show={isProfileModalOpen} onHide={closeProfileModal} dialogClassName="profile-modal-dialog">
      {notification.message && (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    )}
        <ProfilePage userId={userId} onProfileUpdated={handleProfileUpdated} onModalClose={closeProfileModal} />
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProfileModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isAddTemplateModalOpen} onHide={closeAddTemplateModal}>
              {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <Modal.Header closeButton>
          <Modal.Title>Add New Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Well-formatted fields to enter LaTeX code, title, and description */}
          <form>
            <div className="form-group">
              <label htmlFor="templateTitle">Title:</label>
              <input
                type="text"
                className="form-control"
                id="templateTitle"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="templateDescription">Description:</label>
              <textarea
                className="form-control"
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="latexCode">LaTeX Code:</label>
              <textarea
                className="form-control"
                id="latex_code"
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddTemplateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addTemplate}>
            Add Template
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isLatexModalOpen} onHide={closeLatexModal}>
      <Modal.Header closeButton>
        <Modal.Title>LaTeX Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h5>LaTeX Code:</h5>
          <textarea value={selectedLatex} readOnly className="form-control"/>
        </div>
        <div>
          <h5>Preview:</h5>
          {/* Display the generated preview here */}
          {latexPreviewSrc && <img src={latexPreviewSrc} alt="LaTeX Preview" />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeLatexModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
      
    </div>
  );
}

export default Dashboard;