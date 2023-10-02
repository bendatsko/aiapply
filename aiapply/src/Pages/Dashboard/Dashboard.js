import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import UserContext from '../../UserContext';
import './Dashboard.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import TemplateCard from './TemplateCard';
import ResumeCard from './ResumeCard';
import Confetti from 'react-confetti';
import DashboardNavbar from './DashboardNavbar';


function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state ? location.state.userId : null;
    const [userData, setUserData] = useState(null);
    const user = useContext(UserContext);
    useEffect(() => {
        if (!user || user == null) {
            navigate("/login")
        }
    }, [user]);
    const [jobPosting, setJobPosting] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('Template 1');
    const [isAddTemplateModalOpen, setAddTemplateModalOpen] = useState(false);
    const [latexCode, setLatexCode] = useState('');
    const [templateTitle, setTemplateTitle] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateData, setSelectedTemplateData] = useState({});
    const [resumes, setResumes] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLatexModalOpen, setLatexModalOpen] = useState(false);
    const [selectedLatex, setSelectedLatex] = useState('');
    const [latexPreviewSrc, setLatexPreviewSrc] = useState('');
    const [recentlyOpened, setRecentlyOpened] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [isNewResumeModalOpen, setNewResumeModalOpen] = useState(false);
    const [isViewResumeModalOpen, setViewResumeModalOpen] = useState(false);
    const openNewResumeModal = () => setNewResumeModalOpen(true);
    const closeNewResumeModal = () => setNewResumeModalOpen(false);

    const openViewResumeModal = () => setViewResumeModalOpen(true);
    const closeViewResumeModal = () => setViewResumeModalOpen(false);
    const [lastUpdated, setLastUpdated] = useState(Date.now());
    const [resumePreviewSrc, setResumePreviewSrc] = useState('');




    const convertLatexToImage = async (latexCode) => {
        try {
            const response = await axios.post('http://localhost:5000/convert_latex', {
                latex_code: latexCode
            });

            if (response.data.image) {
                setResumePreviewSrc(`data:image/png;base64,${response.data.image}`);
            } else {
                console.error('Failed to get image for LaTeX code:', latexCode);
            }
        } catch (error) {
            console.error('Error converting LaTeX to image:', error);
        }
    };




    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const projectsCollectionRef = collection(db, 'projects');
                const q = query(projectsCollectionRef, where('user_id', '==', userId || user.uid));
                const projectsSnapshot = await getDocs(q);

                // Sort resumes based on timestamp
                const sortedProjects = projectsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})).sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened));
                setResumes([{
                    id: 'new', // or any unique identifier for New Resume
                    isNewResume: true, // additional property to identify New Resume
                }, ...sortedProjects]);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchResumes(); // Call the function to fetch resumes
    }, [userId, user.uid, lastUpdated]); // Other useEffect and functions remains unchanged ...


    useEffect(() => {
        fetchResumes(); // Call the function to fetch resumes
    }, [userId, user.uid, lastUpdated]); // Add


    useEffect(() => {
        const fetchRecentlyOpened = async () => {
            try {
                const recentlyOpenedCollectionRef = collection(db, 'recentlyOpened');
                const q = query(recentlyOpenedCollectionRef, where('user_id', '==', userId || user.uid));
                const recentlyOpenedSnapshot = await getDocs(q);
                const recentlyOpenedResumes = recentlyOpenedSnapshot.docs.map(doc => doc.data());
                console.log('Fetched Recently Opened Resumes:', recentlyOpenedResumes);
                setRecentlyOpened(recentlyOpenedResumes);
            } catch (error) {
                console.error('Error fetching recently opened resumes:', error);
            }
        };
        fetchRecentlyOpened();
    }, []);

// Outside of the return statement, log the resumes
    console.log('Recently Opened Resumes:', recentlyOpened);
    console.log('Resumes:', resumes);

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
                title, description, code,
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


    };

// Function to close the LaTeX modal
    const closeLatexModal = () => {
        setLatexModalOpen(false);
        setSelectedLatex('');
        setLatexPreviewSrc('');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', userId || user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else { // User document doesn't exist, creating a new one
                        await setDoc(userDocRef, {
                            email: user.email, displayName: user.displayName, resumeCount: 0, preferences: {}, // Any default preferences
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



    const generateResume = async () => {
        setIsLoading(true);
        setLoadingMessage(' Generating...');

        try {
            const userDocRef = doc(db, 'users', userId || user.uid);
            const userDoc = await getDoc(userDocRef);
            const userProfile = userDoc.data().aboutUser || {}; // Replace with actual key if different

            // Include all necessary details here
            const additionalData = {
                resumeName: document.getElementById('resumeName').value, // Getting resumeName from input
                jobPosting: jobPosting,
                selectedTemplateData: selectedTemplateData,
                // ...any other details
            };

            const response = await axios.post('http://localhost:5000/generate_resume', {
                user_id: userId || user.uid, // include user ID here
                profile: userProfile,
                job: jobPosting,
                template: selectedTemplate,
                additional_data: additionalData, // sending additional data
            });


            if (response.status === 200) {
                // Increment resumeCount in Firebase
                await setDoc(userDocRef, {resumeCount: (userDoc.data().resumeCount || 0) + 1}, {merge: true});

                // Update local state if necessary
                setUserData((prevData) => ({
                    ...prevData, resumeCount: (prevData.resumeCount || 0) + 1,
                }));

                // Store the generated resume in Firebase
                const resumesCollectionRef = collection(db, 'resumes');
                const resumeDocRef = doc(db, 'resumes', selectedResume.id); // Use the correct collection and document path
                await setDoc(resumeDocRef, { latex_code: selectedLatex }, { merge: true });
                console.log('LaTeX Code Updated or Added Successfully');

                console.log('LaTeX Code Updated or Added Successfully');


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

                        if (response.data.image) {
                            return {...templateData, imageSrc: `data:image/png;base64,${response.data.image}`};
                        } else {
                            console.error('Failed to get image for template', templateData);
                            return templateData; // Return without imageSrc if conversion failed
                        }
                    } catch (error) {
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


    const handleResumeClick = async (resume) => {
        console.log('Clicked Resume Object:', JSON.stringify(resume, null, 2));
        if (!resume || !resume.id) {
            console.error('Resume or resume.id is undefined:', resume);
            return;
        }
        setSelectedResume(resume); // Set the entire resume object here
        if(resume.latex_code) setSelectedLatex(resume.latex_code); // Set the selectedLatex state here.
        try {
            const resumeDocRef = doc(db, 'projects', resume.user_id);
            // Assuming resume.latex_code contains the LaTeX code for the resume
            if(resume.latex_code) setSelectedLatex(resume.latex_code); // Set the selectedLatex state here.
            // ...
        } catch (error) {
            console.error('Error updating resume timestamp:', error);
        }
    }



    useEffect(() => {
        fetchResumes(); // Call the function to fetch resumes
    }, [lastUpdated]); // Add lastUpdated to dependency array



    const fetchResumes = useCallback(async () => {
        // ... existing logic to fetch resumes
    }, [userId, user.uid]); // Or other dependencies if needed

    const handleSaveLatex = async () => {
        try {
            if(!selectedResume || !selectedResume.id) throw new Error('Selected resume or its ID is undefined');

            const projectDocRef = doc(db, 'projects', selectedResume.id); // Use the document ID here
            await updateDoc(projectDocRef, { latex_code: selectedLatex });
            console.log('LaTeX Code Updated Successfully for', selectedResume.id);

            // Call the function to refetch resumes
            await fetchResumes();
            setLastUpdated(Date.now()); // Update the lastUpdated state
            if (selectedLatex) {
                await convertLatexToImage(selectedLatex);
            }
        } catch (error) {
            console.error('Error updating LaTeX code:', error);
        }
    };

    const openLatexModal = async (latexCode) => {
        setSelectedLatex(latexCode);
        setLatexModalOpen(true);

        // Convert and set the LaTeX preview
        if (latexCode) {
            await convertLatexToImage(latexCode);
        }
    };






    return (
        <div className="dashboard-container">
            <div className={"DashboardNav"}>
                <DashboardNavbar openAddTemplateModal={openAddTemplateModal}/>
            </div>

        <div className="content-container"> {/* This is the new container div */}
            <section className="resumes-section">
                <h2>Resumes</h2>
                <div className="resumes-container">
                    {resumes.map((resume, index) => (
                        <div
                            key={index}
                            className="resume-card"
                            onClick={async () => {
                                if (resume.isNewResume) {
                                    openNewResumeModal();
                                } else {
                                    await handleResumeClick(resume);
                                    setSelectedResume(resume);
                                    openViewResumeModal();

                                    // Fetch the LaTeX preview image when clicking an existing resume
                                    if (resume.latex_code) {
                                        await convertLatexToImage(resume.latex_code);
                                    }
                                }
                            }}
                        >
                            {resume.isNewResume ? (
                                <div className="plus-sign">+</div>
                            ) : (
                                <img
                                    src={resumePreviewSrc}
                                    alt="Resume Preview"
                                    className="resume-preview-image"
                                />
                            )}
                        </div>
                    ))}



                </div>

            </section>




        <section className="templates-section">
            <h2>Templates</h2>
            <div className="template-container">
                {templates.map((template, index) => (
                    <TemplateCard key={index} imageSrc={template.imageSrc}/>
                ))}
            </div>
            <p>Find more templates in the <a href="/community">Community Tab</a>.</p>
        </section>





        {/*BEGIN MODALS*/}
        <Modal
            show={isNewResumeModalOpen}
            onHide={closeNewResumeModal}
            dialogClassName="modal-dialog"
        >
            {showConfetti && <Confetti/>}
            {userData && userData.role === 'admin' && (// Render AdminRibbon component for admin users
                console.log("Admin status registered in dashboard.js")

            )}
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

                                    if (selectedTemplateObj) {
                                        // If you need to fetch or generate the preview, do it here
                                        setSelectedTemplateData(selectedTemplateObj);
                                    }
                                }}
                            >
                                {templates.map((template, index) => (<option key={index} value={template.title}>
                                    {template.title}
                                </option>))}
                            </select>
                        </div>
                        <div className="template-preview">
                            {selectedTemplateData.imageSrc && (<>
                                <img src={selectedTemplateData.imageSrc} alt="Template Preview"/>
                                <p>Template: {selectedTemplateData.title}</p>
                            </>)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="resumeName">Name:</label>
                            <input
                                type="text"
                                id="resumeName"
                                className="form-control"
                                placeholder="Google Senior Software Engineer"
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
                            <p>AI Apply will now use the profile you provided and the job posting you provided to
                                generate a targeted resume where the best foot of the user is being put forward.</p>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeViewResumeModal}>
                    Close
                </Button>

                <Button variant="primary" onClick={handleSaveLatex}>
                    Save
                </Button>
            </Modal.Footer>

        </Modal>



        <Modal show={isAddTemplateModalOpen} onHide={closeAddTemplateModal}>
            {notification.message && (<div className={`notification ${notification.type}`}>
                {notification.message}
            </div>)}

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

            <Modal show={isViewResumeModalOpen} onHide={closeViewResumeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>LaTeX Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5>LaTeX Code:</h5>
                        <textarea
                            value={selectedLatex}
                            className="form-control"
                            onChange={(e) => setSelectedLatex(e.target.value)} // update the state as user types
                        />
                    </div>
                    <div>
                        <h5>Preview:</h5>
                        {latexPreviewSrc && <img src={latexPreviewSrc} alt="LaTeX Preview" />}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeViewResumeModal}>
                        Close
                    </Button>

                    <Button variant="primary" onClick={handleSaveLatex}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>

            <div className="footer py-4">
                <div className="container text-center">
                    <p>&copy; 2023 AiApply. All Rights Reserved.</p>
                    <p><Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link></p>
                </div>
            </div>
    </div>);
}

export default Dashboard;