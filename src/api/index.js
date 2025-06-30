import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const noAuthUrls = [
      '/auth/login',
      '/users/register',
      '/email-verification/send',
      '/email-verification/verify',
      '/auth/google/callback',
      '/auth/kakao/callback',
    ];

    const url = config.url || '';
    const shouldSkipAuth = noAuthUrls.some((noAuthUrl) => url.startsWith(noAuthUrl));

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
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('리프레시 토큰 없음');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('API: 토큰 갱신 성공, 재시도:', originalRequest.url);
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
  },
);

export const login = ({ email, password }) => {
  console.log('로그인 요청:', { email, password });
  return api.post('/auth/login', { email, password });
};

export const getGoogleCallback = async (code) => {
  console.log('getGoogleCallback: 요청 시작, code:', code);
  const response = await api.get('/auth/google/callback', {
    params: { code },
  });
  console.log('getGoogleCallback: 응답:', response.data);
  return response;
};

export const getKakaoCallback = async (code) => {
  console.log('getKakaoCallback: 요청 시작, code:', code);
  const response = await api.get('/auth/kakao/callback', {
    params: { code },
  });
  console.log('getKakaoCallback: 응답:', response.data);
  return response;
};

export default api;