import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const GoogleCallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return; 
    calledRef.current = true;

    const query = new URLSearchParams(location.search);

    const accessToken = query.get("accessToken") ?? "guest";
    const refreshToken = query.get("refreshToken") ?? "";
    const id = query.get("id") ?? "";
    const username = query.get("username") || "익명";
    const email = query.get("email") ?? "";
    const sex = query.get("sex") || "";
    const birth = query.get("birth") || "";


    login(accessToken, id, username, email, refreshToken, sex, birth);
    navigate("/", { replace: true });
  }, [location.search, login, navigate]);

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallBack;
