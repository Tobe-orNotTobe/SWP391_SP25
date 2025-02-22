
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"
<<<<<<< HEAD
import ForgotPasswordPage from "./pages/ForgotPassword"
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx"
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import ChildRegistrationPage from "./pages/ChildRegistration/ChildRegistrationPage.tsx";
import ChildHistoryPage from "./pages/ChildHistory/ChildHistoryPage.tsx";
=======
import {ForgotPasswordPage, VerifiyOTPPage, ResetPasswordPage} from "./pages/ResetPasswordPage"
import {IntroductionPage, VisionPage, MissionPage, OurTeamPage} from "./pages/IntroductionPage"
import ChildRegistrationPage from "./pages/ChildRegistrationPage.tsx";
import ConfirmEmail from "./components/Auth/ConfirmEmail.tsx";
>>>>>>> main


function App() {


  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/login" element={<LogInPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

          <Route path="/about-us" element={<IntroductionPage/>}/>
          <Route path="/vision" element={<VisionPage/>}/>
          <Route path="/mission" element={<MissionPage/>}/>

          <Route path="/team" element={<OurTeamPage/>}/>
          <Route path="/verify-otp" element={<VerifiyOTPPage/>}></Route>
          <Route path="/confirm-email" element={<ConfirmEmail/>}></Route>
          <Route path="/reset-password" element={<ResetPasswordPage/>}></Route>

          {/*Lưu ý: Trang này phải đăng nhập mới sử dụng được*/}
          <Route path="/child-register" element={<ChildRegistrationPage/>}/>
          <Route path={"/child-history"} element={<ChildHistoryPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
