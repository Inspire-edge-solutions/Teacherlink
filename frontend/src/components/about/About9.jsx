
import { Link } from "react-router-dom";

const About9 = () => {
  return (
    <>
      {/* <!-- About Section --> */}
      <section className="about-section-two style-two layout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row justify-content-between align-items-center">
            {/* <!-- Image Column --> */}
            <div className="image-column -no-margin col-xl-6 col-lg-6 col-md-12 col-sm-12 wow fadeInRight">
              <div className="image-box -type-1">
                <figure
                  className="main-image"
                  data-aos-delay="500"
                  data-aos="fade-in"
                >
                  {/* <img
                    
                    src="/images/index-13/images/1.png"
                    alt="resource"
                  /> */}
                  <img src="https://plus.unsplash.com/premium_photo-1661335260175-5735a1d487e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="institution"/>
                </figure>

                {/* <!-- Info BLock One --> */}
                <div
                  className="info_block"
                  data-aos-delay="800"
                  data-aos="fade-in"
                >
                  <span className="icon flaticon-email-3"></span>
                  <p>
                    Work Inquiry From <br />
                    Md Shafiq
                  </p>
                </div>

                {/* <!-- Info BLock Two --> */}
                <div
                  className="info_block_two"
                  data-aos-delay="1100"
                  data-aos="fade-in"
                >
                  <p>Many more Candidates</p>
                  <div className="image">
                    <img
                     
                      src="/images/resource/multi-peoples.png"
                      alt="resource"
                    />
                  </div>
                </div>

                {/* <!-- Info BLock Four --> */}
                <div
                  className="info_block_four"
                  data-aos-delay="1300"
                  data-aos="fade-in"
                >
                  <span className="icon flaticon-file"></span>
                  <div className="inner">
                    <p>Upload Your CV</p>
                    <span className="sub-text">
                      It only takes a few seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* End img-column */}

            {/* <!-- Content Column --> */}
            <div className="content-column mb-0 col-xl-5 col-lg-6 col-md-12 col-sm-12">
              <div data-aos="fade-right">
                <div className="sec-title">
                  <h2 className="fw-700">
                    Professional CV is your ticket to the dream job
                  </h2>
                  <div className="text mt-30">
                  A professional CV is your stepping stone to the teaching career you’ve always envisioned. It highlights your passion, skills, and impact as an educator, connecting you with institutions that value your ability to inspire and nurture the leaders of tomorrow.
                  </div>
                </div>
                <Link
                  to="/candidates-dashboard/cv-manager"
                  className="theme-btn btn-style-one"
                >
                  Post Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End About Section -->  */}
    </>
  );
};

export default About9;
