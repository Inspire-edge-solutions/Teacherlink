import { Link } from "react-router-dom";
import MobileSidebar from "./mobile-sidebar";
import { getIcon } from "../../utils/iconMapping";
import { Modal, Offcanvas } from 'bootstrap';

const MobileMenu = () => {
  const handleLoginClick = (e) => {
    e.preventDefault();
    const loginModal = document.getElementById('loginPopupModal');
    if (loginModal) {
      const modal = new Modal(loginModal);
      modal.show();
    }
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    const menuCanvas = document.getElementById('offcanvasMenu');
    if (menuCanvas) {
      const offcanvas = new Offcanvas(menuCanvas);
      offcanvas.show();
    }
  };

  return (
    // <!-- Main Header-->
    <header className="main-header main-header-mobile">
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="inner-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link to="/">
                  <img
                   
                    src="/images/teacherlink-logo.png"
                    alt="brand"
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <MobileSidebar />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            <div className="login-box">
              <button
                className="call-modal"
                onClick={handleLoginClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="icon-user">{getIcon('icon-user')}</span>
              </button>
            </div>
            {/* login popup end */}

            <button
              className="mobile-nav-toggler"
              onClick={handleMenuClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="icon-menu">{getIcon('icon-menu')}</span>
            </button>
            {/* right humberger menu */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
