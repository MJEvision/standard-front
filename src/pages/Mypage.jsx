import { useState } from "react";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/Mypage.css";
import man from "../assets/man.png";
import manShape from "../assets/manShape.png";

const Mypage = () => {
  const [form, setForm] = useState({ gender: "", birth: "", password: "" });

  const handleBirthChange = (e) => {
    setForm({ ...form, birth: e.target.value });
  };

  const [email, setEmail] = useState("");
  const onEmailChange = (e) => setEmail(e.target.value);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <>
      <div className="mypageFrame">
        <div className="mypageForm">
          <div className="mypageTitle">마이페이지</div>
          <div className="mypageInfo">
            <img className="genderImg" src={man} alt="man" />
            {/* <img className="genderImg" src={woman} alt="woman" /> */}
            <div className="infoRight">
              <div className="infoName">
                OOO<span className="nameLl"> 님 반갑습니다</span>
              </div>
              <div className="infoGenderM">
                <img className="manShape" src={manShape} alt="manShape" />
              </div>
              {/* <div className="infoGenderWm">
                        <img className="womanShape" src={womanShape} alt="womanShape" />
                    </div> */}
              <div className="infoDate">2008.01.08</div>
              <div className="infoEdit">
                수정하기
                <FontAwesomeIcon className="rightPrev" icon={faChevronRight} />
              </div>
            </div>
          </div>
          <div className="formLine"></div>

          <div className="formName">
            <div className="labelName">이름</div>
            <div className="inputNameCt">
              <input
                className="inputName"
                name="name"
                type="text"
                placeholder="이름을 입력해주세요"
                required
              />
            </div>
          </div>

          <div className="formGender">
            <div className="labelGender">성별</div>
            <div className="inputGenderCt">
              <select
                className="selectGender"
                name="gender"
                required
                style={{ color: form.gender === "" ? "#999" : "#000" }}
              >
                <option value="" disabled hidden>
                  성별 선택
                </option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
          </div>

          <div className="formDate">
            <div className="labelDate">생년월일</div>
            <div className="inputDateCt">
              <input
                className="inputDate"
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

          <div className="formEmail">
            <div className="labelEmail">이메일</div>
            <div className="inputEmailCt">
              <input
                className="inputEmail"
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={onEmailChange}
                required
              />
            </div>
          </div>

          <div className="formPassword">
              <div className="labelPassword">비밀번호</div>
              <div className="inputPasswordCt">
                  <div className="passwordTogle">
                      <input
                          className="inputPassword"
                          name="confirmPassword"
                          type={showPassword2 ? "text" : "password"}
                          placeholder="비밀번호를 입력해주세요"
                          onChange={handleChange}
                          required
                      />
                      <img
                          src={showPassword2 ? "/eye-off.svg" : "/eye.svg"}
                          alt="비밀번호 보기 토글"
                          onClick={() => setShowPassword2(!showPassword2)}
                          style={{ cursor: "pointer", width: "24px", height: "24px", marginLeft: "8px" }}
                      />
                  </div>
                  <div className="passwordTextCt">
                    <div clsssName="passwordText">입력가능 특수문자: !@#$%^&*</div>
                    <div clsssName="passwordText2">(보안지침에 따라 비밀번호는 9~16자리이며, 반드시 영문자·숫자·특수문자를 모두 혼합하여 입력하시기 바랍니다. 대소문자 구분되므로 주의!)</div>
                  </div>
              </div>
            </div>

          <div className="formPasswordCheck">
              <div className="labelPasswordCheck">비밀번호 확인</div>
              <div className="inputPasswordCheckCt">
                  <div className="passwordTogle">
                      <input
                          className="inputPasswordCheck"
                          name="confirmPassword"
                          type={showPassword2 ? "text" : "password"}
                          placeholder="비밀번호를 다시 입력해주세요"
                          onChange={handleChange}
                          required
                      />
                      <img
                          src={showPassword2 ? "/eye-off.svg" : "/eye.svg"}
                          alt="비밀번호 보기 토글"
                          onClick={() => setShowPassword2(!showPassword2)}
                          style={{ cursor: "pointer", width: "24px", height: "24px", marginLeft: "8px" }}
                      />
                  </div>
              </div>
            </div>

            <div className="button-group">
              <button className="button" type="button">수정 취소</button>
              <button className="submit" type="submit">수정 확인</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Mypage;
