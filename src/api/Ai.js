import axios from 'axios';

if (!import.meta.env.VITE_AI_API_URL) {
  throw new Error("환경변수 VITE_AI_API_URL이 설정되지 않았습니다.");
}

const AiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL,
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
export const getKeywords = () => AiApi.get('/key');
