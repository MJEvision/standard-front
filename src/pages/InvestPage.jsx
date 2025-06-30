import React, { useEffect, useState } from "react";
import bannerImg from "@/assets/bannerImg.png";
import "../styles/InvestPage.css";
import InvestModal from "@/components/InvestModal";

const InvestPage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const checkScrollPosition = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowScrollButton(scrollTop > 500); 
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    checkScrollPosition();
    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const [zoom] = useState(0.9);

  return (
    <>
      <div className="investFrame" style={{ zoom: zoom }}>
        <div className="investTitle">투자 추천</div>
        <div className="bannerFrame">
          <div className="bannerTextCt">
            <div className="bannerText">알려드립니다</div>
            <div className="bannerText2">
              원하는 투자 조건을 입력 후 나만의 투자 추천을 받아보세요!
            </div>
          </div>
          <img className="bannerImg" src={bannerImg} alt="배너 이미지" />
        </div>
        <InvestModal />
      </div>
      {showScrollButton && (
        <button className="scrollToTop" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default InvestPage;