  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,
  });

  const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_API_URL,
  });

  api.interceptors.request.use(
    (config) => {
      const noAuthUrls = [
        '/users/login',
        '/users/register',
        '/email-verification/send',
        '/email-verification/verify',
        '/auth/google/callback',
        '/auth/kakao/callback',
      ];

      const url = config.url || '';
      const shouldSkipAuth = noAuthUrls.some((noAuthUrl) =>
        url.startsWith(noAuthUrl)
      );

      if (!shouldSkipAuth) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      console.log('API 요청:', {
        method: config.method,
        url: `${config.baseURL}${config.url}`,
        data: config.data,
        params: config.params,
        headers: config.headers,
      });

      return config;
    },
    (error) => {
      console.error('API 요청 에러:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('Refresh 토큰 없음');

          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            console.log('API 토큰 갱신 성공: ', originalRequest.url);
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('API: 토큰 갱신 실패:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }

      console.error('API 응답 에러:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      return Promise.reject(error);
    }
  );


  export const login = ({ email, password }) => {
    console.log('로그인 요청:', { email, password });
    return api.post('/users/login', { email, password });
  };

  export const register = (userData) => {
    return api.post('/users/register', userData);
  };

  export const sendEmailVerification = (email) => {
    return api.post('/email-verification/send', { email }, { headers: { 'Content-Type': 'application/json' } });
  };

  export const verifyEmailCode = (email, code) => {
    return api.post('/email-verification/verify', { email, code });
  };

  export const getUserInfo = (id) => {
    return api.get(`/users/${id}`);
  };

  export const updateUserInfo = (id, updateData) => {
    return api.patch(`/users/${id}`, updateData);
  };

  export const getGoogleCallback = (code) => {
    console.log('getGoogleCallback: 요청 시작, code:', code);
    return api.get(`/auth/login/oauth2/code/google?code=${code}`, {
      withCredentials: true,
    });
  };

  export const getKakaoCallback = (code) => {
    console.log('getKakaoCallback: 요청 시작, code:', code);
    return api.get(`/auth/kakao/callback?code=${code}`);
  };

  export const chatWithAI = async (message) => {
    console.log('AI 요청:', message);
    const response = await aiApi.post('/chat', { message });
    console.log('AI 응답:', response.data);
    return response;
  };

  export default api;
