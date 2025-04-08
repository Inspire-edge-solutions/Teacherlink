import SearchForm from "../../common/job-search/SearchForm";
import ImageBox from "./ImageBox";
import PopularSearch from "../PopularSearch";
import { Link } from "react-router-dom";
import SliderImages from "./SliderImages";

const index = () => {
  return (
    <section className="banner-section -type-13 py-1 py-md-3">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-12 col-md-12 col-sm-12">
            <div
              className="inner-column position-relative"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 mb-2 mb-lg-0">
                  <div className="title-box">
                    <h3 className="mb-2">Looking For a Teaching Job?</h3>
                    <h3 className="mb-3">Or Providing Job to Teachers?</h3>
                    <div className="text mb-4">
                      You are at the right place !
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="slider-container">
                    <SliderImages />
                  </div>
                </div>
              </div>

              {/* <!-- Job Search Form --> */}
              {/* <div
                className="job-search-form"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <SearchForm /> */}
              {/* </div> */}
              {/* <!-- Job Search Form --> */}

              {/* <!-- Popular Search --> */}
              {/* <PopularSearch /> */}
              {/* <!-- End Popular Search --> */}

              {/* <div className="bottom-box wow fadeInUp" data-wow-delay="1500ms">
                <div className="count-employers">
                  <span className="title">10k+ Candidates</span>
                  <img
                   
                    src="/images/resource/multi-peoples.png"
                    alt="resource"
                  />
                </div>
                <Link
                  to="/candidates-dashboard/cv-manager"
                  className="upload-cv"
                >
                  <span className="icon flaticon-file"></span> Upload your CV
                </Link>
              </div> */}
              {/* <!-- End Bottom Box --> */}
            </div>
          </div>
          {/* End .col */}

          <div className="image-column col-lg-5 col-md-12">
            <ImageBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
