import React, { useState, useEffect } from 'react';
import '../styles/CreditRatePage.css';
import bannerImg from '@/assets/bannerImg.png';
import { CreditRateModal } from '../../allFiles';

const CreditRatePage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const checkScrollPosition = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowScrollButton(scrollTop > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const [zoom] = useState(0.9);

  return (
    <>
      <div className="creditRateFrame" style={{ zoom: zoom }}>
        <div className="creditRateTitle">신용 등급</div>
        <div className="bannerFrame">
          <div className="bannerTextCt">
            <div className="bannerText">알려드립니다</div>
            <div className="bannerText2">
              자신의 정보를 입력 후 신용등급을 확인 해보세요!
            </div>
          </div>
          <img className="bannerImg" src={bannerImg} alt="배너 이미지" />
        </div>
        <CreditRateModal />
      </div>
      {showScrollButton && (
        <button className="scrollToTop" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default CreditRatePage;