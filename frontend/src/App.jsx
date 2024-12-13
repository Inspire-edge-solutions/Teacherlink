
import Aos from "aos";
import "aos/dist/aos.css";
import "./styles/index.scss";
import { useEffect } from "react";
import ScrollToTop from "./components/common/ScrollTop";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

if (typeof window !== "undefined") {
  import("bootstrap");
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import HomePage1 from "./pages/home/home-1";
import HomePage2 from "./pages/home/home-2";
import HomePage3 from "./pages/home/home-3";
import HomePage4 from "./pages/home/home-4";
import HomePage5 from "./pages/home/home-5";
import HomePage6 from "./pages/home/home-6";
import HomePage7 from "./pages/home/home-7";
import HomePage8 from "./pages/home/home-8";
import HomePage9 from "./pages/home/home-9";
import HomePage10 from "./pages/home/home-10";
import HomePage11 from "./pages/home/home-11";
import HomePage12 from "./pages/home/home-12";
import HomePage13 from "./pages/home/home-13";
import HomePage14 from "./pages/home/home-14";
import HomePage15 from "./pages/home/home-15";
import HomePage16 from "./pages/home/home-16";
import HomePage17 from "./pages/home/home-17";
import JobListPage1 from "./pages/job-list/job-list-v1";
import JobListPage2 from "./pages/job-list/job-list-v2";
import JobListPage3 from "./pages/job-list/job-list-v3";
import JobListPage4 from "./pages/job-list/job-list-v4";
import JobListPage5 from "./pages/job-list/job-list-v5";
import JobListPage6 from "./pages/job-list/job-list-v6";
import JobListPage7 from "./pages/job-list/job-list-v7";
import JobListPage8 from "./pages/job-list/job-list-v8";
import JobListPage9 from "./pages/job-list/job-list-v9";
import JobListPage10 from "./pages/job-list/job-list-v10";
import JobListPage11 from "./pages/job-list/job-list-v11";
import JobListPage12 from "./pages/job-list/job-list-v12";
import JobListPage13 from "./pages/job-list/job-list-v13";
import JobListPage14 from "./pages/job-list/job-list-v14";
import JobSingleDynamicV1 from "./pages/job-single/job-single-v1";
import JobSingleDynamicV2 from "./pages/job-single/job-single-v2";
import JobSingleDynamicV3 from "./pages/job-single/job-single-v3";
import JobSingleDynamicV4 from "./pages/job-single/job-single-v4";
import JobSingleDynamicV5 from "./pages/job-single/job-single-v5";
import ScrollTopBehaviour from "./components/common/ScrollTopBehaviour";
import EmployerListPage1 from "./pages/employers-list/employers-list-v1";
import EmployerListPage2 from "./pages/employers-list/employers-list-v2";
import EmployerListPage3 from "./pages/employers-list/employers-list-v3";
import EmployerListPage4 from "./pages/employers-list/employers-list-v4";
import EmployersSingleV1 from "./pages/employers-single/employers-single-v1";
import EmployersSingleV2 from "./pages/employers-single/employers-single-v2";
import EmployersSingleV3 from "./pages/employers-single/employers-single-v3";
import CandidateListPage1 from "./pages/candidates-list/candidates-list-v1";
import CandidateListPage2 from "./pages/candidates-list/candidates-list-v2";
import CandidateListPage3 from "./pages/candidates-list/candidates-list-v3";
import CandidateListPage4 from "./pages/candidates-list/candidates-list-v4";
import CandidateListPage5 from "./pages/candidates-list/candidates-list-v5";
import CandidateSingleDynamicV1 from "./pages/candidates-single/candidates-single-v1";
import CandidateSingleDynamicV2 from "./pages/candidates-single/candidates-single-v2";
import CandidateSingleDynamicV3 from "./pages/candidates-single/candidates-single-v3";
import BlogListpage1 from "./pages/blog/blog-list-v1";
import BlogListpage2 from "./pages/blog/blog-list-v2";
import BlogListpage3 from "./pages/blog/blog-list-v3";
import BlogDetailsDynamic from "./pages/blog/blog-details";
import AboutPage from "./pages/others/about";
import PricingPage from "./pages/others/pricing";
import FaqPage from "./pages/others/faq";
import TermsPage from "./pages/others/terms";
import InvoicePage from "./pages/others/invoice";
import ContactPage from "./pages/others/contact";
import NotFoundPage from "./pages/others/404";
import DashboardEmploeeDBPage from "./pages/employers-dashboard/dashboard";
import CompanyProfileEmploeeDBPage from "./pages/employers-dashboard/company-profile";
import PostJobsEmploeeDBPage from "./pages/employers-dashboard/post-jobs";
import ManageJobsEmploeeDBPage from "./pages/employers-dashboard/manage-jobs";
import AllApplicantsEmploeesPage from "./pages/employers-dashboard/all-applicants";
import ShortListedResumeEmploeeDBPage from "./pages/employers-dashboard/shortlisted-resumes";
import PackageEmploeeDBPage from "./pages/employers-dashboard/packages";
import MessageEmploeeDBPage from "./pages/employers-dashboard/messages";
import ResumeAlertsEmploeeDBPage from "./pages/employers-dashboard/resume-alerts";
import ChangePasswordEmploeeDBPage from "./pages/employers-dashboard/change-password";
import DashboardPage from "./pages/candidates-dashboard/dashboard";
import AppliedJobsPage from "./pages/candidates-dashboard/applied-jobs";
import ChangePasswordPage from "./pages/candidates-dashboard/change-password";
import CVMannagerPage from "./pages/candidates-dashboard/cv-manager";
import JobAlertPage from "./pages/candidates-dashboard/job-alerts";
import MessageesPage from "./pages/candidates-dashboard/messages";
import MyProfilePage from "./pages/candidates-dashboard/my-profile";
import MyResumePage from "./pages/candidates-dashboard/my-resume";
import PackagePage from "./pages/candidates-dashboard/packages";
import ShortListedJobsPage from "./pages/candidates-dashboard/short-listed-jobs";
import LoginPage from "./pages/others/login";
import RegisterPage from "./pages/others/register";
import ShopListPage from "./pages/shop/shop-list";
import ShopSingleDyanmic from "./pages/shop/shop-single";
import CartPage from "./pages/shop/cart";
import CheckoutPage from "./pages/shop/checkout";
import OrderCompletedPage from "./pages/shop/order-completed";
function App() {
  useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);


  return (
    <>
    <Provider store={store}>
          <div className="page-wrapper">
            <BrowserRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="home-1" element={<HomePage1 />} />
                  <Route path="home-2" element={<HomePage2 />} />
                  <Route path="home-3" element={<HomePage3 />} />
                  <Route path="home-4" element={<HomePage4 />} />
                  <Route path="home-5" element={<HomePage5 />} />
                  <Route path="home-6" element={<HomePage6 />} />
                  <Route path="home-7" element={<HomePage7 />} />
                  <Route path="home-8" element={<HomePage8 />} />
                  <Route path="home-9" element={<HomePage9 />} />
                  <Route path="home-10" element={<HomePage10 />} />
                  <Route path="home-11" element={<HomePage11 />} />
                  <Route path="home-12" element={<HomePage12 />} />
                  <Route path="home-13" element={<HomePage13 />} />
                  <Route path="home-14" element={<HomePage14 />} />
                  <Route path="home-15" element={<HomePage15 />} />
                  <Route path="home-16" element={<HomePage16 />} />
                  <Route path="home-17" element={<HomePage17 />} />

                  <Route path="job-list-v1" element={<JobListPage1 />} />
                  <Route path="job-list-v2" element={<JobListPage2 />} />
                  <Route path="job-list-v3" element={<JobListPage3 />} />
                  <Route path="job-list-v4" element={<JobListPage4 />} />
                  <Route path="job-list-v5" element={<JobListPage5 />} />
                  <Route path="job-list-v6" element={<JobListPage6 />} />
                  <Route path="job-list-v7" element={<JobListPage7 />} />
                  <Route path="job-list-v8" element={<JobListPage8 />} />
                  <Route path="job-list-v9" element={<JobListPage9 />} />
                  <Route path="job-list-v10" element={<JobListPage10 />} />
                  <Route path="job-list-v11" element={<JobListPage11 />} />
                  <Route path="job-list-v12" element={<JobListPage12 />} />
                  <Route path="job-list-v13" element={<JobListPage13 />} />
                  <Route path="job-list-v14" element={<JobListPage14 />} />
                  <Route path="job-single-v1/:id" element={<JobSingleDynamicV1 />} />
                  <Route path="job-single-v2/:id" element={<JobSingleDynamicV2 />} />
                  <Route path="job-single-v3/:id" element={<JobSingleDynamicV3 />} />
                  <Route path="job-single-v4/:id" element={<JobSingleDynamicV4 />} />
                  <Route path="job-single-v5/:id" element={<JobSingleDynamicV5 />} />

                  <Route path="employers-list-v1" element={<EmployerListPage1 />} />
                  <Route path="employers-list-v2" element={<EmployerListPage2 />} />
                  <Route path="employers-list-v3" element={<EmployerListPage3 />} />
                  <Route path="employers-list-v4" element={<EmployerListPage4 />} />

                  <Route path="employers-single-v1/:id" element={<EmployersSingleV1 />} />
                  <Route path="employers-single-v2/:id" element={<EmployersSingleV2 />} />
                  <Route path="employers-single-v3/:id" element={<EmployersSingleV3 />} />

                  <Route path="candidates-list-v1" element={<CandidateListPage1 />} />
                  <Route path="candidates-list-v2" element={<CandidateListPage2 />} />
                  <Route path="candidates-list-v3" element={<CandidateListPage3 />} />
                  <Route path="candidates-list-v4" element={<CandidateListPage4 />} />
                  <Route path="candidates-list-v5" element={<CandidateListPage5 />} />

                  <Route path="candidates-single-v1/:id" element={<CandidateSingleDynamicV1 />} />
                  <Route path="candidates-single-v2/:id" element={<CandidateSingleDynamicV2 />} />
                  <Route path="candidates-single-v3/:id" element={<CandidateSingleDynamicV3 />} />

                  <Route path="blog-list-v1" element={<BlogListpage1 />} />
                  <Route path="blog-list-v2" element={<BlogListpage2 />} />
                  <Route path="blog-list-v3" element={<BlogListpage3 />} />
                  <Route path="blog-details/:id" element={<BlogDetailsDynamic />} />

                  <Route path="about" element={<AboutPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="faq" element={<FaqPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="invoice" element={<InvoicePage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="404" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />

                  <Route path="employers-dashboard" >
                    <Route path="dashboard" element={<DashboardEmploeeDBPage/>} />
                    <Route path="company-profile" element={<CompanyProfileEmploeeDBPage/>} />
                    <Route path="post-jobs" element={<PostJobsEmploeeDBPage/>} />
                    <Route path="manage-jobs" element={<ManageJobsEmploeeDBPage/>} />
                    <Route path="all-applicants" element={<AllApplicantsEmploeesPage/>} />
                    <Route path="shortlisted-resumes" element={<ShortListedResumeEmploeeDBPage/>} />
                    <Route path="packages" element={<PackageEmploeeDBPage/>} />
                    <Route path="messages" element={<MessageEmploeeDBPage/>} />
                    <Route path="resume-alerts" element={<ResumeAlertsEmploeeDBPage/>} />
                    <Route path="change-password" element={<ChangePasswordEmploeeDBPage/>} />
            
                    
                  </Route>
                 
                  <Route path="candidates-dashboard" >
                    <Route path="dashboard" element={<DashboardPage/>} />
                    <Route path="applied-jobs" element={<AppliedJobsPage/>} />
                    <Route path="change-password" element={<ChangePasswordPage/>} />
                    <Route path="cv-manager" element={<CVMannagerPage/>} />
                    <Route path="job-alerts" element={<JobAlertPage/>} />
                    <Route path="messages" element={<MessageesPage/>} />
                    <Route path="my-profile" element={<MyProfilePage/>} />
                    <Route path="my-resume" element={<MyResumePage/>} />
                    <Route path="packages" element={<PackagePage/>} />
                    <Route path="short-listed-jobs" element={<ShortListedJobsPage/>} />

                  </Route>

                  <Route path="shop" >

                    <Route path="shop-list" element={<ShopListPage/>} />
                    <Route path="shop-single/:id" element={<ShopSingleDyanmic/>} />
                    <Route path="cart" element={<CartPage/>} />
                    <Route path="checkout" element={<CheckoutPage/>} />
                    <Route path="order-completed" element={<OrderCompletedPage/>} />
                  </Route>

                </Route>
              </Routes>
              <ScrollTopBehaviour/>
            </BrowserRouter>

           

            {/* Toastify */}
            <ToastContainer
              position="bottom-right"
              autoClose={500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            {/* <!-- Scroll To Top --> */}
            <ScrollToTop />
          </div>
        </Provider>
     
    </>
  )
}

export default App
