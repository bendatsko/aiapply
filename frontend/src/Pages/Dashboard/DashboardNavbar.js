import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Modal, Button } from "react-bootstrap";
import "./DashboardNavbar.css";
import logo from "../../logo.png";
import ProfilePage from "./ProfilePage";
import { useUser } from "../../UserContext";
import AdminPanel from "./AdminPanel";

function DashboardNavbar({ onNewResumeClick }) {
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
      console.log("User Object in DashboardNavbar:", user);
    } else {
      console.log("No user is logged in.");
    }
  }, [user]);

  const openProfileModal = useCallback(() => setProfileModalOpen(true), []);
  const closeProfileModal = useCallback(() => setProfileModalOpen(false), []);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const openAdminModal = useCallback(() => setAdminModalOpen(true), []); 
  const closeAdminModal = useCallback(() => setAdminModalOpen(false), []); 
  const handleProfileUpdated = (notificationData) => closeProfileModal();

  const [isAddResumeModalOpen, setAddResumeModalOpen] = useState(false);

  const openAddResumeModal = useCallback(() => {
    setAddResumeModalOpen(true);
  }, []);
  const firstName = user?.displayName?.split(" ")[0] || ""; 

  return (
    <Navbar collapseOnSelect expand="lg" className="dashboard-navbar navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {user && (
            <Nav className="ml-auto d-lg-none"> {/* Only visible in mobile view */}
              <Nav.Link onClick={onNewResumeClick}>New Resume</Nav.Link>
              <Nav.Link onClick={openProfileModal}>My Portfolio</Nav.Link>
              <Nav.Link onClick={() => navigate("/login")}>Log out</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>

        {user && (
          <div className="navbar-buttons d-none d-lg-flex"> {/* Visible only in desktop view */}
            <Button variant="primary" className="navbar-btn primary-btn" onClick={onNewResumeClick}>
              New Resume
            </Button>
            <Button variant="secondary" className="navbar-btn secondary-btn" onClick={openProfileModal}>
              My Portfolio
            </Button>
            <Button variant="secondary" className="navbar-btn secondary-btn" onClick={() => navigate("/login")}>
              Log out
            </Button>
          </div>
        )}
      </div>

      <Modal show={isProfileModalOpen} onHide={closeProfileModal} dialogClassName="profile-modal-dialog">
        <ProfilePage userId={user?.uid} onProfileUpdated={handleProfileUpdated} onModalClose={closeProfileModal} />
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProfileModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isAdminModalOpen} onHide={closeAdminModal} dialogClassName="admin-modal-dialog">
        <AdminPanel onClose={closeAdminModal} />
      </Modal>
    </Navbar>
  );
}

export default DashboardNavbar;
