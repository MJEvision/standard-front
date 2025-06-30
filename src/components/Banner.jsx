import bannerImg from "../assets/bannerImg.png";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <>
      <div className="bannerFrame">
        <div className="bannerTextCt">
          <div className="bannerText">알려드립니다</div>
          <div className="bannerText2">
            사회초년생이라면 받을 수 있는 혜택 및 서비스
          </div>
        </div>
        <img className="bannerImg" src={bannerImg} alt="배너 이미지" />
      </div>
    </>
  );
};

export default Banner;
