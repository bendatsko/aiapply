import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const addTemplateToFirestore = async (data) => {
    const templatesCollectionRef = collection(db, 'templates');
    await addDoc(templatesCollectionRef, data);
};

export const getTemplatesFromFirestore = async () => {
    const templatesCollectionRef = collection(db, 'templates');
    const templatesSnapshot = await getDocs(templatesCollectionRef);
    return templatesSnapshot.docs.map(doc => doc.data());
};
