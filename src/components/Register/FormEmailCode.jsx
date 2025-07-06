import React from "react";
import '@/styles/FormEmailCode.css';
import api from "@/api";

const FormEmailCode = ({ email, emailCode, onChange, isEmailSent, isEmailVerified, setIsEmailVerified }) => {
    const handleVerifyCode = async () => {
        if (!emailCode) {
            alert("인증코드를 입력해주세요.");
            return;
        }

        try {
            const response = await api.post("/email-verification/verify", {
                email: email,
                code: emailCode,
            });

            if (response.status === 200 || response.status === 201) {
                alert("이메일 인증이 완료되었습니다.");
                setIsEmailVerified(true);
            } else {
                alert("이메일 인증에 실패했습니다.");
            }
        } catch (error) {
            console.error("이메일 인증 오류:", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
    };

    return (
        <div className="FormEmailCode">
            <div className="LabelEmailCode">이메일 인증</div>
            <div className="InputEmailCodeCt">
                <input
                    className="InputEmailCode"
                    name="emailCode"
                    type="text"
                    placeholder="인증코드를 입력해주세요"
                    value={emailCode}
                    onChange={onChange}
                    disabled={!isEmailSent || isEmailVerified}
                    required
                />
                <button 
                    type="button" 
                    className="VerifyButton"
                    onClick={handleVerifyCode}
                    disabled={!isEmailSent || isEmailVerified}
                >
                    인증 확인
                </button>
            </div>
            {isEmailVerified && <div className="VerifiedText">인증 완료됨</div>}
        </div>
    );
};

export default FormEmailCode;
