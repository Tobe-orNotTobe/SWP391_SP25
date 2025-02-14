
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import RegisterPage from "./pages/RegisterPage"
import {ForgotPasswordPage, ResetPasswordPage} from "./pages/ResetPasswordPage"
import {IntroductionPage, VisionPage, MissionPage, OurTeamPage} from "./pages/IntroductionPage"
import ChildRegistrationPage from "./pages/ChildRegistrationPage.tsx";
import ConfirmEmail from "./components/Auth/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccineListPage.tsx"


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

          <Route path="/vaccine-list" element={<VaccineListPage/>}/>

          <Route path="/about-us" element={<IntroductionPage/>}/>
          <Route path="/vision" element={<VisionPage/>}/>
          <Route path="/mission" element={<MissionPage/>}/>

          <Route path="/team" element={<OurTeamPage/>}/>

          <Route path="/confirm-email" element={<ConfirmEmail/>}></Route>
          <Route path="/reset-password" element={<ResetPasswordPage/>}></Route>

          {/*Lưu ý: Trang này phải đăng nhập mới sử dụng được*/}
          <Route path="/child-register" element={<ChildRegistrationPage/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
