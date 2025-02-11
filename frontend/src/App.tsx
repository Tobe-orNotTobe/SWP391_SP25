
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPassword"
import {IntroductionPage, AboutUsPage, OurTeamPage} from "./pages/IntroductionPage"
import VerifiyOTPPage from "./pages/VerifyOTPPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"



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
          <Route path="/introduction" element={<IntroductionPage/>}/>
          <Route path="/about-us" element={<AboutUsPage/>}/>
          <Route path="/team" element={<OurTeamPage/>}/>
          <Route path="/verify-otp" element={<VerifiyOTPPage/>}></Route>
          <Route path="/reset-password" element={<ResetPasswordPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
