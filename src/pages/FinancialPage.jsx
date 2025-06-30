import "../styles/FinancialPage.css";
import { useState } from "react";
import bannerImg from "../assets/bannerImg.png"
import FiancialModal from "@/components/FiancialModal";

const FinancialPage = () => {
      const [zoom] = useState(0.9); 
  return (
    <>
      <div className="financePageFrame" style={{ zoom: zoom }}>
        <div className="financeTitle">금융상품 추천</div>
          <div className="bannerFrame">
            <div className="bannerTextCt">
              <div className="bannerText">알려드립니다</div>
              <div className="bannerText2">
                각각의 은행권과 비교하여 가장 혜택이 많은 금융상품을 찾아보세요 
              </div>
            </div>
            <img className="bannerImg" src={bannerImg} alt="배너 이미지" />
          </div>`
            <FiancialModal />
        </div>
      </>
  );
};

export default FinancialPage;