// src/Logup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import FormEmail from "../components/Register/FormEmail";
import FormEmailCode from "../components/Register/FormEmailCode";
import { register } from "../api/Register";
import { useAuth } from "../context/AuthContext";

const Logup = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    birth: "",
    email: "",
    emailCode: "",
    password: "",
    confirmPassword: "",
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [zoom] = useState(0.9);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*]/.test(value);
      const isValidLength = value.length >= 9 && value.length <= 16;
      if (!hasLetter || !hasNumber || !hasSpecial || !isValidLength) {
        console.warn("비밀번호는 9~16자이며 영문자, 숫자, 특수문자를 모두 포함해야 합니다.");
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleBirthChange = (e) => {
    const input = e.target.value;
    const numbers = input.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (numbers.length <= 4) {
      formatted = numbers;
    } else if (numbers.length <= 6) {
      formatted = `${numbers.slice(0, 4)}.${numbers.slice(4)}`;
    } else {
      formatted = `${numbers.slice(0, 4)}.${numbers.slice(4, 6)}.${numbers.slice(6)}`;
    }
    setForm({ ...form, birth: formatted });
  };

  const calculateAge = (birthString) => {
    if (!birthString) return "";
    const parts = birthString.split(".");
    if (parts.length !== 3) return "";
    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10);
    const birthDay = parseInt(parts[2], 10);
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    if (
      today.getMonth() + 1 < birthMonth ||
      (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
    ) {
      age--;
    }
    return age.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.gender) {
      alert("성별을 선택하세요.");
      return;
    }
    if (!form.birth || form.birth.length !== 10) {
      alert("올바른 생년월일을 입력하세요 (YYYY.MM.DD).");
      return;
    }

    const age = calculateAge(form.birth);
    const userData = {
      email: form.email,
      password: form.password,
      username: form.name,
      name: form.name,
      age: parseInt(age) || 0,
      sex: form.gender === "남성" ? "male" : "female",
      birth: form.birth.replace(/\./g, "-"),
    };

    try {
      const response = await register(userData);
      console.log("회원가입 응답:", response);

      const user = response.data.user || response.data || userData;
      const token = response.data.token || "";

      if (response.status === 201 && user?.id) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", user.id.toString());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("name", user.name || form.name);
        localStorage.setItem("email", user.email || form.email);
        localStorage.setItem("gender", form.gender);
        localStorage.setItem("birth", form.birth);
        localStorage.setItem("age", age);
        alert("회원가입 성공!");
        navigate("/");
      } else {
        console.error("예상치 못한 응답:", { status: response.status, data: response.data });
        alert(`회원가입 실패: 서버 응답이 예상과 다릅니다. 상태 코드: ${response.status}`);
      }
    } catch (err) {
      console.error("회원가입 오류:", err.response || err);
      const errorMessage = err.response?.data?.sqlMessage || err.response?.data?.message || err.message || "알 수 없는 오류";
      if (errorMessage.includes("doesn't have a default value")) {
        alert("회원가입 오류: 필수 입력값이 누락되었습니다. 관리자에게 문의하세요.");
      } else {
        alert(`회원가입 오류: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="logup-wrapper" style={{ zoom: zoom }}>
      <div className="logup-container">
        <div className="LogupTextCt">
          <div className="logup-text">회원가입</div>
          <div className="logupText2">회원가입을 하여 서비스를 이용해보세요.</div>
        </div>
        <form onSubmit={handleSubmit}>
          <FormEmail
            email={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            setIsEmailSent={setIsEmailSent}
            isEmailVerified={isEmailVerified}
          />
          <FormEmailCode
            email={form.email}
            emailCode={form.emailCode}
            onChange={handleChange}
            isEmailSent={isEmailSent}
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={setIsEmailVerified}
          />
          <div className="FormPassword">
            <div className="LabelPassword">비밀번호</div>
            <div className="InputPasswordCt">
              <div className="PasswordTogle">
                <input
                  className="InputPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", fontSize: "18px", marginLeft: "10px", color: "#999" }}
                />
              </div>
              <div className="PasswordTextCt">
                <div className="PasswordText">입력가능 특수문자 : ! @ # $ % ^ & *</div>
                <div className="PasswordText2">
                  (보안지침에 따라 비밀번호는 9~16자리이며, 반드시 영문자·숫자·특수문자를 모두 혼합하여 입력하시기 바랍니다. 대소문자 구분되므로 주의!)
                </div>
              </div>
            </div>
          </div>
          <div className="FormPasswordCheck">
            <div className="LabelPasswordCheck">비밀번호 확인</div>
            <div className="InputPasswordCheckCt">
              <div className="PasswordTogle">
                <input
                  className="InputPasswordCheck"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer", fontSize: "18px", marginLeft: "10px", color: "#999" }}
                />
              </div>
            </div>
          </div>
          <div className="FormName">
            <div className="LabelName">이름</div>
            <div className="InputNameCt">
              <input
                className="InputName"
                name="name"
                type="text"
                placeholder="이름을 입력해주세요"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="FormGender">
            <div className="LabelGender">성별</div>
            <div className="InputGenderCt">
              <select
                className="SelectGender"
                name="gender"
                onChange={handleChange}
                value={form.gender}
                required
                style={{ color: form.gender === "" ? "#aaa" : "#000" }}
              >
                <option value="" disabled hidden>
                  성별 선택
                </option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
          </div>
          <div className="FormDate">
            <div className="LabelDate">생년월일</div>
            <div className="InputDateCt">
              <input
                className="InputDate"
                name="birth"
                type="text"
                placeholder="YYYY.MM.DD"
                value={form.birth}
                onChange={handleBirthChange}
                maxLength={10}
                required
              />
            </div>
          </div>
          <div className="button-group2">
            <button className="logupCancel" type="button" onClick={() => navigate("/")}>
              가입 취소
            </button>
            <button className="logupSubmit" type="submit">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Logup;