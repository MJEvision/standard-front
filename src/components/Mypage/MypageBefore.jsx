import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "@/styles/Mypage.css";
import man from "@/assets/man.png";
import woman from "@/assets/woman.png";
import { useAuth } from "@/context/AuthContext";
import { getUserInfo } from "@/api/Register";

const MypageBefore = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    birth: "",
    email: "",
    password: " tripadvisor ",
    confirmPassword: " tripadvisor ",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!isLoggedIn || !token || !userId) {
        setError(
          "소셜로그인 정보는 현재 구현되지 않았습니다. 일반 로그인 부탁드립니다."
        );
        setIsLoading(false);
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
        return;
      }

      setIsLoading(true);

      try {
        const response = await getUserInfo(userId);

        if (response && response.data) {
          const updatedForm = {
            name: localStorage.getItem("name") || response.data.username || "",
            gender:
              localStorage.getItem("gender") ||
              (response.data.sex === "male" ? "남성" : "여성"),
            birth: localStorage.getItem("birth") || response.data.birth || "",
            email: localStorage.getItem("email") || response.data.email || "",
            password: localStorage.getItem("password") || "",
            confirmPassword: localStorage.getItem("confirmPassword") || "",
          };

          setForm(updatedForm);
        } else {
          setError("서버에서 사용자 정보를 가져오지 못했습니다.");
        }
      } catch (err) {
        if (!err.response) {
          setError(
            "네트워크 연결에 문제가 있습니다. 인터넷 상태를 확인해주세요."
          );
        } else if (err.response.status === 401) {
          setError("인증이 만료되었습니다. 다시 로그인해주세요.");
          setIsLoggedIn(false);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        } else if (err.response.status >= 500) {
          setError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else if (err.response.status >= 400) {
          setError(
            `요청이 실패했습니다: ${
              err.response.data?.message || "잘못된 요청입니다."
            }`
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, setIsLoggedIn, navigate]);

  const handleEditClick = () => {
    navigate("/MyPageInit", { state: { userInfo: form } });
  };

  return (
    <div className="mypageFrame">
      <div className="mypageTitle">마이페이지</div>
      <div className="mypageFormCt">
        <div className="mypageForm">
          {isLoading ? (
            <div className="loadingMessage">정보를 불러오는 중입니다...</div>
          ) : error ? (
            <div className="errorMessage" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}>{error}</div> 
          ) : (
            <>
              <div className="mypageInfo2">
                <img
                  className="genderImg"
                  src={form.gender === "여성" ? woman : man}
                  alt="gender"
                />
                <div className="infoFrame">
                  <div className="infoName">
                    {form.name || "이름 없음"}
                    <span className="nameLl"></span>
                  </div>
                </div>
              </div>

              <div className="infoMainFrame">
                <div className="RateMainFrame">
                  <div className="RateMainText">현재 신용등급 점수</div>
                  <div className="RateResult"></div>
                </div>
                <div className="infoMainLine"></div>
                <div className="keyWordMainFrame">
                  <div className="keyWordMainText">현재 정책 추천 키워드</div>
                  <div className="keywordResult"></div>
                </div>
              </div>

              <div className="infoTitle">
                회원정보
                <button className="infoEdit" onClick={handleEditClick}>
                  수정하기
                  <FontAwesomeIcon
                    className="rightPrev"
                    icon={faChevronRight}
                  />
                </button>
              </div>
              <div className="formLine"></div>

              <div className="formName">
                <div className="labelName">이름</div>
                <div className="inputNameCt">
                  <input
                    className="inputName"
                    type="text"
                    value={form.name}
                    readOnly
                  />
                </div>
              </div>

              <div className="formGender">
                <div className="labelGender">성별</div>
                <div className="inputGenderCt">
                  <input
                    className="inputGender"
                    type="text"
                    value={form.gender}
                    readOnly
                  />
                </div>
              </div>

              <div className="formDate">
                <div className="labelDate">생년월일</div>
                <div className="inputDateCt">
                  <input
                    className="inputDate"
                    type="text"
                    value={form.birth}
                    readOnly
                  />
                </div>
              </div>

              <div className="formEmail">
                <div className="labelEmail">이메일</div>
                <div className="inputEmailCt">
                  <input
                    className="inputEmail"
                    type="email"
                    value={form.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="formPassword">
                <div className="labelPassword">비밀번호</div>
                <div className="inputPasswordCt">
                  <input
                    className="inputPassword"
                    type="password"
                    value={form.password}
                    readOnly
                  />
                  <div className="passwordTextCt">
                    <div className="passwordText">
                      입력가능 특수문자: !@#$%^&*
                    </div>
                    <div className="passwordText2">
                      (비밀번호는 9~16자리, 영문자·숫자·특수문자 포함 필수)
                    </div>
                  </div>
                </div>
              </div>

              <div className="formPasswordCheck">
                <div className="labelPasswordCheck">비밀번호 확인</div>
                <div className="inputPasswordCheckCt">
                  <input
                    className="inputPasswordCheck"
                    type="password"
                    value={form.confirmPassword}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MypageBefore;
