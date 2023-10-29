// OnboardingModal.js

import React from 'react';
import {Button, Modal} from 'react-bootstrap';

function OnboardingModal({isOpen, onClose}) {
    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Welcome to AiApply Dashboard!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Here's a quick guide to get you started:</p>
                <ol>
                    <li>Use the 'New Resume' button to create a new resume.</li>
                    <li>Browse through available templates for inspiration.</li>
                    <li>Visit the Community Tab to see what others are sharing.</li>
                    // Add more steps as necessary
                </ol>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>Got it!</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OnboardingModal;
