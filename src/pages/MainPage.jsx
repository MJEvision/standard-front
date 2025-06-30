import React, { useEffect, useState } from 'react';
import MainHomePage from "../components/MainPages/MainHomePage";
import MainHomePage2 from "../components/MainPages/MainHomePage2";
import MainHomePage3 from "../components/MainPages/MainHomePage3";
import '../styles/MainPage.css';

const MainPage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const checkScrollBottom = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
    setShowScrollButton(distanceFromBottom < 500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollBottom);
    checkScrollBottom();
    return () => window.removeEventListener('scroll', checkScrollBottom);
  }, []);

  return (
    <>
      <MainHomePage />
      <MainHomePage2 />
      <MainHomePage3 />
      {showScrollButton && (
        <button className="scrollToTop" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default MainPage;