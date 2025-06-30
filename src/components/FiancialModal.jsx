import React, { useState, useRef, useEffect } from "react";
import "../styles/FiancialModal.css";
import axios from "axios";
import Loading from "./Loading";
import kakaoBank from "@/assets/kakaoBank.png";
import shinhan from "@/assets/shinhan.png";
import kb from "@/assets/kb.png";
import us from "@/assets/us.png";
import hana from "@/assets/hana.png";
import nonghyup from "@/assets/nonghyup.png";
import toss from "@/assets/toss.png";
import defaultLogo from "@/assets/default.png"; 

const Banks = [
  "신한은행",
  "국민은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "토스은행",
  "카카오은행",
];

const Regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const banksImg = {
  신한은행: shinhan,
  국민은행: kb,
  우리은행: us,
  하나은행: hana,
  농협은행: nonghyup,
  토스은행: toss,
  카카오은행: kakaoBank,
};

const FiancialModal = () => {
  const [selectedBanks, setSelectedBanks] = useState([...Banks]);
  const [selectedRegions, setSelectedRegions] = useState([...Regions]);
  const [price, setPrice] = useState("10000000");
  const [selectedPeriod, setSelectedPeriod] = useState("3 ~ 6개월 미만");
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);
  const hasScrolled = useRef(false);

  const isAllBanksChecked = selectedBanks.length === Banks.length;
  const isAllRegionsChecked = selectedRegions.length === Regions.length;

  const toggleBank = (bank) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const toggleAllBanks = () => {
    setSelectedBanks(isAllBanksChecked ? [] : [...Banks]);
  };

  const toggleAllRegions = () => {
    setSelectedRegions(isAllRegionsChecked ? [] : [...Regions]);
  };

  const formatNumber = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPrice(raw);
  };

  const handleReset = () => {
    setSelectedBanks([...Banks]);
    setSelectedRegions([...Regions]);
    setPrice("10000000");
    setSelectedPeriod("3 ~ 6개월 미만");
    setResultData(null);
    hasScrolled.current = false;
  };

  const getBankFromProduct = (productName) => {
    return (
      Banks.find((bank) => productName.includes(bank.replace("은행", ""))) ||
      "Unknown"
    );
  };

  const handleSubmit = async () => {
    // Validation checks in order
    if (!price) {
      alert("저축 금액을 입력해주세요.");
      return;
    }
    if (!selectedPeriod) {
      alert("저축 기간을 선택하세요.");
      return;
    }
    if (selectedBanks.length === 0) {
      alert("최소 하나의 은행을 선택하세요.");
      return;
    }
    if (selectedRegions.length === 0) {
      alert("최소 하나의 지역을 선택하세요.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        value: parseInt(price, 10),
        period: selectedPeriod,
        bank: selectedBanks.join(","),
        country: selectedRegions.join(","),
      };
      console.log("API Request:", {
        url: "http://localhost:8000/prodRecom",
        payload,
      });

      const response = await axios.post(
        "http://localhost:8000/prodRecom",
        payload
      );

      console.log("Raw response data:", JSON.stringify(response.data, null, 2));

      const data = response.data;
      if (!data || Object.keys(data).length === 0) {
        throw new Error("API response data is empty or invalid");
      }

      const result = [
        {
          product_name: data.product_name_1 || "데이터 없음",
          interest_rate: data.interest_rate_1 || "데이터 없음",
          product_reason: data.product_reason_1 || "데이터 없음",
          init_term: data.init_term_1 || "데이터 없음",
          period: data.period_1 || "데이터 없음",
          product_link: data.product_link_1 || "#",
          bank: getBankFromProduct(data.product_name_1 || ""),
        },
        {
          product_name: data.product_name_2 || "데이터 없음",
          interest_rate: data.interest_rate_2 || "데이터 없음",
          product_reason: data.product_reason_2 || "데이터 없음",
          init_term: data.init_term_2 || "데이터 없음",
          period: data.period_2 || "데이터 없음",
          product_link: data.product_link_2 || "#",
          bank: getBankFromProduct(data.product_name_2 || ""),
        },
        {
          product_name: data.product_name_3 || "데이터 없음",
          interest_rate: data.interest_rate_3 || "데이터 없음",
          product_reason: data.product_reason_3 || "데이터 없음",
          init_term: data.init_term_3 || "데이터 없음",
          period: data.period_3 || "데이터 없음",
          product_link: data.product_link_3 || "#",
          bank: getBankFromProduct(data.product_name_3 || ""),
        },
      ];
      console.log("Processed result:", JSON.stringify(result, null, 2));
      setResultData(result);
      hasScrolled.current = false;
    } catch (err) {
      console.error("API Error:", {
        message: err.message,
        response: err.response
          ? JSON.stringify(err.response.data, null, 2)
          : "No response data",
        status: err.response ? err.response.status : "No status",
      });
      alert(
        `상품 비교 조회에 실패했습니다. 오류: ${err.message}. 서버 상태를 확인해주세요.`
      );
      const errorResult = [
        {
          product_name: "서버 오류",
          interest_rate: "데이터 없음",
          product_reason: "다시 시도해주세요.",
          init_term: "데이터 없음",
          period: "데이터 없음",
          product_link: "#",
          bank: "Unknown",
        },
      ];
      setResultData(errorResult);
      hasScrolled.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resultData && resultRef.current && !hasScrolled.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      hasScrolled.current = true;
    }
  }, [resultData]);

  return (
    <div className="financeInputFrameCt" style={{ zoom: 0.9 }}>
      {isLoading && (
        <div className="financeLoaderOverlay">
          <Loading />
        </div>
      )}
      <form className="financeInputFrame">
        <div className="savingInputFrameCt">
          <div className="savingInputFrame">
            <div className="savingInput">
              <div className="savingTitle">저축 금액</div>
              <input
                className="savingText"
                type="text"
                id="price"
                name="price"
                value={formatNumber(price)}
                onChange={handleChange}
              />
              <div className="savingPhrase">원</div>
            </div>

            <div className="fianceBtnCt">
              <div className="fianceBtnTitle">저축 기간</div>
              <div className="fianceBtns">
                {[
                  "상관없음",
                  "3개월 미만",
                  "3 ~ 6개월 미만",
                  "6 ~ 12개월 미만",
                  "36개월 초과",
                ].map((month) => (
                  <button
                    className={`fianceBtn ${
                      selectedPeriod === month ? "selected" : ""
                    }`}
                    type="button"
                    key={month}
                    onClick={() => setSelectedPeriod(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bankSelectFrame">
          <div className="bankSelect">
            <div className="bankTitle">은행선택</div>
            <div className="bankCheckBoxCt">
              <label className="bankCheckboxLabel">
                <input
                  type="checkbox"
                  checked={isAllBanksChecked}
                  onChange={toggleAllBanks}
                />
                전체
              </label>
              {Banks.map((bank) => (
                <label key={bank} className="bankCheckboxLabel">
                  <input
                    type="checkbox"
                    checked={selectedBanks.includes(bank)}
                    onChange={() => toggleBank(bank)}
                  />
                  {bank}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="localSelectFrame">
          <div className="localSelect">
            <div className="localTitle">지역선택</div>
            <div className="localCheckBoxCt">
              <label className="localCheckboxLabel">
                <input
                  type="checkbox"
                  checked={isAllRegionsChecked}
                  onChange={toggleAllRegions}
                />
                전체
              </label>
              {Regions.map((region) => (
                <label key={region} className="localCheckboxLabel">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region)}
                    onChange={() => toggleRegion(region)}
                  />
                  {region}
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div className="compareBtns">
        <button className="resetBtn" type="button" onClick={handleReset}>
          초기화
        </button>
        <button className="compareBtn" type="button" onClick={handleSubmit}>
          비교하기
        </button>
      </div>

      {resultData && (
        <>
          <div className="financeResultLine"></div>
          <div className="financeResultFrameCt" ref={resultRef}>
            <div className="financeResultTextCt">
              <div className="financeResultText">금융상품 추천 결과</div>
              <div className="financeResultText2">
                • 은행 전체 선택과 조회결과 상품이 부족한 경우, 대안으로 적합한 금융상품을 제시해드립니다.
              </div>
            </div>
            <div className="financeResultList">
              {resultData.map((product, index) => (
                <div key={index} className="financeResultItem">
                  <div className="ResultTopItem">
                    <img
                      src={banksImg[product.bank] || defaultLogo}
                      alt={`${product.bank} 로고`}
                      className="bankLogoImg"
                    />
                    <div className="financeResultProductName">
                      {product.product_name}
                    </div>
                  </div>
                  <div className="financeResultExplain">
                    <div className="financeResultInterestRate">
                      {product.interest_rate}
                    </div>
                    <div className="financeResultReasonCt">
                      <div className="financeResultReason">
                        {product.product_reason}
                      </div>
                      <div className="financeResultInitTerm">
                        {product.init_term}
                      </div>
                    </div>
                    <div className="financeResultPeriod">{product.period}</div>
                    {product.product_link && product.product_link !== "#" && (
                      <a
                        href={product.product_link}
                        target="_blank"
                        rel="noreferrer"
                        className="financeResultLink"
                        aria-label={`${product.product_name} 상품 페이지로 이동`}
                      >
                        상품 보러가기
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FiancialModal;