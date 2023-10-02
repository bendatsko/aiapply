import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios'; // Import axios for making API requests
import { FaPencilAlt } from 'react-icons/fa';
import './ResumeCard.css';

function ResumeCard({ resume }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [latexPreviewSrc, setLatexPreviewSrc] = useState('');

  let createdAtString = '';
  if(resume.created_at) {
    createdAtString = resume.created_at.toDate().toLocaleString();
  }

  useEffect(() => {
    // Call the API to convert the LaTeX code to an image when the Modal is opened
    if(isModalOpen && resume.latex_code) {
      axios.post('http://localhost:5000/convert_latex', {
        latex_code: resume.latex_code
      })
      .then(response => {
        if(response.data.image) {
          setLatexPreviewSrc(`data:image/png;base64,${response.data.image}`);
        }
      })
      .catch(error => console.error('Error converting LaTeX to image:', error));
    }
  }, [isModalOpen, resume.latex_code]);

  return (
    <div className="resume-card">
      <div className="resume-content" onClick={() => setModalOpen(true)}>
        {createdAtString}
        <div className="resume-hover-icon">
          <FaPencilAlt />
        </div>
      </div>

      <Modal show={isModalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resume Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h5>LaTeX Code:</h5>
              <textarea value={resume.latex_code} readOnly className="form-control"/>
            </div>
            <div className="col-md-6">
              <h5>Preview:</h5>
              {latexPreviewSrc && <img src={latexPreviewSrc} alt="LaTeX Preview" />}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ResumeCard;
