
import CopyrightFooter from "../footer/common-footer/CopyrightFooter";
import FooterApps2 from "../footer/FooterApps2";
import FooterContent3 from "../footer/FooterContent3";

const Footer = () => {
  return (
    <footer className="main-footer style-five">
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div className="widgets-section" data-aos="fade-up">
          <div className="row">
            <div className="big-column col-xl-3 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <a href="#">
                    <img
                     
                      src="/images/teacherlink-logo.png"
                      alt="brand"
                    />
                  </a>
                </div>
                <p className="phone-num">
                  <span>Call us </span>
                  <a href="thebeehost@support.com">+91 9606889003</a>
                </p>
                <p className="address">
                  13/2, Standage road, Pulikeshi nagar,
                  <br /> Bengaluru, Karnataka, India 560005 <br />
                  <a href="mailto:info@inspireedgesolutions.com" className="email">
                    info@inspireedgesolutions.com
                  </a>
                </p>
              </div>
            </div>
            {/* End footer address left widget */}

            <div className="big-column col-xl-9 col-lg-9 col-md-12">
              <div className="row">
                <FooterContent3 />

                <div className="footer-column col-lg-3 col-md-6 col-sm-12">
                  <div className="footer-widget">
                    <h4 className="widget-title">Mobile Apps</h4>
                    <FooterApps2 />
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End col-xl-8 */}
          </div>
        </div>
      </div>
      {/* End auto-container */}

      <CopyrightFooter />
      {/* <!--Bottom--> */}
    </footer>
  );
};

export default Footer;
