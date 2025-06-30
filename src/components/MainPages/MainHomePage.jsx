import React, { useState } from "react";
import { Link } from "react-router-dom";
import mainImg from "@/assets/mainImg.png";
import mainIcon1 from "@/assets/main-icon1.png";
import mainIcon2 from "@/assets/main-icon2.png";
import mainIcon3 from "@/assets/main-icon3.png";
import mainIcon4 from "@/assets/main-icon4.png";
import homeIcon from "@/assets/homeIcon.png";
import welfareIcon from "@/assets/welfareIcon.png";
import jobIcon from "@/assets/jobIcon.png";
import educateIcon from "@/assets/educateIcon.png";
import "@/styles/mainHomePage.css";

const MainHomePage = () => {
  const [zoom] = useState(0.9);

  const handlePolicyClick = (category) => {
    console.log(`Navigating to policy: /supportPolicy?lclsfNm=${category}`);
  };

  return (
    <div className="main-page" style={{ zoom: zoom }}>
      <div className="home-container">
        <div className="mainBanner">
          <img className="mainImg" src={mainImg} alt="mainImg" />
          <div className="mainBannerTextCt">
            <div className="mainBannerText">매일매일 빠져나가는 돈...</div>
            <div className="mainBannerText2">
              <span className="mainHighlight">재정관리</span>로 나의 돈을 관리 해보세요!
            </div>
          </div>
        </div>

        <div className="iconCt">
          <div className="icon-wrapper">
            <div className="icon-row">
              <Link to="/investRecommend" className="icon-box" onClick={() => console.log("Navigating to investRecommend")}>
                <div className="finance-icon">투자 추천</div>
                <div className="icon-text">알아보기</div>
                <img className="main-icon1" src={mainIcon1} alt="아이콘1" />
              </Link>
              <Link to="/creditPolicy" className="icon-box" onClick={() => console.log("Navigating to creditPolicy")}>
                <div className="credit-icon">신용등급</div>
                <div className="icon-text">알아보기</div>
                <img className="main-icon2" src={mainIcon2} alt="아이콘2" />
              </Link>
            </div>
            <div className="icon-row">
              <Link to="/financialPage" className="icon-box" onClick={() => console.log("Navigating to MypageBefore")}>
                <div className="target-icon">금융상품</div>
                <div className="icon-text">알아보기</div>
                <img className="main-icon3" src={mainIcon3} alt="아이콘3" />
              </Link>
              <Link to="/ChatbotPage" className="icon-box" onClick={() => console.log("Navigating to ChatbotPage")}>
                <div className="solution-icon">FM챗봇</div>
                <div className="icon-text">시작하기</div>
                <img className="main-icon4" src={mainIcon4} alt="아이콘4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 정책 추천 섹션 */}
      <div className="main-body">
        <div className="main-body-text">이런 정책은 어떠신가요?</div>

        <div className="policyCt">
          <div className="homePolicyCt">
            <Link
              to="/supportPolicy?lclsfNm=주거"
              className="homePolicy"
              onClick={() => handlePolicyClick("주거")}
              tabIndex={0}
              aria-label="주거정책 페이지로 이동"
            >
              <img className="homeIcon" src={homeIcon} alt="homeIcon" />
            </Link>
            <div className="policyText">주거정책</div>
          </div>
          <div className="educatePolicyCt">
            <Link
              to="/supportPolicy?lclsfNm=교육"
              className="educatePolicy"
              onClick={() => handlePolicyClick("교육")}
              tabIndex={0}
              aria-label="교육정책 페이지로 이동"
            >
              <img className="educateIcon" src={educateIcon} alt="educateIcon" />
            </Link>
            <div className="policyText">교육정책</div>
          </div>
          <div className="welfarePolicyCt">
            <Link
              to="/supportPolicy?lclsfNm=복지문화"
              className="welfarePolicy"
              onClick={() => handlePolicyClick("복지문화")}
              tabIndex={0}
              aria-label="복지정책 페이지로 이동"
            >
              <img className="welfareIcon" src={welfareIcon} alt="welfareIcon" />
            </Link>
            <div className="policyText">복지정책</div>
          </div>
          <div className="jobPolicyCt">
            <Link
              to="/supportPolicy?lclsfNm=일자리"
              className="jobPolicy"
              onClick={() => handlePolicyClick("일자리")}
              tabIndex={0}
              aria-label="일자리정책 페이지로 이동"
            >
              <img className="jobIcon" src={jobIcon} alt="jobIcon" />
            </Link>
            <div className="policyText">일자리정책</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomePage;