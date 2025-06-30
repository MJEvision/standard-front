import { useState } from "react";
import bcImg from "@/assets/bcImg.png";
import bcImg2 from "@/assets/bcImg2.png";
import bcImg3 from "@/assets/bcImg3.png";
import bcImg4 from "@/assets/bcImg4.png";
import "@/styles/MainHomePage3.css";

const MainHomePage3 =() =>{
    const [zoom] = useState(0.9); 
    return(
        <div className="mainHomePageFrame" styles={{ zoom: zoom }}>
            <div className="mainHomePageText">Newcomer to society</div>
            <div className="mainHomePageText2">프레시머니는 사회초년생을 위하여, 복잡한 재정 관리를 쉽고<br/>빠르게 시작할 수 있도록 돕는 서비스입니다.</div>
            
            <div className="imgFrameCt">
            <div className="imgFrame">
                <img className="bcImg" src={bcImg} alt="img" />
                <div className="bcImgText">소득관리</div>
            </div>
            <div className="imgFrame">
                <img className="bcImg" src={bcImg2} alt="img" />
                <div className="bcImgText">소득통제</div>
            </div>
            <div className="imgFrame">
                <img className="bcImg2" src={bcImg3} alt="img" />
                <div className="bcImgText">자산형성</div>
            </div>
            <div className="imgFrame">
                <img className="bcImg" src={bcImg4} alt="img" />
                <div className="bcImgText">금융지식</div>
            </div>

            </div>
        </div>
    )
}

export default MainHomePage3;