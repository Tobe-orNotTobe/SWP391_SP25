import "./App.scss";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import {NoAuthRoute, ProtectedRoute, PublicRoute} from "./routes/routes.tsx";
import PageLoader from "./components/PageLoader/PageLoader.tsx";
import NotFound from "./components/NotFound/NotFound.tsx";

// Pages
import HomePage from "./pages/HomePage/HomePage.tsx";
import IntroductionPage from "./pages/Introduction/IntroductionPage.tsx";
import MissionPage from "./pages/Introduction/MissionPage.tsx";
import VisionPage from "./pages/Introduction/VisionPage.tsx";
import OurTeamPage from "./pages/Introduction/OurTeamPage.tsx";
import VaccineListPage from "./pages/VaccinePage/VaccineListPage/VaccineListPage.tsx";
import VaccineDetailPage from "./pages/VaccinePage/VaccineDetailPage/VaccineDetailPage.tsx";
import BeforeHandbook from "./pages/Handbook/BeforeHandbook.tsx";
import VaccinationProcess from "./pages/Handbook/VaccinationProcess.tsx";
import HandBookAfter from "./pages/Handbook/HandBookAfter.tsx";
import BlogPage from "./pages/Blog/BlogPage.tsx";
import BlogDetailPage from "./pages/Blog/BlogDetailPage.tsx";

// Auth Pages
import Login from "./pages/AuthPage/Login/Login.tsx";
import Register from "./pages/AuthPage/Register/Register.tsx";
import ForgotPassword from "./pages/AuthPage/ForgotPassword/ForgotPassword.tsx";
import ResetPassword from "./pages/AuthPage/ResetPassword/ResetPassword.tsx";
import {ConfirmEmail, DepositSuccess, PaymentSuccess} from "./components/Confirm/Confirm.tsx";

// Customer Pages
import ChildRegistrationPage from "./pages/ChildPage/ChildRegister/ChildRegistrationPage.tsx";
import MyChildsPage from "./pages/ChildPage/MyChilds/MyChildsPage.tsx";
import ChildDetailPage from "./pages/ChildPage/ChildDetail/ChildDetailPage.tsx";
import VaccinationRegistrationPage from "./pages/Customer/BookingPage.tsx";
import TransactionPage from "./pages/Customer/TransactionPage.tsx";
import ServicePage from "./pages/Doctor/ServicePage.tsx";
import NotificationPage from "./pages/Customer/Notification/Notification.tsx";

// Manager Pages
import ManagerDashBoard from "./pages/Manager/ManagerDashboard/ManagerDashBoard.tsx";
import ManagerVaccinePage from "./pages/Manager/ManagerVaccine/VaccineList/ManagerVaccinePage.tsx";
import VaccineFormPage from "./pages/Manager/ManagerVaccine/FormVaccine/VaccineFormPage.tsx";
import VaccineComboList from "./pages/Manager/ManagerComboVaccine/ComboVaccineList/VaccineComboList.tsx";
import VaccineComboForm from "./pages/Manager/ManagerComboVaccine/ComboVaccineForm/VaccineComboForm.tsx";
import ScheduleVaccinationList from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationList/SheduleVaccinationList.tsx";
import ScheduleVaccinationForm from "./pages/Manager/ManagerScheduleVaccination/ScheduleVaccinationForm/ScheduleVaccinationForm.tsx";
import VaccineInventoryList from "./pages/Manager/ManagerVaccineInventory/VaccineInventoryList/VaccineInventoryList.tsx";
import VaccineInventoryForm from "./pages/Manager/ManagerVaccineInventory/VaccineInventoryForm/VaccineInventoryForm.tsx";

// Admin Pages
import AdminDashboardPage from "./pages/Admin/AdminDashboard/AdminDashboard.tsx";
import AdminAccountPage from "./pages/Admin/AdminAccount/AdminAccountList/AdminAcount.tsx";
import AdminAccountFormPage from "./pages/Admin/AdminAccount/AdminAccountForm/AdminAccountForm.tsx";
import AdminBlogFormPage from "./pages/Admin/AdminBlog/AdminBlogForm/AdminBogForm.tsx"


import CustomerProfile from "./pages/Customer/CustomerProfile/CustomerProfile.tsx";
import VaccinationSchedulePage from "./pages/Doctor/AssignedBooking.tsx";
import AdminProfile from "./pages/Admin/AdminProfile/AdminProfile.tsx";
import ManagerProfile from "./pages/Manager/ManagerProfile/ManagerProfile.tsx";
import BookingHistoryPage from "./pages/Customer/BookingHistory/BookingHistoryPage.tsx";
import AssignPage from "./pages/Staff/AssignPage.tsx";
import VaccinePackagePage from "./pages/VaccinePage/VaccinePackagePage/VaccinePackagePage.tsx";
import AdminBlogManagePage from "./pages/Admin/AdminBlog/AdminBlogList/AdminBlogManage/AdminBlogManage.tsx";
import AdminBlogDeactivePage from "./pages/Admin/AdminBlog/AdminBlogList/AdminBlogDeactive/AdminBlogDeactive.tsx";
import AdminFeedbackListPage from "./pages/Admin/AdminFeedback/AdminFeedbackList/AdminFeedbackList.tsx";
import CustomerWallet from "./pages/Customer/CustomerWallet/CustomerWallet.tsx";
import BookingForStaff from "./pages/Staff/BookingForStaff.tsx";

import NewsPage from "./pages/News/NewsPage.tsx";
import NewsDetailPage from "./pages/News/NewsDetailPage.tsx";
import Failure from "./components/Failure/Failure.tsx";

import DoctorBlogPostPage from "./pages/Doctor/DoctorBlogPost.tsx";
import DoctorBlogManagePage from "./pages/Doctor/Blog/DoctorBlogManage/DoctorBlogManage.tsx";
import AdminBookingPage from "./pages/Admin/AdminBooking/AdminBookingList/AdminBookingList.tsx";
import AdminRefund from "./pages/Admin/AdminRefund/AdminRefund.tsx";

import StaffBlogPostPage from "./pages/Staff/StaffBlogPost.tsx";
import StaffBlogManagePage from "./pages/Staff/Blog/StaffBlogManage/StaffBlogManage.tsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile/DoctorProfile.tsx";


function App() {
    return (
        <BrowserRouter>
            <PageLoader />
            <Routes>
                <Route path="/payment" element={<TransactionPage />} />
                <Route path="/payment/:bookingId" element={<TransactionPage/>} />
                <Route path="/payment-success" element={<PaymentSuccess />}/>
                <Route path="/wallet/deposit-success" element={<DepositSuccess/>}/>
                <Route path="/wallet/deposit-failure" element={<Failure/>}/>

                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><HomePage/></PublicRoute>}/>
                <Route path="/homepage" element={<PublicRoute><HomePage/></PublicRoute>} />
                <Route path="/introduction" element={<PublicRoute><IntroductionPage/></PublicRoute>} />
                <Route path="/mission" element={<PublicRoute><MissionPage /></PublicRoute>} />
                <Route path="/vision" element={<PublicRoute><VisionPage /></PublicRoute>} />
                <Route path="/our-team" element={<PublicRoute><OurTeamPage /></PublicRoute>} />
                <Route path="/vaccines-list" element={<PublicRoute><VaccineListPage /></PublicRoute>} />
                <Route path="/vaccines-list/:id" element={<PublicRoute><VaccineDetailPage /></PublicRoute>} />
                <Route path="/handbook/before" element={<PublicRoute><BeforeHandbook /></PublicRoute>} />
                <Route path="/handbook/process" element={<PublicRoute><VaccinationProcess /></PublicRoute>} />
                <Route path="/handbook/after" element={<PublicRoute><HandBookAfter /></PublicRoute>} />
                <Route path="/vaccine-packages" element={<PublicRoute><VaccinePackagePage/></PublicRoute>} />
                <Route path="/blog" element={<PublicRoute><BlogPage/></PublicRoute>} />
                <Route path="/news" element={<PublicRoute><NewsPage/></PublicRoute>} />
                <Route path="/news/:id" element={<PublicRoute><NewsDetailPage/></PublicRoute>} />
                <Route path="/blog/:id" element={<PublicRoute><BlogDetailPage/></PublicRoute>} />

                {/* Authentication Routes */}
                <Route path="/login" element={<NoAuthRoute><Login/></NoAuthRoute>} />
                <Route path="/register" element={<NoAuthRoute><Register /></NoAuthRoute>} />
                <Route path="/forgot-password" element={<NoAuthRoute><ForgotPassword /></NoAuthRoute>} />
                <Route path="/reset-password" element={<NoAuthRoute><ResetPassword /></NoAuthRoute>} />
                <Route path="/confirm-email" element={<NoAuthRoute><ConfirmEmail /></NoAuthRoute>} />

                {/* Customer Routes */}
                <Route path="/child-register" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><ChildRegistrationPage /></ProtectedRoute>} />
                <Route path="/my-childs" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><MyChildsPage /></ProtectedRoute>} />
                <Route path="/child-detail" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><ChildDetailPage /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><VaccinationRegistrationPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><TransactionPage /></ProtectedRoute>} />
                <Route path="/user-profile" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><CustomerProfile /></ProtectedRoute>} />
                <Route path="/booking-history" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><BookingHistoryPage /></ProtectedRoute>} />
                <Route path="/customer/wallet" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><CustomerWallet /></ProtectedRoute>} />
                <Route path="/user-profile" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><CustomerProfile /></ProtectedRoute>} />
                <Route path="/booking-history" element={<ProtectedRoute allowedRoles={["Customer", "Admin"]}><BookingHistoryPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute allowedRoles={["Customer"]}><NotificationPage/></ProtectedRoute>} />

                {/* Staff Routes */}
                <Route path="/staff/service" element={<ProtectedRoute allowedRoles={["Staff"]}><ServicePage /></ProtectedRoute>} />
                <Route path="/staff/assignDoctor" element={<ProtectedRoute allowedRoles={["Staff"]}><AssignPage /></ProtectedRoute>} />
                <Route path="/staff/booking" element={<ProtectedRoute allowedRoles={["Staff"]}><BookingForStaff /></ProtectedRoute>} />
                <Route path="/staff/blogPost" element={<ProtectedRoute allowedRoles={["Staff"]}><StaffBlogPostPage /></ProtectedRoute>} />
                <Route path="/staff/blogManager" element={<ProtectedRoute allowedRoles={["Staff"]}><StaffBlogManagePage /></ProtectedRoute>} />
                <Route path="/staff/blog/edit/:id" element={<ProtectedRoute allowedRoles={["Staff"]}><StaffBlogPostPage /></ProtectedRoute>} />
                {/* Doctor Routes */}
                <Route path="/doctor/vaccination-schedule" element={<ProtectedRoute allowedRoles={["Doctor"]}><VaccinationSchedulePage /></ProtectedRoute>} />
                <Route path="/doctor/service" element={<ProtectedRoute allowedRoles={["Doctor"]}><ServicePage /></ProtectedRoute>} />
                <Route path="/doctor/blogPost" element={<ProtectedRoute allowedRoles={["Doctor"]}><DoctorBlogPostPage /></ProtectedRoute>} />
                <Route path="/doctor/blogManager" element={<ProtectedRoute allowedRoles={["Doctor"]}><DoctorBlogManagePage /></ProtectedRoute>} />
                <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["Doctor"]}><DoctorProfile /></ProtectedRoute>}/>
                <Route path="/doctor/blog/edit/:id" element={<ProtectedRoute allowedRoles={["Doctor"]}><DoctorBlogPostPage /></ProtectedRoute>} />
                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={["Manager"]}><ManagerDashBoard /></ProtectedRoute>} />
                <Route path="/manager/vaccines" element={<ProtectedRoute allowedRoles={["Manager"]}><ManagerVaccinePage /></ProtectedRoute>} />
                <Route path="/manager/vaccines/add" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineFormPage /></ProtectedRoute>} />
                <Route path="/manager/vaccines/edit/:id" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineFormPage /></ProtectedRoute>} />
                <Route path="/manager/combo-vaccines" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineComboList /></ProtectedRoute>} />
                <Route path="/manager/combo-vaccines/add" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineComboForm /></ProtectedRoute>} />
                <Route path="/manager/combo-vaccines/edit/:id" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineComboForm /></ProtectedRoute>} />
                <Route path="/manager/schedule-vaccines" element={<ProtectedRoute allowedRoles={["Manager"]}><ScheduleVaccinationList /></ProtectedRoute>} />
                <Route path="/manager/schedule-vaccines/add" element={<ProtectedRoute allowedRoles={["Manager"]}><ScheduleVaccinationForm /></ProtectedRoute>} />
                <Route path="/manager/schedule-vaccines/edit/:scheduleId" element={<ProtectedRoute allowedRoles={["Manager"]}><ScheduleVaccinationForm /></ProtectedRoute>} />
                <Route path="/manager/inventory-vaccines" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineInventoryList /></ProtectedRoute>} />
                <Route path="/manager/inventory-vaccines/add" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineInventoryForm /></ProtectedRoute>} />
                <Route path="/manager/inventory-vaccines/edit/:id" element={<ProtectedRoute allowedRoles={["Manager"]}><VaccineInventoryForm /></ProtectedRoute>} />
                <Route path="/manager/profile" element={<ProtectedRoute allowedRoles={["Manager"]}><ManagerProfile /></ProtectedRoute>} />


                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/account" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAccountPage /></ProtectedRoute>} />
                <Route path="/admin/account/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAccountFormPage /></ProtectedRoute>} />
                <Route path="/admin/account/edit/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAccountFormPage /></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminProfile /></ProtectedRoute>} />
                <Route path="/admin/blog" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminBlogManagePage /></ProtectedRoute>} />
                <Route path="/admin/blog/deactive" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminBlogDeactivePage /></ProtectedRoute>} />
                <Route path="/admin/blog/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminBlogFormPage /></ProtectedRoute>} />
                <Route path="/admin/blog/edit/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminBlogFormPage /></ProtectedRoute>} />
                <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminFeedbackListPage /></ProtectedRoute>} />
                <Route path="/admin/booking" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminBookingPage/></ProtectedRoute>} />
                <Route path="/admin/wallet"element={<ProtectedRoute allowedRoles={["Admin"]}><AdminRefund/></ProtectedRoute>}/>



                {/* Trang 404 */}
                <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
