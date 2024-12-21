


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./register.css";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const changeBackground = () => {
    if (window.scrollY >= 150) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`main-header ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
          <Link to="/" className="isSticky">
                  <img
                    src="/images/teacherlink-logo.png"
                    alt="logo"
                    title="brand"
                    height={150}
                    width={150}
                  />
                </Link>
               
          </div>
          {/* End nav-outer */}
          
          {/* <div className="outer-box"> */}
            {/* <!-- Login/Register --> */}
            <div className="logo-box">
              <div className="logo">
                <Link to="/" className="noSticky">
                  <img
                    src="/images/teacherlink-logo.png"
                    alt="logo"
                    title="brand"
                    height={150}
                    width={150}
                  />
                </Link>
              </div>
            </div>
            {/* <div className="btn-box">
              <Link
                to="/employers-dashboard/post-jobs"
                className="theme-btn btn-style-one"
              >
                <span className="btn-title">Job Post</span>
              </Link>
            </div> */}
          </div>
          {/* End outer-box */}
        {/* </div> */}
      </div>
    </header>
  );
};

export default Header;
