import React from "react";
import "@/styles/FormEmail.css";
import api from "@/api";

const FormEmail = ({ email, onChange, setIsEmailSent, isEmailVerified }) => {
  const handleSendCode = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    const payload = {
      email: trimmedEmail,
      purpose: "signup",
      locale: "ko",
    };

    try {
      const res = await api.post("/email-verification/send", payload);
      console.log("서버 응답:", res.data);
      alert("인증코드가 발송되었습니다.");
      setIsEmailSent(true);
    } catch (error) {
      console.error("서버 응답 에러:", error.response?.data || error);
      alert(error.response?.data?.message || "오류 발생. 다시 시도해주세요.");
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
