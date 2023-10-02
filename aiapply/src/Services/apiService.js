import axios from 'axios';

export const convertLatex = async (code) => {
    const response = await axios.post('http://localhost:5000/convert_latex', { latex_code: code });
    return response.data;
};

export const generateResume = async (data) => {
    const response = await axios.post('http://localhost:5000/generate_resume', data);
    return response.data;
};
