import React, { useState, useEffect } from "react";
import * as R from "../allFiles";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/auth/google/callback") {
      console.log("ProtectedRoute: /auth/google/callback 경로, 리다이렉트 스킵");
      return;
    }

    if (!isLoggedIn) {
      console.log(
        "ProtectedRoute: /login으로 리다이렉트, isLoggedIn:",
        isLoggedIn,
        "from:",
        location.pathname
      );
      // Use a flag in sessionStorage to prevent multiple alerts
      if (!sessionStorage.getItem("alertShown")) {
        alert("로그인 후 이용해주세요.");
        sessionStorage.setItem("alertShown", "true");
        // Reset the flag after navigation to allow future alerts
        setTimeout(() => sessionStorage.removeItem("alertShown"), 1000);
      }
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return isLoggedIn ? element : null;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const hideFooterPaths = ["/ChatbotPage", "/auth/google/callback", "/auth/kakao/callback"];
  const noLoaderPaths = [
    "/login",
    "/logup",
    "/auth/google/callback",
    "/auth/kakao/callback",
  ];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  console.log("App: isLoggedIn", isLoggedIn, "경로", location.pathname, "localStorage:", {
    accessToken: localStorage.getItem("accessToken"),
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
  });

  useEffect(() => {
    if (!noLoaderPaths.includes(location.pathname)) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLoggedIn && location.pathname === "/auth/google/callback") {
      console.log("App: 로그인 후 /auth/google/callback에서 /로 리다이렉트");
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <R.AuthProvider>
      <R.Header />
      {loading && <R.Loading />}
      <Routes>
        <Route path="/" element={<R.MainPage />} />
        <Route path="/login" element={<R.Login />} />
        <Route path="/logup" element={<R.Logup />} />
        <Route path="/creditPolicy" element={<ProtectedRoute element={<R.CreditPolicyPage />} />} />
        <Route path="/investRecommend" element={<ProtectedRoute element={<R.InvestPage />} />} />
        <Route path="/FinancialPage" element={<ProtectedRoute element={<R.FinancialPage />} />} />
        <Route path="/supportPolicy" element={<R.SupportPolicy />} />
        <Route path="/ChatbotPage" element={<ProtectedRoute element={<R.ChatbotPage />} />} />

        <Route path="/edit" element={<ProtectedRoute element={<R.MypageInit />} />} />
        <Route path="/MyPage" element={<ProtectedRoute element={<R.Mypage />} />} />
        <Route
          path="/MypageBefore"
          element={<ProtectedRoute element={<R.MypageBefore />} />}
        />
        <Route path="/MypageInit" element={<ProtectedRoute element={<R.MypageInit />} />} />

        <Route path="/auth/google/callback" element={<R.GoogleCallback />} />
        <Route path="/auth/kakao/callback" element={<R.KakaoCallback />} />

        <Route path="/Loading" element={<R.Loading />} />
        <Route path="*" element={<R.NotFound />} />
      </Routes>
      {!shouldHideFooter && !loading && <R.Footer />}
    </R.AuthProvider>
  );
};

export default App;