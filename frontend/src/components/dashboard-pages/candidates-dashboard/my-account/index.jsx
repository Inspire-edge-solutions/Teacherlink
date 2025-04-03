import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import Subscription from "./Components/Subscription";
const index = () => {
  return (
    <div className="page-wrapper dashboard">
      {/* <span className="header-span"></span> */}
      {/* <!-- Header Span for hight --> */}

      {/* <LoginPopup /> */}
      {/* End Login Popup Modal */}

      {/* <DashboardCandidatesHeader /> */}
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
              {/* <div className="ls-widget"> */}
                  <Subscription />
                    {/* This is where sub-components will render */}
                    <div className="profile-content-area">
                      {/* Common elements that appear on all sub-pages */}
                    </div>
              {/* </div> */}
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
