import api from "./index";

export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => api.post("/users/register", userData);
export const sendEmailVerification = (email) =>
  api.post("/email-verification/send", { email });
export const verifyEmailCode = (email, code) =>
  api.post("/email-verification/verify", { email, code });
export const getUserInfo = (id) => api.get(`/users/${id}`);
export const updateUserInfo = (id, updateData) =>
  api.patch(`/users/${id}`, updateData);
export const getGoogleCallback = (code) =>
  api.get(`/auth/login/oauth2/code/google?code=${code}`, {
    withCredentials: true,
  });
export const getKakaoCallback = (code) =>
  api.get(`/auth/kakao/callback?code=${code}`);
