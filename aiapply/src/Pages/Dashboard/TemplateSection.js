import React from 'react';
import TemplateCard from './TemplateCard';

function TemplatesSection({ templates }) {
    return (
        <section className="templates-section">
            <h2>Templates</h2>
            <div className="template-container">
                {templates.map((template, index) => (
                    <TemplateCard key={index} {...template} />
                ))}
            </div>
        </section>
    );
}

export default TemplatesSection;
