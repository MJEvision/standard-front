import axios from 'axios';

const AiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL || 'https://standard-ai.kro.kr/',

});

export const getChatHistory = () => AiApi.get('/chat');
export const sendChatMessage = (message) =>
  AiApi.post('/ask', { question: message });
export const rateResult = (form) =>
  AiApi.post('/getGrade', form);
export const getCreditGrade = (userId) =>
  AiApi.get(`/getGrade?userId=${userId}`);
export const investRecommend = (payload) =>
  AiApi.post('/invRecom', payload);
export const fiancialResult = (payload) =>
  AiApi.post('/prodRecom', payload);
export const getKeywords = () => AiApi.get("/key");