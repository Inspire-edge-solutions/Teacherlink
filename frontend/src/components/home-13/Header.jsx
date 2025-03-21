


import { Link } from "react-router-dom";
import HeaderNavContent from "../header/HeaderNavContent";


const Header = () => {
  // const [navbar, setNavbar] = useState(false);

  // const changeBackground = () => {
  //   if (window.scrollY >= 10) {
  //     setNavbar(true);
  //   } else {
  //     setNavbar(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", changeBackground);
  // }, []);

  return (
    // <!-- Main Header-->
    // <header
    //   // className={`main-header -type-11  ${
    //   //   navbar ? "fixed-header animated slideInDown" : ""
    //   // }`}
    // >
    <header className="main-header">
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
              <Link to="/">
                <img
                  src="/images/teacherlink-logo.png"
                  alt="brand"
                  height={300}
                  width={300}
                />
              </Link>
          </div>
          {/* End .logo-box */}

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        <div className="outer-box">
          {/* <!-- Login/Register --> */}
          <div className="btn-box">
            <a
              href="/login"
              className="theme-btn btn-style-three btn-blue"
              // data-bs-toggle="modal"
              // data-bs-target="#register"
            >
              Login/Register
            </a>
            {/* <Link
              to="/employers-dashboard/post-jobs"
              className="theme-btn btn-style-one btn-white"
            >
              Job Post
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
