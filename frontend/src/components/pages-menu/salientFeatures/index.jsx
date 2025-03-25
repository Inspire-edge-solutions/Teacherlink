import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FooterDefault from "../../footer/common-footer";

const SalientFeatures = () => {
    console.log("SalientFeatures component rendering");
    return (
      <>
        {/* <!-- Header Span --> */}
        <span className="header-span"></span>
  
        <LoginPopup />
        {/* End Login Popup Modal */}
  
        <DefaulHeader2 />
        {/* <!--End Main Header --> */}
  
        <MobileMenu />
        {/* End MobileMenu */}

        <section className="salient-features-section">
          <div className="auto-container">
              <div className="row mt-50">
                  <div className="col-lg-12 text-center">
                      <h1>Find Your Dream Job for Free with TeacherLink.in!</h1>
                      <p>TeacherLink.in is a job board for teachers. It is a platform that allows teachers to find jobs and apply for them.</p>
                      <h2>Our Services</h2>
                  </div>
                  <div className="services-container d-flex justify-content-center align-items-center text-center">
                    <div>
                    <img src="/public/icons/job-seeker.png" alt="Job Seeker" />
                    <h3>Job Search</h3>
                    <p>Use advanced filters to find jobs matching your skills, experience, and location.</p>
                    </div>
                    <div>
                    <img src="/public/icons/tracking.png" alt="Application Tracking" />
                    <h3>Application Tracking</h3>
                    <p>Keep track of your job applications and receive updates on their status.</p>
                    </div>
                    <div>
                    <img src="/public/icons/emergency.png" alt="Alerts" />
                    <h3>Alerts & Notifications</h3>
                    <p>Set up personalized job alerts to receive updates on new listings.</p>
                    </div>
                    <div>
                    <img src="/public/icons/information-2.png" alt="Assistant Service" />
                    <h3>Assistant Service</h3>
                    <p>Hire a dedicated assistant who will search, filter, apply, and schedule interviews for you.</p>
                    </div>
                  </div>
                  <div className="text-center"><strong>TeacherLink.in – </strong>Your Gateway to Career Success!</div>
              </div>
          </div>
        </section>

        <FooterDefault />
    </>
  );
};

export default SalientFeatures
