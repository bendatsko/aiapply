import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardNavbar.css';
import logo from '../../logo.png';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import ProfilePage from './ProfilePage';
import { useUser } from '../../UserContext';
import AdminPanel from './AdminPanel'; // Import the AdminPanel component

function DashboardNavbar() {
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isAdminModalOpen, setAdminModalOpen] = useState(false);
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            console.log('User Object in DashboardNavbar:', user);
        } else {
            console.log('No user is logged in.');
        }
    }, [user]);



    const openProfileModal = useCallback(() => setProfileModalOpen(true), []);
    const closeProfileModal = useCallback(() => setProfileModalOpen(false), []);
    const openAdminModal = useCallback(() => setAdminModalOpen(true), []); // New handler for Admin Panel NewResumeModal
    const closeAdminModal = useCallback(() => setAdminModalOpen(false), []); // New handler for Admin Panel NewResumeModal
    const handleProfileUpdated = (notificationData) => closeProfileModal();

    return (
        <nav className="navbar dashboard-navbar navbar-expand navbar-light">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                <div className="left-item">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                </div>
                {user && (
                    <div className="right-item">
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                <img src={user.photoURL} alt="User" className="dashboard-profile-icon" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="right">
                                <Dropdown.Item disabled>Logged in as {user.email}</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={openProfileModal}>Manage Profile</Dropdown.Item>
                                {user && user.role === 'admin' && <Dropdown.Item onClick={openAdminModal}>Admin Panel</Dropdown.Item>}
                                <Dropdown.Item onClick={() => navigate("/login")}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
            </div>

            <Modal show={isProfileModalOpen} onHide={closeProfileModal} dialogClassName="profile-modal-dialog">
                <ProfilePage userId={user?.uid} onProfileUpdated={handleProfileUpdated} onModalClose={closeProfileModal}/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProfileModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* New Admin Panel NewResumeModal */}
            <Modal show={isAdminModalOpen} onHide={closeAdminModal} dialogClassName="admin-modal-dialog">
                <AdminPanel onClose={closeAdminModal} />
            </Modal>
        </nav>
    );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

export default DashboardNavbar;