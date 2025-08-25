import React from "react";
import "@/styles/FormEmail.css";
import api from "@/api";

const FormEmail = ({ email, onChange, setIsEmailSent, isEmailVerified }) => {
  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    try {
      await api.post('/email-verification/send?email=' + email);
      alert("인증코드가 발송되었습니다.");
      setIsEmailSent(true);
    } catch (error) {
      console.error("인증코드 발송 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="FormEmail">
      <div className="LabelEmail">이메일</div>
      <div className="InputEmailCt">
        <input
          className="InputEmail"
          name="email"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className="EmailButton"
          onClick={handleSendCode}
          disabled={isEmailVerified}
        >
          인증코드 발송
        </button>
      </div>
    </div>
  );
};

export default FormEmail;
