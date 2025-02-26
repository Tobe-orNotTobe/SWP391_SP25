import "./App.scss";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import LogInPage from "./pages/AuthPage/Login/LoginPage.tsx";
import RegisterPage from "./pages/AuthPage/Register/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPassword/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/AuthPage/ResetPassword/ResetPasswordPage.tsx";
import VaccineDetailPage from "./pages/VaccinePage/VaccineDetailPage/VaccineDetailPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccinePage/VaccineListPage/VaccineListPage.tsx";
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx";
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import ChildRegistrationPage from "./pages/ChildRegistration/ChildRegistrationPage.tsx";
import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx";
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/VaccineList/ManagerVaccinePage.tsx";

import VaccineFormPage from "./pages/Manager/ManagerVaccine/FormVaccine/VaccineFormPage.tsx";

import NotFound from "./components/NotFound/NotFound.tsx";

import VaccineComboList from "./pages/Manager/ManagerComboVaccine/ComboVaccineList/VaccineComboList.tsx";
import VaccineComboForm from "./pages/Manager/ManagerComboVaccine/ComboVaccineForm/VaccineComboForm.tsx";
import ScheduleVaccinationList from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationList/SheduleVaccinationList.tsx";
import ScheduleVaccinationForm
  from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationForm/ScheduleVaccinationForm.tsx";

function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        {/*Các trang này thì người dùng có thể xem thoải mái nhưng khi đăng nhập các role như staff, manager sẽ khong xem được kiểu vậy*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/introduction" element={<IntroductionPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/our-team" element={<OurTeamPage />} />
        <Route path="/vaccines-list" element={<VaccineListPage />} />
        <Route path="/vaccines-list/:id" element={<VaccineDetailPage/>}/>



        {/*Lưu ý: Các trang này là phục vụ việc authencation thôi chứ cũng không có gì*/}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
      
        

        {/*Lưu ý: Trang này phải đăng nhập và có role là Customer mới sử dụng được*/}
        <Route path="/child-register" element={<ChildRegistrationPage/>}/>

        
        
        {/*Lưu ý: Trang này phải đăng nhập và có role là manager mới sử dụng được*/}
        <Route path="/manager/dashboard" element={<ManagerDashBoard />} />
        <Route path="/manager/vaccines" element={<ManagerVaccinePage />} />
        <Route path="/manager/combo-vaccines" element={<VaccineComboList/>}/>
        <Route path="/manager/vaccines/add" element={<VaccineFormPage />} />
        <Route path="/manager/vaccines/edit/:id" element={<VaccineFormPage />} />
        <Route path="/manager/combo-vaccines/add" element={<VaccineComboForm/>}/>
        <Route path="/manager/combo-vaccines/edit/:id" element={<VaccineComboForm/>}/>
        <Route path="/manager/schedule-vaccines" element={< ScheduleVaccinationList/>}/>
        <Route path="/manager/schedule-vaccines/add" element={<ScheduleVaccinationForm/>}/>
        <Route path="/manager/schedule-vaccines/edit/:scheduleId" element={<ScheduleVaccinationForm/>}/>
        
       

        {/* Trang 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
