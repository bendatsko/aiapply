function ResumeCard({resume, userId, imageSrc, onClick}) {
    // Default image path
    const defaultImage = "/logo512.png";

    // If imageSrc is undefined, use the default image
    const resolvedImageSrc = imageSrc || defaultImage;

    console.log("Resume Image Source:", resolvedImageSrc);

    return (
        <div>
            <div onClick={onClick} className="template-card">
                <img
                    src={resolvedImageSrc}
                    alt={`${resume.title} Preview`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
            </div>
            <p>{resume.title}</p> {/* Display the resume title */}

        </div>
    );
}

export default ResumeCard;
