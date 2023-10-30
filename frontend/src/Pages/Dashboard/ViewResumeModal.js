import React from 'react';
import {Button, Modal} from 'react-bootstrap';

const ViewResumeModal = ({
                             isOpen,
                             onClose,
                             selectedLatex,
                             setSelectedLatex,
                             latexPreviewSrc
                         }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>LaTeX Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h5>LaTeX Code:</h5>
                    <textarea
                        value={selectedLatex}
                        className="form-control"
                        onChange={(e) => setSelectedLatex(e.target.value)}
                    />
                </div>
                <div>
                    <h5>Preview:</h5>
                    {latexPreviewSrc && <img src={latexPreviewSrc} alt="LaTeX Preview"/>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewResumeModal;
