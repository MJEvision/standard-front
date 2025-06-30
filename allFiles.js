import Header from './src/components/Header.jsx';
import MainPage from './src/pages/MainPage.jsx';
import Login from './src/pages/Login.jsx';
import Logup from './src/pages/Logup.jsx';
import { AuthProvider } from './src/context/AuthContext.jsx';
import CreditPolicyPage from './src/pages/CreditRatePage.jsx';  
import FinancialPage from './src/pages/FinancialPage.jsx'; 
import Mypage from './src/pages/Mypage.jsx';
import Footer from './src/components/Footer.jsx';
import SupportPolicy from './src/pages/SupportPolicy.jsx';
import ChatbotPage from './src/pages/ChatbotPage.jsx';
import MypageBefore from '@/components/Mypage/MypageBefore.jsx';
import MypageInit from './src/components/Mypage/MypageInit.jsx';
import Loading from '@/components/Loading.jsx';
import GoogleCallback from "./src/pages/GoogleCallback.jsx";
import KakaoCallback from "./src/pages/KakaoCallback.jsx";
import NotFound from '@/components/Notfound.jsx';
import InvestPage from '@/pages/InvestPage.jsx';

export {
  KakaoCallback,
  GoogleCallback,
  MypageBefore,
  Header,
  MainPage,
  Login,
  Logup,
  AuthProvider,
  CreditPolicyPage,
  InvestPage,
  FinancialPage,
  Mypage,
  Footer,
  SupportPolicy,
  ChatbotPage,
  MypageInit,
  Loading,
  NotFound
};