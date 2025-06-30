import { Link, useNavigate } from "react-router-dom";
import { LuCircleUserRound } from "react-icons/lu";
import "../styles/Header.css";
import Logoimg from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("정말로 로그아웃 하시겠습니까?");
    if (confirmLogout) {
      logout();
      console.log("Header: 로그아웃 실행, isLoggedIn:", isLoggedIn);
      navigate("/", { replace: true });
    }
  };

  console.log("Header: isLoggedIn", isLoggedIn, "localStorage:", {
    accessToken: localStorage.getItem("accessToken"),
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
  });

  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <Link to="/" className="nav-left">
          <img src={Logoimg} className="logo-img" />
          <span className="logo-text">Fresh Money</span>
        </Link>

        <div className="nav-center">
          <div className="correction">
            <Link to="/supportPolicy" className="nav-text">
              청년정책
            </Link>
          </div>
          <div className="correction">
            <Link to="/creditPolicy" className="nav-text">
              신용등급
            </Link>
          </div>
          <div className="correction">
            <Link to="/investRecommend" className="nav-text">
              투자 추천
            </Link>
          </div>
          <div className="correction">
            <Link to="/financialPage" className="nav-text">
              금융상품 추천
            </Link>
          </div>
          <div className="correction">
            <Link to="/ChatbotPage" className="nav-text">
              FM챗봇
            </Link>
          </div>
        </div>

        <div className="nav-right">
          {isLoggedIn ? (
            <div className="LogoutCt">
              <Link to="/MypageBefore" className="nav-icon">
                <LuCircleUserRound />
              </Link>
              <span className="logoutText" onClick={handleLogout}>
                로그아웃
              </span>
            </div>
          ) : (
            <div className="navRightCt">
              <Link to="/login" className="nav-RightText">
                로그인
              </Link>
              <Link to="/logup" className="nav-RightText">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}