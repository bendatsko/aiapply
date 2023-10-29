import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {collection, deleteDoc, doc, getDoc, getDocs, setDoc} from 'firebase/firestore';

import {auth, db} from '../../firebase';
import UserContext from '../../UserContext';
import './Dashboard.css';
import {Button, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TemplateCard from './TemplateCard';
import DashboardNavbar from './DashboardNavbar';
import {onAuthStateChanged} from 'firebase/auth';
import NewResumeModal from './NewResumeModal';
import {Grid, Pagination} from '@mui/material';
import OnboardingModal from './OnboardingModal';
import ProfilePage from "./ProfilePage";
import TemplateDetailsModal from "./TemplateDetailsModal";
import ResumeCard from "./ResumeCard.js";
import ResumeDetailsModal from "./ResumeDetailsModal";

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state ? location.state.userId : null;
    const [userData, setUserData] = useState(null);
    const user = useContext(UserContext);


    useEffect(() => {
        if (!user) {
            navigate("/login", {state: {sessionExpired: true}});
        }
    }, [user, navigate]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            // Check if user profile exists in Firebase, create if not
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    // other default fields
                });
            }
            // else, set the user data into some local state or context

        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, [navigate]);

    const [isAddTemplateModalOpen, setAddTemplateModalOpen] = useState(false);
    const [latexCode, setLatexCode] = useState('');
    const [templateTitle, setTemplateTitle] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [templates, setTemplates] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedLatex, setSelectedLatex] = useState('');
    const [latexPreviewSrc, setLatexPreviewSrc] = useState('');
    const [recentlyOpened, setRecentlyOpened] = useState([]);
    const [isViewResumeModalOpen, setViewResumeModalOpen] = useState(false);
    const [isOnboardingModalOpen, setOnboardingModalOpen] = useState(false);
    const openProfileModal = useCallback(() => setProfileModalOpen(true), []);
    const closeProfileModal = useCallback(() => setProfileModalOpen(false), []);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
// Pagination state for resumes and templates


// Pagination state for resumes and templates
    const [currentResumePage, setCurrentResumePage] = useState(1);
    const [currentTemplatePage, setCurrentTemplatePage] = useState(1);
    const itemsPerPage = 4; // Display 4 items per page


// Calculate total pages for resumes and templates
    const totalPagesResumes = Math.ceil(resumes.length / itemsPerPage);
    const totalPagesTemplates = Math.ceil(templates.length / itemsPerPage);

    // Get current resumes and templates based on respective current pages
    const currentResumes = resumes.slice(
        (currentResumePage - 1) * itemsPerPage,
        currentResumePage * itemsPerPage
    );

    const currentTemplates = templates.slice(
        (currentTemplatePage - 1) * itemsPerPage,
        currentTemplatePage * itemsPerPage
    );

    console.log('Recently Opened Resumes:', recentlyOpened);
    console.log('Resumes:', resumes);

    const openAddTemplateModal = useCallback(() => {
        setAddTemplateModalOpen(true);
    }, []);


    function getResumeTitleForTemplate(template) {
        // Placeholder logic: Replace with your actual logic to get the resume title
        // This might involve finding a resume from the `resumes` state that matches the template
        const resume = resumes.find(resume => resume.templateId === template.id); // Assuming each resume has a templateId
        return resume ? resume.title : null; // Return the title if the resume is found
    }


    const closeOnboardingModal = useCallback(async () => {
        setOnboardingModalOpen(false);
        const userDocRef = doc(db, 'users', userId || user.uid);
        await setDoc(userDocRef, {onboarded: true}, {merge: true});
    }, [user, userId]);

    const handleProfileUpdated = (notificationData) => closeProfileModal();

    const handleTemplateClick = useCallback((template) => {
        setSelectedTemplate(template);
    }, []);


    const handleResumeClick = (resume) => {
        setSelectedResume(resume);
        setViewResumeModalOpen(true);  // This should now only open ResumeDetailsModal
    };

// Add a new function to handle LaTeX preview


    const deleteResume = async (resumeId) => {
        try {
            await deleteDoc(doc(db, 'resumes', resumeId));
            fetchResumeData(); // Refresh the list of resumes
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', userId || user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());

                        setUserData(userDoc.data());
                        if (!userDoc.data().onboarded) {
                            setOnboardingModalOpen(true);
                        }


                    } else {
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


    useEffect(() => {
        const fetchTemplates = async () => {
            const templatesCollectionRef = collection(db, 'templates');

            try {
                const querySnapshot = await getDocs(templatesCollectionRef);
                const fetchedTemplates = querySnapshot.docs.map(doc => {
                    const templateData = doc.data();
                    const previewPath = templateData.preview ? `/templates/${templateData.preview}` : null;
                    return {...templateData, previewPath, id: doc.id};
                });

                setTemplates(fetchedTemplates);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();
    }, []);


    // const [resumes, setResumes] = useState([]);


    const fetchResumeData = async () => {
        const resumesCollectionRef = collection(db, 'resumes');
        const querySnapshot = await getDocs(resumesCollectionRef);
        const fetchedResumes = querySnapshot.docs.map(doc => {
            const resumeData = {...doc.data(), id: doc.id};
            console.log(`Fetched Resume: ${resumeData.id}`, resumeData);  // Add this line
            return resumeData;
        });
        setResumes(fetchedResumes);
    };


    useEffect(() => {
        fetchResumeData();
    }, [user, userId]); // Include dependencies that should trigger the re-fetching of resume data


    return (<div className="dashboard-container">
        <div className={"DashboardNav"}>
            <DashboardNavbar/>
        </div>

        <div className="content-container"> {/* This is the new container div */}
            <section className="resumes-section">
                <h2 id="resumesHeader">Resumes</h2>
                <div className="buttons-container">
                    <Button variant="primary" className="create-new-resume-btn" onClick={openAddTemplateModal}>
                        New Resume
                    </Button>
                    <Button variant="secondary" className="my-profile-btn" onClick={openProfileModal}>
                        My Portfolio
                    </Button>
                </div>

                <Grid container spacing={2}>
                    {currentResumes.map((resume, index) => {
                        console.log(`Rendering Resume: ${resume.id}`, resume);  // Add this line
                        return (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <ResumeCard
                                    resume={resume}
                                    title={resume.title}
                                    userId={userId}
                                    imageSrc={resume.previewImagePath}
                                    onClick={() => handleResumeClick(resume)}
                                />
                            </Grid>
                        );
                    })}
                </Grid>


                {resumes.length > 0 && (
                    <Pagination
                        count={totalPagesResumes}
                        page={currentResumePage}
                        onChange={(event, value) => setCurrentResumePage(value)}
                        color="primary"
                        sx={{
                            '.MuiPaginationItem-root': {color: '#4a4a4a'},
                            '.MuiPaginationItem-page.Mui-selected': {
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                border: '1px solid #bbdefb'
                            },
                            '.MuiPaginationItem-root:hover': {
                                backgroundColor: '#f0f8ff',
                                borderColor: 'transparent'
                            },
                            '.MuiPaginationItem-root.Mui-focusVisible': {backgroundColor: '#bbdefb'},
                            '.MuiPaginationItem-disabled': {color: '#bdbdbd'}
                        }}
                    />
                )}

            </section>


            <section className="templates-section">
                <h2>Templates</h2>
                <Grid container spacing={2}>
                    {currentTemplates.map((template, index) => {
                        const resumeTitle = getResumeTitleForTemplate(template); // This is already correct

                        return (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <TemplateCard
                                    imageSrc={template.previewPath}
                                    title={template.title}
                                    description={template.description}
                                    onClick={() => handleTemplateClick(template)}
                                    template={template}
                                />
                            </Grid>
                        );
                    })}
                </Grid>


                <Pagination
                    count={totalPagesTemplates}
                    page={currentTemplatePage}
                    onChange={(event, value) => setCurrentTemplatePage(value)}
                    color="primary"
                    sx={{
                        '.MuiPaginationItem-root': {color: '#4a4a4a'},
                        '.MuiPaginationItem-page.Mui-selected': {
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            border: '1px solid #bbdefb'
                        },
                        '.MuiPaginationItem-root:hover': {
                            backgroundColor: '#f0f8ff',
                            borderColor: 'transparent'
                        },
                        '.MuiPaginationItem-root.Mui-focusVisible': {backgroundColor: '#bbdefb'},
                        '.MuiPaginationItem-disabled': {color: '#bdbdbd'}
                    }}
                />

                <p>Find more templates in the <a href="/community">Community Tab</a>.</p>
            </section>


            <Modal show={isProfileModalOpen} onHide={closeProfileModal} dialogClassName="profile-modal-dialog">
                <ProfilePage
                    userId={user?.uid}
                    onProfileUpdated={handleProfileUpdated}
                    onModalClose={closeProfileModal}/>

            </Modal>

            <NewResumeModal
                isOpen={isAddTemplateModalOpen}
                onClose={() => setAddTemplateModalOpen(false)}
                user={user}
                fetchResumeData={fetchResumeData}
                templates={templates} // Pass the templates to the modal
            />


            {/*<ViewResumeModal*/}
            {/*    isOpen={isViewResumeModalOpen}*/}
            {/*    onClose={() => setViewResumeModalOpen(false)}*/}
            {/*    selectedLatex={selectedLatex}*/}
            {/*    setSelectedLatex={setSelectedLatex}*/}
            {/*    latexPreviewSrc={latexPreviewSrc}*/}
            {/*/>*/}

            <TemplateDetailsModal
                isOpen={selectedTemplate !== null}
                onClose={() => setSelectedTemplate(null)}
                template={selectedTemplate}
            />

            <OnboardingModal isOpen={isOnboardingModalOpen} onClose={closeOnboardingModal}/>

            <ResumeDetailsModal
                isOpen={isViewResumeModalOpen}
                onClose={() => setViewResumeModalOpen(false)}
                resume={selectedResume}
                deleteResume={deleteResume}
            />


        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
            <p>© 2023 AiApply. All rights reserved.</p>
        </footer>
    </div>);
}

export default Dashboard;