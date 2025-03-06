import "./App.scss";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import PageLoader from "./components/PageLoader/PageLoader.tsx";
import NotFound from "./components/NotFound/NotFound.tsx";

// Pages
import HomePage from "./pages/HomePage/HomePage.tsx";
import VaccineDetailPage from "./pages/VaccinePage/VaccineDetailPage/VaccineDetailPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail.tsx";
import VaccineListPage from "./pages/VaccinePage/VaccineListPage/VaccineListPage.tsx";
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx";
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import BeforeHandbook from "./pages/Handbook/BeforeHandbook.tsx";
import HandBookAfter from "./pages/Handbook/HandBookAfter.tsx";
import Login from "./pages/AuthPage/Login/Login.tsx";
import Register from "./pages/AuthPage/Register/Register.tsx";
import ForgotPassword from "./pages/AuthPage/ForgotPassword/ForgotPassword.tsx";
import ResetPassword from "./pages/AuthPage/ResetPassword/ResetPassword.tsx";

// Customer Pages
import ChildRegistrationPage from "./pages/ChildPage/ChildRegister/ChildRegistrationPage.tsx";
import MyChildsPage from "./pages/ChildPage/MyChilds/MyChildsPage.tsx";
import ChildDetailPage from "./pages/ChildPage/ChildDetail/ChildDetailPage.tsx";
import VaccinationRegistrationPage from "./pages/Customer/BookingPage.tsx";
import TransactionPage from "./pages/Customer/TransactionPage.tsx";
import VaccinationProcess from "./pages/Handbook/VaccinationProcess.tsx";

// Manager Pages
import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx";
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/VaccineList/ManagerVaccinePage.tsx";
import VaccineComboList from "./pages/Manager/ManagerComboVaccine/ComboVaccineList/VaccineComboList.tsx";
import VaccineComboForm from "./pages/Manager/ManagerComboVaccine/ComboVaccineForm/VaccineComboForm.tsx";
import ScheduleVaccinationList from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationList/SheduleVaccinationList.tsx";
import ScheduleVaccinationForm from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationForm/ScheduleVaccinationForm.tsx";
import VaccineFormPage from "./pages/Manager/ManagerVaccine/FormVaccine/VaccineFormPage.tsx";
import VaccineInventoryList from "./pages/Manager/ManagerVaccineInventory/VaccineInventoryList/VaccineInventoryList.tsx";
import VaccineInventoryForm from "./pages/Manager/ManagerVaccineInventory/VaccineInventoryForm/VaccineInventoryForm.tsx";

// Doctor and Staff Pages
import VaccinationSchedulePage from "./pages/Doctor/AssignedBooking.tsx";
import BookingForStaff from "./pages/Staff/BookingForStaff.tsx";
import AssignPage from "./pages/Staff/AssignPage.tsx";
import ServicePage from "./pages/Doctor/ServicePage.tsx";

// Admin Pages
import AdminDashboardPage from "./pages/Admin/AdminDashboard/AdminDashboard.tsx";
import AdminAccountPage from "./pages/Admin/AdminAccount/AdminAccountList/AdminAcount.tsx";
import AdminAccountFormPage from "./pages/Admin/AdminAccount/AdminAccountForm/AdminAccountForm.tsx";

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/introduction" element={<IntroductionPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/our-team" element={<OurTeamPage />} />
        <Route path="/vaccines-list" element={<VaccineListPage />} />
        <Route path="/vaccines-list/:id" element={<VaccineDetailPage />} />
        <Route path="/handbook/before" element={<BeforeHandbook />} />
        <Route path="/handbook/process" element={<VaccinationProcess />} />
        <Route path="/handbook/after" element={<HandBookAfter />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />

        {/* Customer Routes */}
        <Route path="/child-register" element={<ChildRegistrationPage />} />
        <Route path="/my-childs" element={<MyChildsPage />} />
        <Route path="/child-detail" element={<ChildDetailPage />} />
        <Route path="/booking" element={<VaccinationRegistrationPage />} />
        <Route path="/payment" element={<TransactionPage />} />
        
        {/* Doctor and Staff Routes */}
        <Route path="/doctor/service" element={<ServicePage />} />
        <Route
          path="/doctor/vaccination-schedule"
          element={<VaccinationSchedulePage />}
        />
        <Route path="/staff/booking" element={<BookingForStaff />} />
        <Route path="/staff/assignDoctor" element={<AssignPage />} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashBoard />} />
        <Route path="/manager/vaccines" element={<ManagerVaccinePage />} />
        <Route path="/manager/combo-vaccines" element={<VaccineComboList />} />
        <Route path="/manager/vaccines/add" element={<VaccineFormPage />} />
        <Route
          path="/manager/vaccines/edit/:id"
          element={<VaccineFormPage />}
        />
        <Route
          path="/manager/combo-vaccines/add"
          element={<VaccineComboForm />}
        />
        <Route
          path="/manager/combo-vaccines/edit/:id"
          element={<VaccineComboForm />}
        />
        <Route
          path="/manager/schedule-vaccines"
          element={<ScheduleVaccinationList />}
        />
        <Route
          path="/manager/schedule-vaccines/add"
          element={<ScheduleVaccinationForm />}
        />
        <Route
          path="/manager/schedule-vaccines/edit/:scheduleId"
          element={<ScheduleVaccinationForm />}
        />
        <Route
          path="/manager/inventory-vaccines"
          element={<VaccineInventoryList />}
        />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/accounts" element={<AdminAccountPage />} />
        <Route path="/admin/accounts/add" element={<AdminAccountFormPage />} />
        <Route
          path="/admin/accounts/edit/:id"
          element={<AdminAccountFormPage />}
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
