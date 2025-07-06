import axios from 'axios';

const AiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL || 'http://52.79.247.46',
});

export const getChatHistory = () => AiApi.get('/chat'); 
export const sendChatMessage = (message) =>
  AiApi.post('/ask', { question: message });
export const rateResult = (form) =>
  AiApi.post('/getGrade', form);
export const investRecommend = (payload) =>
  AiApi.post('/invRecom', payload);
export const fiancialResult = (payload) =>
  AiApi.post('/prodRecom', payload);
export const getKeywords = () => AiApi.get("/key");

