import React from 'react';
import './TemplateCard.css';

function TemplateCard({ imageSrc, title, description, onClick }) {
    console.log("Image Source:", imageSrc);


    return (
        <div onClick={onClick} className="template-card">
            <img
                src={imageSrc}
                alt="Template Preview"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src="/path_to_a_default_image.jpg";
                }}
            />

            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}



export default TemplateCard;
