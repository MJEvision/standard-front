import React, { useState, useEffect, useRef } from "react";
import "../styles/InvestModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import Loading from "./Loading";
import { investRecommend } from "@/api/Ai";

const InvestModal = () => {
  const { user } = useAuth();
  const userName = user?.name || "Guest";

  const [form, setForm] = useState({
    interestRate: "",
    dateRange: { startDate: new Date(), endDate: new Date(), key: "selection" },
    principalGuarantee: "",
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const resultRef = useRef(null);
  const hasScrolled = useRef(false);

  const getRecommendation = (category, data) => {
    const map = {
      예금: {
        keyword: data.deposit_keyword,
        reason: data.deposit_reason,
        link: data.deposit_link,
      },
      적금: {
        keyword: data.savings_keyword,
        reason: data.savings_reason,
        link: data.savings_link,
      },
      펀드: {
        keyword: data.fund_keyword,
        reason: data.fund_reason,
        link: null,
      },
      주식: {
        keyword: data.stock_keyword,
        reason: data.stock_reason,
        link: null,
      },
    };

    const item = map[category] || {
      keyword: "데이터 없음",
      reason: "데이터 없음",
      link: null,
    };

    const linkText =
      category === "예금" || category === "적금"
        ? item.link && item.link !== "#" && item.link.trim() !== ""
          ? `<a href="${item.link}" target="_blank" rel="noreferrer" class="investTextLink" aria-label="${category} 상품 페이지로 이동">상품 보러가기</a>`
          : "데이터 없음"
        : "";

    return `${item.keyword || "데이터 없음"}\n${item.reason || "데이터 없음"}${
      linkText ? `\n${linkText}` : ""
    }`.trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "interestRate") {
      if (value === "" || /^\d*\.?\d{0,1}$/.test(value)) {
        const num = Number(value);
        if (value === "" || (num >= 0 && num <= 10)) {
          setForm((prev) => ({ ...prev, [name]: value }));
        }
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateSelect = (e) => {
    const { name, value } = e.target;
    if (value) {
      const selectedDate = new Date(value);
      setForm((prev) => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name]: selectedDate },
      }));
    }
  };

  const handleDateClick = (e) => {
    e.target.showPicker();
  };

  const handleNext = () => step < 3 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  const handleReset = () => {
    setForm({
      interestRate: "",
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
      principalGuarantee: "",
    });
    setStep(1);
    setResultData(null);
    hasScrolled.current = false;
  };

  const handleSubmit = async () => {
    if (!form.interestRate) {
      alert("이율을 입력해주세요.");
      return;
    }
    if (!form.principalGuarantee) {
      alert("원금보장 여부를 선택하세요.");
      return;
    }
    if (form.dateRange.startDate > form.dateRange.endDate) {
      alert("종료 날짜는 시작 날짜 이후로 선택하세요.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        interestRate: parseFloat(form.interestRate),
        startDate: format(form.dateRange.startDate, "yyyy-MM-dd"),
        endDate: format(form.dateRange.endDate, "yyyy-MM-dd"),
        principalGuarantee: form.principalGuarantee,
      };
      console.log("API Request:", {
        url: "http://localhost:8000/invRecom",
        payload,
      });

      const response = await investRecommend(payload);

      console.log("Full response:", response);
      console.log("Raw response data:", JSON.stringify(response.data, null, 2));

      let data = response.data;
      if (Array.isArray(response.data)) {
        data = response.data[0] || {};
        console.log("Using first array element:", JSON.stringify(data, null, 2));
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("API response data is empty or invalid");
      }

      const result = {
        category: data.result || data.category || "예금",
        deposit_keyword: data.deposit_keyword || "데이터 없음",
        deposit_reason: data.deposit_reason || "데이터 없음",
        deposit_link: data.deposit_link || "#",
        savings_keyword: data.savings_keyword || "데이터 없음",
        savings_reason: data.savings_reason || "데이터 없음",
        savings_link: data.savings_link || "#",
        fund_keyword: data.fund_keyword || "데이터 없음",
        fund_reason: data.fund_reason || "데이터 없음",
        fund_link: null, 
        stock_keyword: data.stock_keyword || "데이터 없음",
        stock_reason: data.stock_reason || "데이터 없음",
        stock_link: null, 
      };
      console.log("Processed result:", JSON.stringify(result, null, 2));
      result.recommendation = getRecommendation(result.category, result);
      setResultData(result);
      hasScrolled.current = false;
    } catch (err) {
      console.error("API Error:", {
        message: err.message,
        response: err.response ? JSON.stringify(err.response.data, null, 2) : "No response data",
        status: err.response ? err.response.status : "No status",
      });
      alert(
        `투자 추천 조회에 실패했습니다. 오류: ${err.message}. 서버 상태를 확인해주세요.`
      );
      const errorResult = {
        category: "예금",
        deposit_keyword: "서버 오류",
        deposit_reason: "다시 시도해주세요.",
        deposit_link: "#",
        savings_keyword: "서버 오류",
        savings_reason: "다시 시도해주세요.",
        savings_link: "#",
        fund_keyword: "서버 오류",
        fund_reason: "다시 시도해주세요.",
        fund_link: null,
        stock_keyword: "서버 오류",
        stock_reason: "다시 시도해주세요.",
        stock_link: null,
      };
      errorResult.recommendation = getRecommendation("예금", errorResult);
      setResultData(errorResult);
      hasScrolled.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    1: "이율",
    2: "투자기간",
    3: "원금보장 여부",
  };

  const stepExplanations = {
    1: "예금 또는 투자 상품의 예상 이율(%)을 입력해주세요",
    2: "투자를 진행할 기간을 설정해주세요 (시작일과 종료일 입력)",
    3: "투자 원금이 보장되는 상품인지 선택해주세요. (보장 또는 비보장 선택)",
  };

  useEffect(() => {
    if (resultData && resultRef.current && !hasScrolled.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      hasScrolled.current = true;
    }
  }, [resultData]);

  const formatDateForInput = (date) => format(date, "yyyy-MM-dd");
  const preventTyping = (e) => e.preventDefault();

  const renderStepContent = () => {
    const steps = [
      {
        content: (
          <div className="stepContent">
            <div className="interestInputCt">
              <input
                className="interestInput"
                type="text"
                name="interestRate"
                value={form.interestRate}
                onChange={handleInputChange}
                placeholder="예금·대출하신 이자율 입력를 입력하세요 (1~10% 입력가능)"
              />
              <div className="stipulateText">%</div>
            </div>
          </div>
        ),
      },
      {
        content: (
          <div className="stepContent">
            <div className="dateInputCt">
              <input
                className="dateInput"
                type="date"
                name="startDate"
                value={formatDateForInput(form.dateRange.startDate)}
                onChange={handleDateSelect}
                onClick={handleDateClick}
                onKeyDown={preventTyping}
              />
              <div className="dateSeparator">~</div>
              <input
                className="dateInput"
                type="date"
                name="endDate"
                value={formatDateForInput(form.dateRange.endDate)}
                onChange={handleDateSelect}
                onClick={handleDateClick}
                onKeyDown={preventTyping}
              />
            </div>
          </div>
        ),
      },
      {
        content: (
          <div className="stepContent">
            <div className="principalCt">
              <select
                className="principalSelect"
                name="principalGuarantee"
                value={form.principalGuarantee}
                onChange={handleInputChange}
              >
                <option value="">원금보장 여부를 선택하세요</option>
                <option value="1">네</option>
                <option value="2">아니요</option>
              </select>
            </div>
          </div>
        ),
      },
    ];

    return steps[step - 1]?.content || null;
  };

  return (
    <div className="investRateFrame">
      {isLoading && (
        <div className="investLoaderOverlay">
          <Loading />
        </div>
      )}
      <div className="investBoxCt">
        {step > 1 && (
          <FontAwesomeIcon
            className="prevLeft"
            icon={faChevronLeft}
            onClick={handlePrev}
          />
        )}
        <div className="investBox">
          <div className="investBoxTop">
            <div className="investTitleCt">
              <div className="investTitle2">{stepTitles[step]}</div>
              <div className="investExplain">
              {stepExplanations?.[step] ?? ""}
              </div>
            </div>
            <div className="investNumberCt">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`investNumberFrame ${
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
          <div className="investBoxContent">{renderStepContent()}</div>
        </div>
        {step < 3 && (
          <FontAwesomeIcon
            className="prevRight"
            icon={faChevronRight}
            onClick={handleNext}
          />
        )}
      </div>
      <div className="invest-btn-wrapper">
        <div className="invest-reset-btn" onClick={handleReset}>
          초기화
        </div>
        {step === 3 && (
          <div className="invest-submit-btn" onClick={handleSubmit}>
            조회하기
          </div>
        )}
      </div>
      {resultData && (
        <>
          <div className="investLine"></div>
          <div className="investResultFrameCt" ref={resultRef}>
            <div className="investResultFrame">
              <div className="userTextCt2">
                <div className="userText">{userName}</div>
                <div className="investResultTitleCt">
                  님의 <span className="investHighlight">투자 추천</span>정보는?
                </div>
              </div>
              <div className="investCategoryCt">
                {["예금", "적금", "펀드", "주식"].map((category) => (
                  <div
                    key={category}
                    className={`investCategory ${
                      resultData.category === category ? "active" : ""
                    }`}
                    onClick={() =>
                      setResultData({
                        ...resultData,
                        category,
                        recommendation: getRecommendation(category, resultData),
                      })
                    }
                  >
                    {category}
                    {resultData.category === category && (
                      <div className="colorBox"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="categoryLine"></div>
              <div className="investResultTextCt">
                <div
                  className="investResultText"
                  dangerouslySetInnerHTML={{
                    __html: (resultData.recommendation ||
                      getRecommendation(resultData.category, resultData)).replace(
                      /\n/g,
                      "<br />"
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestModal;