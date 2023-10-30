import React from 'react';
import ResumeCard from './ResumeCard';

function ProjectsSection({ resumes, onPencilClick }) {
    return (
        <section className="projects-grid">
            <h2>Your Projects</h2>
            <div className="projects-container">
                {resumes.map((resume, index) => (
                    <ResumeCard key={index} resume={resume} onPencilClick={onPencilClick} />
                ))}
            </div>
        </section>
    );
}

export default ProjectsSection;
