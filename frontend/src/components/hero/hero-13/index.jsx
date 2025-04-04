import SearchForm from "../../common/job-search/SearchForm";
import ImageBox from "./ImageBox";
import PopularSearch from "../PopularSearch";
import { Link } from "react-router-dom";
import SliderImages from "./SliderImages";

const index = () => {
  return (
    <section className="banner-section -type-13">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-12 col-md-12 col-sm-12">
            <div
              className="inner-column"
              data-aos="fade-up"
              data-aos-delay="500"
              style={{ position: 'relative' }}
            >
              <div className="title-box" style={{ width: '50%' }}>
                <h3>Looking For a Teaching Job?</h3>
                <h3>Or Providing Job to Teachers?</h3>
                <div className="text">
                  You are at the right place !
                </div>
              </div>
              <div style={{
                position: 'absolute',
                right: '0',
                top: '60%',
                transform: 'translateY(-50%)',
                width: '45%'
              }}>
                <SliderImages />
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
