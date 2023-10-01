import React from 'react';
import { Button } from 'react-bootstrap';
import { FaShieldAlt } from 'react-icons/fa'; // Import shield icon from react-icons

function AdminRibbon({ onAddTemplate }) {
    console.log(onAddTemplate); // Log to check whether the function is received as a prop
    return (
      <div className="admin-ribbon">
        <div className="admin-indicator">
          <FaShieldAlt /> {/* Shield icon */}
          <span>Admin Mode</span> {/* Admin text */}
        </div>
        <Button onClick={onAddTemplate} className="custom-button">
          Add Template
        </Button>
      </div>
    );
  }
  

export default AdminRibbon;
