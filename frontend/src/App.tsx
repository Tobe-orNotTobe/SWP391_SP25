import "./App.scss";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import LogInPage from "./pages/AuthPage/Login/LoginPage.tsx";
import RegisterPage from "./pages/AuthPage/Register/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPassword/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/AuthPage/ResetPassword/ResetPasswordPage.tsx";

import ChildRegistrationPage from "./pages/ChildRegistrationPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccineListPage/VaccineListPage.tsx";
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx";
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import ChildRegistrationPage from "./pages/ChildRegistration/ChildRegistrationPage.tsx";

import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx";
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/ManagerVaccinePage.tsx";
import ManagerComboVaccine from "./pages/Manager/ManagerComboVaccine/ManagerComboVaccine.tsx";
import VaccineFormPage from "./pages/Manager/ManagerVaccine/VaccineFormPage.tsx";

import NotFound from "./components/NotFound/NotFound.tsx";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/child-registration" element={<ChildRegistrationPage />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/vaccines" element={<VaccineListPage />} />

        <Route path="/introduction" element={<IntroductionPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/our-team" element={<OurTeamPage />} />

        {/* Các trang dành cho manager */}
        <Route path="/manager/dashboard" element={<ManagerDashBoard />} />
        <Route path="/manager/vaccines" element={<ManagerVaccinePage />} />
        <Route path="/manager/vaccine-combos" element={<ManagerComboVaccine />} />

          {/*Lưu ý: Trang này phải đăng nhập mới sử dụng được*/}
          <Route path="/child-register" element={<ChildRegistrationPage/>}/>

        {/* Trang 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
