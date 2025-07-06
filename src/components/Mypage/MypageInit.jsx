import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import "@/styles/Mypage.css";
import man from "@/assets/man.png";
import woman from "@/assets/woman.png";
import { updateUserInfo } from "@/api";

const MypageInit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state?.userInfo;
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [displayInfo, setDisplayInfo] = useState({
    name: "",
    gender: "",
    birth: "",
  });

  useEffect(() => {
    if (userInfo) {
      const initialForm = {
        password: localStorage.getItem("password") || "",
        confirmPassword: localStorage.getItem("confirmPassword") || "",
      };
      setForm(initialForm);
      setDisplayInfo({
        name: userInfo.name || userInfo.username || "",
        gender: userInfo.gender || "",
        birth: userInfo.birth || "",
      });
      setEmail(userInfo.email || localStorage.getItem("email") || "");
    } else {
      alert("사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.");
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return "유효한 이메일이 필요합니다.";

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,16}$/;
    if (!form.password) return "비밀번호를 입력해주세요.";
    if (!passwordRegex.test(form.password))
      return "비밀번호는 9~16자리로, 영문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.";

    if (!form.confirmPassword) return "비밀번호 확인을 입력해주세요.";
    if (form.password !== form.confirmPassword)
      return "비밀번호가 일치하지 않습니다.";

    return null;
  };

  const isFormChanged = () => {
    return (
      email !== (userInfo?.email || localStorage.getItem("email")) ||
      form.password !== localStorage.getItem("password") ||
      form.confirmPassword !== localStorage.getItem("confirmPassword")
    );
  };

  const handleSubmit = async () => {
    if (!isFormChanged()) {
      alert("수정된 정보가 없습니다.");
      return;
    }

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      await updateUserInfo(userId, {
        email,
        password: form.password,
      });

      localStorage.setItem("email", email);
      localStorage.setItem("password", form.password);
      localStorage.setItem("confirmPassword", form.confirmPassword);

      alert("정보가 수정되었습니다.");
      navigate("/MyPageBefore");
    } catch (err) {
      console.error(err);
      alert("회원정보 수정에 실패했습니다.");
    }
  };

  const handleBack = () => {
    if (isFormChanged()) {
      const confirmLeave = window.confirm(
        "수정된 내용이 있습니다. 변경사항을 저장하지 않고 나가시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    navigate("/MyPageBefore");
  };

  return (
    <div className="mypageFrameInit">
      <div className="mypageTitle">마이페이지</div>
      <div className="mypageFormCt">
        <div className="mypageForm">
          <div className="mypageInfo">
            <img
              className="genderImg"
              src={displayInfo.gender === "여성" ? woman : man}
              alt="gender"
            />
            <div className="infoRight">
              <div className="infoName">
                {displayInfo.name}
                <span className="nameLl"></span>
              </div>
            </div>
          </div>

          <div className="infoTitle">
            회원정보 수정
            <button className="infoEdit" onClick={handleBack}>
              뒤로가기{" "}
              <FontAwesomeIcon className="rightPrev" icon={faChevronRight} />
            </button>
          </div>
          <div className="formLine"></div>

          <div className="formName">
            <div className="labelName">이름</div>
            <div className="inputNameCt">
              <div className="inputName2">{displayInfo.name}</div>
            </div>
          </div>

          <div className="formGender">
            <div className="labelGender">성별</div>
            <div className="inputGenderCt">
              <div className="inputGender2">{displayInfo.gender}</div>
            </div>
          </div>

          <div className="formDate">
            <div className="labelDate">생년월일</div>
            <div className="inputDateCt">
              <div className="inputDate2">{displayInfo.birth}</div>
            </div>
          </div>

          <div className="formEmail">
            <div className="labelEmail">이메일</div>
            <div className="inputEmailCt">
              <input
                className="inputEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="formPassword">
            <div className="labelPassword">비밀번호</div>
            <div className="inputPasswordCt">
              <input
                className="inputPassword"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
              <div className="passwordTextCt">
                <div className="passwordText">입력가능 특수문자: !@#$%^&*</div>
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
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-group2">
            <button className="button" onClick={handleBack}>
              수정취소
            </button>
            <button className="submit" onClick={handleSubmit}>
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageInit;
