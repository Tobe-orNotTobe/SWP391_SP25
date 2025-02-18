
import "./App.scss"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage.tsx"
import LogInPage from "./pages/AuthPage/Login/LoginPage.tsx"
import RegisterPage from "./pages/AuthPage/Register/RegisterPage.tsx"
import ForgotPasswordPage from "./pages/AuthPage/ForgotPassword/ForgotPasswordPage.tsx"
import ResetPasswordPage from "./pages/AuthPage/ResetPassword/ResetPasswordPage.tsx"

import ChildRegistrationPage from "./pages/ChildRegistrationPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccineListPage/VaccineListPage.tsx"
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx"
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx"
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/ManagerVaccinePage.tsx"
import ManagerComboVaccine from "./pages/Manager/ManagerComboVaccine/ManagerComboVaccine.tsx";
import NotFound from "./components/NotFound/NotFound.tsx"

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

          {/*Lưu ý: Trang này phải đăng nhập và có role là Mananger mới sử dụng được*/}
          <Route path="/manager/dashboard" element={<ManagerDashBoard/>}/>
          <Route path="/manager/vaccine" element={<ManagerVaccinePage/>}/>
          <Route path="/manager/comboVaccine" element={<ManagerComboVaccine/>}/>

          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
