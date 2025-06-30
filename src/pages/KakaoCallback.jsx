import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("oauth_state");

    if (code && state === storedState) {
      fetch(`${import.meta.env.VITE_APP_API_URL}/auth/kakao/callback?code=${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const { accessToken, userId, name, email, gender, birth } = data;
            login(accessToken, userId, name || "익명", email || "", gender || "", birth || "");
            localStorage.removeItem("oauth_state"); // state 사용 후 제거
            alert("카카오 로그인 성공!");
            navigate("/");
          } else {
            alert(`카카오 로그인 실패: ${data.message || "알 수 없는 오류"}`);
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("카카오 로그인 오류:", err);
          alert(`로그인 도중 오류가 발생했습니다: ${err.message || "알 수 없는 오류"}`);
          navigate("/login");
        });
    } else {
      alert("카카오 로그인 실패: 유효하지 않은 요청입니다.");
      navigate("/login");
    }
  }, [location, login, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;