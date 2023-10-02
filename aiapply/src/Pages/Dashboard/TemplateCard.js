import React from 'react';
import './TemplateCard.css';

function TemplateCard({ imageSrc, title, description, onClick }) {
    return (
        <div onClick={onClick} className="template-card">
            <img src={imageSrc} alt="Template Preview" />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
  
  

export default TemplateCard;
