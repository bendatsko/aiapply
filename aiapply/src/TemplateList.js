import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import to your file structure

function TemplateList() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesCollection = collection(db, 'templates');
        const templateSnapshot = await getDocs(templatesCollection);
        const templatesList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTemplates(templatesList);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h2>{template.name}</h2>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  );
}

export default TemplateList;
