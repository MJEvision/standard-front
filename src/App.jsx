import React, { useState, useEffect } from "react";
import * as R from "../allFiles";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

const AuthContext = React.createContext();
export const useAuth = () => React.useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", userInfo.id || userInfo.userId);
    localStorage.setItem("name", userInfo.name);
    localStorage.setItem("email", userInfo.email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (!isLoggedIn && !token) {
    if (!sessionStorage.getItem("alertShown")) {
      alert("로그인 후 이용해주세요.");
      sessionStorage.setItem("alertShown", "true");
      setTimeout(() => sessionStorage.removeItem("alertShown"), 1000);
    }
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const hideFooterPaths = [
    "/ChatbotPage",
    "/auth/google/callback",
    "/auth/kakao/callback",
  ];
  const noLoaderPaths = [
    "/login",
    "/logup",
    "/auth/google/callback",
    "/auth/kakao/callback",
  ];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  useEffect(() => {
    if (!noLoaderPaths.includes(location.pathname)) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <AppContent shouldHideFooter={shouldHideFooter} loading={loading} />
    </AuthProvider>
  );
};

const AppContent = ({ shouldHideFooter, loading }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && location.pathname.includes("/auth/")) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <R.Header />
      {loading && <R.Loading />}

      <Routes>
        <Route path="/" element={<R.MainPage />} />
        <Route path="/login" element={<R.Login />} />
        <Route path="/logup" element={<R.Logup />} />
        <Route path="/supportPolicy" element={<R.SupportPolicy />} />

        <Route
          path="/creditRate"
          element={<ProtectedRoute element={<R.CreditRatePage />} />}
        />

        <Route
          path="/investRecommend"
          element={<ProtectedRoute element={<R.InvestPage />} />}
        />
        <Route
          path="/FinancialPage"
          element={<ProtectedRoute element={<R.FinancialPage />} />}
        />
        <Route
          path="/ChatbotPage"
          element={<ProtectedRoute element={<R.ChatbotPage />} />}
        />
        <Route
          path="/MyPage"
          element={<ProtectedRoute element={<R.Mypage />} />}
        />
        <Route
          path="/MypageInit"
          element={<ProtectedRoute element={<R.MypageInit />} />}
        />
        <Route
          path="/MypageBefore"
          element={<ProtectedRoute element={<R.MypageBefore />} />}
        />

        {/* 콜백 경로 */}
        <Route path="/auth/google/callback" element={<R.GoogleCallback />} />
        <Route path="/auth/kakao/callback" element={<R.KakaoCallback />} />

        <Route path="/Loading" element={<R.Loading />} />
        <Route path="*" element={<R.NotFound />} />
      </Routes>

      {!shouldHideFooter && !loading && <R.Footer />}
    </>
  );
};

export default App;
