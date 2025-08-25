import React, { useState, useEffect, useRef } from "react";
import "../styles/CreditRateModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";
import { rateResult } from "@/api/Ai";

const CreditRateModal = () => {
  const { user } = useAuth();
  const userName = user?.name || "Guest";

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    PH: "",
    PH_1: "",
    DL: "",
    CHL: "",
    CAF: "",
    NCA: "",
    CUR: "",
  });
  const [resultData, setResultData] = useState(null);
  const resultRef = useRef(null);
  const hasScrolled = useRef(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const num = Number(value);

    const max100 = ["PH", "CHL", "CAF", "NCA", "CUR"];
    const max9999 = ["PH_1", "DL"];

    if (max100.includes(name) && num > 100) return;
    if (max9999.includes(name) && num > 9999) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const requiredFields = {
      PH: "결제이력",
      PH_1: "결제 금액",
      DL: "부채금액",
      CHL: "신용이력",
      CAF: "신용거래빈도",
      NCA: "신규신용거래",
      CUR: "신용 사용률",
    };

    const missingFields = Object.keys(requiredFields).filter(
      (field) =>
        form[field] === "" || form[field] === null || form[field] === undefined
    );

    if (missingFields.length > 0) {
      const firstMissing = missingFields[0];

      const fieldToStep = {
        PH: 1,
        PH_1: 1,
        DL: 2,
        CHL: 3,
        CAF: 4,
        NCA: 5,
        CUR: 6,
      };

      setStep(fieldToStep[firstMissing]);
      alert(`${requiredFields[firstMissing]}을 입력해주세요.`);
      return;
    }

    console.log("제출된 데이터:", form);

    setIsLoading(true);
    try {
      setIsLoading(true);

      const response = await rateResult(form);
      console.log("API 응답:", JSON.stringify(response.data, null, 2));

      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (!data) {
        throw new Error("API response data is empty or invalid");
      }

      let grade = data.result || data.grade || data.score;
      if (grade === undefined || grade === null) {
        console.warn("Grade not found in response:", data);
        grade = "데이터 없음";
      } else {
        grade = String(grade).replace(/[^0-5]/g, "");
        if (!["1", "2", "3", "4", "5"].includes(grade)) {
          console.warn("Invalid grade value:", grade);
          grade = "데이터 없음";
        }
      }

      const result = {
        result: grade,
        tip_1: data.tip_1 || "데이터 없음",
        tip_2: data.tip_2 || "데이터 없음",
      };
      console.log("resultData 설정:", result);
      setResultData(result);
      hasScrolled.current = false;
    } catch (err) {
      console.error("서버 요청 실패:", err.message || err);
      alert("신용등급 조회에 실패했습니다. 서버를 확인해주세요.");
      setResultData({
        result: "데이터 없음",
        tip_1: "서버 오류",
        tip_2: "다시 시도해주세요.",
      });
      hasScrolled.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      PH: "",
      PH_1: "",
      DL: "",
      CHL: "",
      CAF: "",
      NCA: "",
      CUR: "",
    });
    setStep(1);
    setResultData(null);
    hasScrolled.current = false;
  };

  useEffect(() => {
    if (resultData && resultRef.current && !hasScrolled.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      hasScrolled.current = true;
    }
  }, [resultData]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="stepContent">
            <div className="mothsSelectCt">
              <select
                className="monthsSelect"
                name="PH"
                id="months"
                value={form.PH}
                onChange={handleInputChange}
              >
                <option value="">결제이력에 대한 개월을 선택해주세요</option>
                <option value="1">3개월 미만</option>
                <option value="2">12개월 미만</option>
                <option value="3">24개월 미만</option>
                <option value="4">36개월 미만</option>
              </select>
              <div className="stipulateText">개월</div>
            </div>
            <div className="priceTextCt">
              <input
                className="priceText"
                type="number"
                name="PH_1"
                value={form.PH_1}
                onChange={handleInputChange}
                placeholder="선택하신 개월의 대략적인 금액을 입력해주세요"
              />
              <div className="stipulateText">만원</div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="stepContent">
            <div className="debtCt">
              <input
                className="debt"
                type="number"
                name="DL"
                value={form.DL}
                onChange={handleInputChange}
                placeholder="부채 금액을 입력하세요"
              />
              <div className="stipulateText">만원</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="stepContent">
            <div className="creditHistoryCt">
              <input
                className="creditHistory"
                type="number"
                name="CHL"
                value={form.CHL}
                onChange={handleInputChange}
                placeholder="신용이력에 대해 적어주세요"
              />
              <div className="stipulateText">년</div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="stepContent">
            <div className="crediFrequencyCt">
              <input
                type="number"
                className="crediFrequency"
                name="CAF"
                value={form.CAF}
                onChange={handleInputChange}
                placeholder="신용거래빈도 횟수를 작성해주세요"
              />
              <div className="stipulateText">건</div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="stepContent">
            <div className="newCreditCt">
              <input
                className="newCredit"
                type="number"
                name="NCA"
                value={form.NCA}
                onChange={handleInputChange}
                placeholder="신규 신용거래 횟수를 작성해주세요"
              />
              <div className="stipulateText">건</div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="stepContent">
            <div className="creditUtiliCt">
              <input
                className="creditUtili"
                type="number"
                min={0}
                max={100}
                name="CUR"
                value={form.CUR}
                onChange={handleInputChange}
                placeholder="대략적인 신용 사용률을 작성해주세요"
              />
              <div className="stipulateText">%</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitles = {
    1: "결제이력",
    2: "부채금액",
    3: "신용이력",
    4: "신용거래빈도",
    5: "신규신용거래",
    6: "신용 사용률",
  };

  const gradeColors = {
    1: "#92dcff",
    2: "#76e3c8",
    3: "#beec51",
    4: "#ffb762",
    5: "#ffa2a2",
  };

  const neutralColor = "#dddddd";

  console.log("Auth user:", user);

  return (
    <>
      <div className="creditBoxCt">
        {step > 1 && (
          <FontAwesomeIcon
            className="prevLeft"
            icon={faChevronLeft}
            onClick={handlePrev}
          />
        )}

        <div className="creditBox">
          <div className="creditBoxTop">
            <div className="creditTitleCt">
              <div className="creditTitle">{stepTitles[step]}</div>
              <div className="creditExplain">
                신용등급 조회를 위해 6가지의 정보를 입력해주세요.
              </div>
            </div>
            <div className="creditNumberCt">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`creditNumberFrame ${
                    step === num ? "active" : ""
                  }`}
                  onClick={() => setStep(num)}
                  style={{ cursor: "pointer" }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div className="creditBoxContent">{renderStepContent()}</div>
        </div>

        {step < 6 && (
          <FontAwesomeIcon
            className="prevRight"
            icon={faChevronRight}
            onClick={handleNext}
          />
        )}
      </div>

      <div className="creditRate-btn-wrapper">
        <div className="creditRate-reset-btn" onClick={handleReset}>
          초기화
        </div>
        {step === 6 && (
          <div className="creditRate-submit-btn" onClick={handleSubmit}>
            조회하기
          </div>
        )}
      </div>

      {isLoading && (
        <div className="creditLoaderOverlay">
          <Loading />
        </div>
      )}

      {resultData && (
        <>
          <div className="creditRateLine"></div>
          <div className="rateResultFrameCt" ref={resultRef}>
            <div className="rateResultFrame">
              <div className="userTextCt">
                <div className="userText2">{userName}</div>
                <div className="rateResultText">
                  님의 <span className="rateHighlight">신용등급</span> 점수는?
                </div>
              </div>
              <div className="rateCt">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <div className="rateFrame" key={grade}>
                    <div className="rateText">
                      {grade}
                      <span className="rateLowlight">등급</span>
                    </div>
                    <div
                      className="rateBar"
                      style={{
                        backgroundColor:
                          resultData.result === String(grade)
                            ? gradeColors[grade]
                            : neutralColor,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="rateReslutTextCt">
                <div className="rateReslutText">
                  {userName}님의 신용등급은{" "}
                  <span
                    className="resultHighlight"
                    style={{
                      color:
                        resultData.result in gradeColors
                          ? gradeColors[resultData.result]
                          : "#ffa2a2",
                    }}
                  >
                    {resultData.result === "데이터 없음"
                      ? "알 수 없음"
                      : `${resultData.result}등급`}
                  </span>
                  입니다. {resultData.tip_1} <br />
                  {resultData.tip_2}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreditRateModal;
