import React, { useState } from "react";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import ViewProfile from "./components/my-profile/ViewProfile";

const Index = () => {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="page-wrapper dashboard">
            <span className="header-span"></span>
            {/* <!-- Header Span for hight --> */}

            <LoginPopup />
            {/* End Login Popup Modal */}

            {/* <DashboardHeader /> */}
            {/* End Header */}

            <MobileMenu />
            {/* End MobileMenu */}

            <DashboardEmployerSidebar />
            {/* <!-- End User Sidebar Menu --> */}

            {/* <!-- Dashboard --> */}
            <section className="user-dashboard">
                <div className="dashboard-outer">
                    <BreadCrumb title="Organization Profile!" />
                    {/* breadCrumb */}

                    <MenuToggler />
                    {/* Collapsible sidebar button */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ls-widget">
                                <div className="widget-title d-flex justify-content-between">
                                    <h4>Profile Details</h4>
                                    {showProfile ? (
                                        <button 
                                            className="theme-btn btn-style-two" 
                                            onClick={() => setShowProfile(false)}
                                            style={{ marginBottom: "20px" }}
                                        >
                                            Back to Dashboard
                                        </button>
                                    ) : (
                                        <button 
                                            className="theme-btn btn-style-two"
                                            onClick={() => setShowProfile(true)}
                                        >
                                            view profile
                                        </button>
                                    )}
                                </div>
                                {showProfile ? <ViewProfile /> : <MyProfile />}
                            </div> 
                        </div>
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

export default Index;