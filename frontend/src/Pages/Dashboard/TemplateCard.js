import React from 'react';
import './TemplateCard.css';

function TemplateCard({imageSrc, title, description, onClick, resumeTitle, template}) {
    console.log("Image Source:", imageSrc);


    return (
        <div>
            <div onClick={onClick} className="template-card">
                <img
                    src={imageSrc}
                    alt="Template Preview"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/path_to_a_default_image.jpg";
                    }}
                />
            </div>
            <p><b>{template.title}</b></p>
        </div>
    );
}


export default TemplateCard;
