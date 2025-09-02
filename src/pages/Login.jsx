import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/Login.css";
import api, { login, getGoogleCallback, getKakaoCallback } from "@/api";
import { useAuth } from "@/context/AuthContext";
import google from "../assets/google.png";
import kakao from "../assets/kakao.png";

const Login = () => {
  const [formEmail, setFormEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zoom] = useState(0.9);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();

  const calculateAge = (birthString) => {
    if (!birthString) return "";
    try {
      const [year, month, day] = birthString.split("-").map(Number);
      const today = new Date();
      let age = today.getFullYear() - year;
      if (
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day)
      ) {
        age--;
      }
      return age.toString();
    } catch (error) {
      console.error("나이 계산 오류:", error);
      return "";
    }
  };

  const handleGoogleLogin = () => {
    if (
      !import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      !import.meta.env.VITE_GOOGLE_REDIRECT_URI
    ) {
      alert("Google 로그인 설정 오류입니다. 관리자에게 문의하세요.");
      return;
    }

    const state = crypto.randomUUID();
    localStorage.setItem("oauth_state", state);

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_GOOGLE_REDIRECT_URI
    }&response_type=code&scope=email%20profile%20openid&state=${state}`;

    window.location.href = url;
  };

  const handleKakaoLogin = () => {
    if (
      !import.meta.env.VITE_KAKAO_CLIENT_ID ||
      !import.meta.env.VITE_KAKAO_REDIRECT_URI
    ) {
      alert("Kakao 로그인 설정 오류입니다. 관리자에게 문의하세요.");
      return;
    }

    const state = crypto.randomUUID();
    localStorage.setItem("oauth_state", state);

    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    }&response_type=code&state=${state}`;

    window.location.href = url;
  };

  const handleSocialCallback = async () => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");
    const storedState = localStorage.getItem("oauth_state");

    if (!code || state !== storedState) {
      alert("소셜 로그인 인증 오류입니다.");
      return;
    }

    try {
      let response;
      if (location.pathname.includes("google")) {
        response = await getGoogleCallback(code);
      } else if (location.pathname.includes("kakao")) {
        response = await getKakaoCallback(code);
      }

      const { accessToken, refreshToken, user } = response.data;
      const age = user.age ? user.age.toString() : calculateAge(user.birth);

      contextLogin(
        accessToken,
        user.id,
        user.username || user.name || "익명",
        user.email || formEmail,
        refreshToken,
        user.sex === "male" ? "남성" : user.sex === "female" ? "여성" : "",
        user.birth || ""
      );
      localStorage.setItem("age", age);
      localStorage.removeItem("oauth_state");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("소셜 로그인 오류:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "소셜 로그인에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("로그인 시도:", { email: formEmail, password });
      const response = await login({ email: formEmail, password });

      if (response.status >= 200 && response.status < 300) {
        const { accessToken, refreshToken, user } = response.data;
        const age = user.age ? user.age.toString() : calculateAge(user.birth);

        contextLogin(
          accessToken,
          user.id,
          user.username || user.name || "익명",
          user.email || formEmail,
          refreshToken,
          user.sex === "male" ? "남성" : user.sex === "female" ? "여성" : "",
          user.birth || ""
        );
        localStorage.setItem("age", age);
        alert("로그인에 성공했습니다!"); // ✅ 추가
        navigate("/", { replace: true });
      } else {
        alert("로그인 실패: 서버에서 잘못된 응답을 받았습니다.");
      }
    } catch (err) {
      console.error("로그인 오류:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인하거나 서버 상태를 확인하세요."
      );
    }
  };

  useEffect(() => {
    if (location.pathname.includes("callback")) {
      handleSocialCallback();
    }
  }, [location]);

  return (
    <div className="LoginFrame" style={{ zoom }}>
      <form className="LoginForm" onSubmit={handleSubmit}>
        <div className="LoginTitle">로그인</div>
        <div className="LoginInput">
          <input
            className="InputEmail2"
            type="email"
            placeholder="이메일"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />
          <input
            className="InputPassword2"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="LoginButton" type="submit">
          로그인
        </button>

        <div className="LogupTo">
          <div className="LogupToText">
            아직 회원가입 안 하셨나요?{" "}
            <a className="LogupToText2" href="/logup">
              회원가입
            </a>{" "}
            바로가기
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
