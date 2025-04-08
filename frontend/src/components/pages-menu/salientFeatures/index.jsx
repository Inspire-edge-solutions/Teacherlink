import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FooterDefault from "../../footer/common-footer";

const SalientFeatures = () => {
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

        <section className="salient-features-section py-5">
          <div className="auto-container">
              <div className="row mt-2 mt-md-5">
                  <div className="col-lg-12 text-center mb-2">
                      <h1 className="fs-2 fs-md-1 mb-3">Find Your Dream Job for Free with TeacherLink.in!</h1>
                      <p className="mb-4">TeacherLink.in is a job board for teachers. It is a platform that allows teachers to find jobs and apply for them.</p>
                      <h3 className="mb-2">Our Services</h3>
                  </div>
                  <div className="services-container row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 justify-content-center">
                    <div className="col service-item p-3">
                      <div className="d-flex flex-column align-items-center">
                        <img src="/Icons/job-seeker.png" alt="Job Seeker" className="mb-3" style={{maxWidth: '80px', height: 'auto'}} />
                        <h3 className="h5 mb-2">Job Search</h3>
                        <p className="mb-0">Use advanced filters to find jobs matching your skills, experience, and location.</p>
                      </div>
                    </div>
                    <div className="col service-item p-3">
                      <div className="d-flex flex-column align-items-center">
                        <img src="/Icons/tracking.png" alt="Application Tracking" className="mb-3" style={{maxWidth: '80px', height: 'auto'}} />
                        <h3 className="h5 mb-2">Application Tracking</h3>
                        <p className="mb-0">Keep track of your job applications and receive updates on their status.</p>
                      </div>
                    </div>
                    <div className="col service-item p-3">
                      <div className="d-flex flex-column align-items-center">
                        <img src="/Icons/emergency.png" alt="Alerts" className="mb-3" style={{maxWidth: '80px', height: 'auto'}} />
                        <h3 className="h5 mb-2">Alerts & Notifications</h3>
                        <p className="mb-0">Set up personalized job alerts to receive updates on new listings.</p>
                      </div>
                    </div>
                    <div className="col service-item p-3">
                      <div className="d-flex flex-column align-items-center">
                        <img src="/Icons/information-2.png" alt="Assistant Service" className="mb-3" style={{maxWidth: '80px', height: 'auto'}} />
                        <h3 className="h5 mb-2">Assistant Service</h3>
                        <p className="mb-0">Hire a dedicated assistant who will search, filter, apply, and schedule interviews for you.</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4"><strong>TeacherLink.in – </strong>Your Gateway to Career Success!</div>
              </div>
          </div>
        </section>

        <FooterDefault />
    </>
  );
};

export default SalientFeatures
