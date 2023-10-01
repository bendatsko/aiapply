import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path if needed
import { Button } from 'react-bootstrap';

function Modal({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [goals, setGoals] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(''); // An extra field for any additional information
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesCollectionRef = collection(db, 'templates');
        const templatesSnapshot = await getDocs(templatesCollectionRef);
        setTemplates(templatesSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    
    fetchTemplates();
  }, []);
  
  const handleGenerateResume = () => {
    // Logic for generating the resume, including making API call and updating Firestore
    // This can be passed down as a prop or handled here
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-left">
          <h4>Select Template</h4>
          <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
            {templates.map((template, index) => (
              <option key={index} value={template.name}>{template.name}</option>
            ))}
          </select>
        </div>
        <div className="modal-right">
          <h4>New Resume</h4>
          <input 
            type="text"
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            placeholder="Enter the Job Posting"
            className="job-posting-input form-control"
          />
          <input 
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Enter your goals"
            className="goals-input form-control"
          />
          <input 
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter any additional information"
            className="additional-info-input form-control"
          />
          <Button variant="primary" onClick={handleGenerateResume}>Generate Resume</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
