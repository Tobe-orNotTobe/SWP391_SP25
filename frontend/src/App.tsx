import "./App.scss";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";

import VaccineDetailPage from "./pages/VaccinePage/VaccineDetailPage/VaccineDetailPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccinePage/VaccineListPage/VaccineListPage.tsx";
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx";
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";

import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx";
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/VaccineList/ManagerVaccinePage.tsx";
import Login from "./pages/AuthPage/Login/Login.tsx";
import Register from "./pages/AuthPage/Register/Register.tsx";
import ForgotPassword from "./pages/AuthPage/ForgotPassword/ForgotPassword.tsx";
import ResetPassword from "./pages/AuthPage/ResetPassword/ResetPassword.tsx";
import NotFound from "./components/NotFound/NotFound.tsx";

import MyChildsPage from "./pages/ChildPage/MyChilds/MyChildsPage.tsx";
// import ChildDetailPage from "./pages/ChildPage/ChildDetail/ChildDetailPage.tsx";

import ChildRegistrationPage from "./pages/ChildPage/ChildRegister/ChildRegistrationPage.tsx";
import VaccineComboList from "./pages/Manager/ManagerComboVaccine/ComboVaccineList/VaccineComboList.tsx";
import VaccineComboForm from "./pages/Manager/ManagerComboVaccine/ComboVaccineForm/VaccineComboForm.tsx";
import ScheduleVaccinationList from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationList/SheduleVaccinationList.tsx";
import BeforeHandbook from "./pages/Handbook/BeforeHandbook.tsx";
import ScheduleVaccinationForm from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationForm/ScheduleVaccinationForm.tsx";
import VaccinationRegistrationPage from "./pages/Customer/BookingPage.tsx";
// import ServicePage from "./pages/Staff/ServicePage.tsx";
import VaccineFormPage from "./pages/Manager/ManagerVaccine/FormVaccine/VaccineFormPage.tsx";

import AdminAccountPage from "./pages/Admin/AdminAccount/AdminAccountList/AdminAcount.tsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboard/AdminDashboard.tsx";
import AdminAccountFormPage from "./pages/Admin/AdminAccount/AdminAccountForm/AdminAccountForm.tsx";
import VaccinationProcess from "./pages/Handbook/VaccinationProcess.tsx";
import HandBookAfter from "./pages/Handbook/HandBookAfter.tsx";
import TransactionPage from "./pages/Customer/TransactionPage.tsx";
import VaccineInventoryList from "./pages/Manager/ManagerVaccineInventory/VaccineInventoryList.tsx";
import FeedbackPage from "./pages/Customer/FeedbackPage.tsx"
import AdminBlogPage from "./pages/Admin/AdminBlog/AdminBlogList/AdminBlog.tsx";
import AdminBlogFormPage from "./pages/Admin/AdminBlog/AdminBlogForm/AdminBogForm.tsx";

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
        <Route path="/handbook/before" element={<BeforeHandbook/>}/>
        <Route path="/handbook/process" element={<VaccinationProcess/>}/>
        <Route path="/handbook/after" element={<HandBookAfter/>}/>
        <Route path={"/feedback"} element={<FeedbackPage/>}/>


        {/*Lưu ý: Các trang này là phục vụ việc authencation thôi chứ cũng không có gì*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />



        {/*Lưu ý: Trang này phải đăng nhập và có role là Customer mới sử dụng được*/}
        <Route path="/child-register" element={<ChildRegistrationPage/>}/>
        <Route path={"/my-childs"} element={<MyChildsPage/>}/>
        {/*<Route path={"/child-detail"} element={<ChildDetailPage/>}/>*/}
        <Route path="/booking" element={<VaccinationRegistrationPage/>}></Route>
        {/*<Route path="/staff/service" element={<ServicePage/>}></Route>*/}

        <Route path="/child-register" element={<ChildRegistrationPage />} />

        <Route path="/booking" element={<VaccinationRegistrationPage />}></Route>
        <Route path="/payment" element={<TransactionPage />}></Route>
        {/*<Route path="/staff/service" element={<ServicePage />}></Route>*/}

        {/*<Route path="/staff/service" element={<ServicePage/>}></Route>*/}


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
        <Route path="/manager/inventory-vaccines" element={<VaccineInventoryList/>}/>

       
        <Route path="/manager/inventory-vaccines" element={<VaccineInventoryList/>}/>

        <Route path={"/admin/dashboard"} element={<AdminDashboardPage/>}/>
        <Route path={"/admin/account"} element={<AdminAccountPage/>}/>
        <Route path={"/admin/account/add"} element={<AdminAccountFormPage/>}/>
        <Route path={"/admin/account/edit/:id"} element={<AdminAccountFormPage/>}/>
        <Route path={"/admin/blog"} element={<AdminBlogPage/>}/>
        <Route path={"/admin/blog/add"} element={<AdminBlogFormPage/>}/>
        <Route path={"/admin/blog/edit/:id"} element={<AdminBlogFormPage/>}/>


        {/* Trang 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
