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
                  <div className="col-lg-12">
                      <h1>Find Your Dream Job for Free with TeacherLink.in!</h1>
                      <p>TeacherLink.in is a job board for teachers. It is a platform that allows teachers to find jobs and apply for them.</p>
                  </div>
              </div>
          </div>
        </section>

        <FooterDefault />
    </>
  );
};

export default SalientFeatures
