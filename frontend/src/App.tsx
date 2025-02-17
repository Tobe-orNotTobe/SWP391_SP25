
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPassword"
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx"
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import ChildRegistrationPage from "./pages/ChildRegistration/ChildRegistrationPage.tsx";


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

          {/*Lưu ý: Trang này phải đăng nhập mới sử dụng được*/}
          <Route path="/child-register" element={<ChildRegistrationPage/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
