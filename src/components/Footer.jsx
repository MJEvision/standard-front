import { Link } from "react-router-dom";
import "../styles/Footer.css";
import FooterLogo from "../assets/footer.png";
import { useState } from "react";

const Footer = () => {
    const [zoom] = useState(0.9); 
    return (
        <>
        <div className="Footer-wrapper">
            <div className="FooterFrame"  style={{ zoom: zoom }}>
                <div className="FooterLeft">
                <div className="FooterLink">
                    <Link className="selectfc2" to="/supportPolicy">지원 정책</Link>
                    <Link className="selectfc2" to="/creditPolicy">신용 등급</Link>
                    <Link className="selectfc2" to="/investRecommend">투자 추천</Link>
                    <Link className="selectfc2" to="/financialPage">금융상품 추천</Link>
                    <Link className="selectfc2" to="/ChatbotPage">FM챗봇</Link>
                </div>
                    <div className="FooterTextCt">
                        <div className="FooterText">FreshMoney</div>
                        <div className="FooterLine"></div>
                        <div className="FooterText2">경상북도 봉호로 14 (경북소프트웨어마이스터고등학교)</div>
                        <div className="FooterLine"></div>
                        <div className="FooterText">standard</div>
                    </div>
                    <div className="privacyPolicyText">Copyright © 2025 Freshmoney. All rights reserved</div>
                </div>
                <div className="FooterRight">
                <a href="https://school.gyo6.net/gbsw/main.do?sysId=gbsw" target="_blank" rel="noopener noreferrer">
                    <img className="FooterLogo" src={FooterLogo} alt="gbsw" />
                </a>
                </div>
                </div>
            </div>
        </>
    )
}

export default Footer;