import axios from 'axios';

const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL || 'http://localhost:8000',
});

export const fetchChatHistory = () => chatbotApi.get('/chat');
export const askChatbot = (question) => chatbotApi.post('/ask', { question });