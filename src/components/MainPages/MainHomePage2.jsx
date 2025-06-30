import { useState } from "react";
import think from "@/assets/think.png";
import salut from "@/assets/salut.png";
import "@/styles/MainHomePage2.css";

const MainHomePage2 = () => {
      const [zoom] = useState(0.9); 

  return (
    <>
    <div className="section" style={{ zoom: zoom }}>
      <div className="sectionTitle">어떤 사항에 사용이 되나요?</div>
      <div className="sectionCards">

      <div className="sectionCard">
        <img className="cardIcon" src={think} alt="think" />
        <div className="cardFrame">
          <div className="cardText">청년도약 매달 70만원 말고는 없는데..</div> 
          <div className="cardText2"><span className="cardHighligt">다른 투자 방법</span>은 없을까요?</div>
        </div>
      </div>

      <div className="sectionCard2">
        <img className="cardIcon2" src={salut} alt="think" />
        <div className="cardFrame2">
          <div className="cardText">군적금 + 각종 지원금으로 나오는 1000만원 넘는 금액으로</div> 
          <div className="cardText2"><span className="cardHighligt">주식 포트폴리오</span>를 구성하고 싶어요.</div>
        </div>
      </div>

      </div>
    </div>
    </>
  );
};

export default MainHomePage2;