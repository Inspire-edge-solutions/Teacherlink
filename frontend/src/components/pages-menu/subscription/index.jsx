import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FooterDefault from "../../footer/common-footer";

const Subscription = () => {
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
            <div className="container mt-50">
            <h2 className="text-center">Subscription plans for Employer(Institutions)</h2>
            <img src="public/images/teacherlink_images/1.png" alt="Subscription plans for Employer(Institutions)" />
            </div>
            <hr />
            <div className="container mt-30">
               <h2 className="text-center">Subscription plans for Candidates(Teachers)</h2>
               <img src="public/images/teacherlink_images/2.png" alt="Subscription plans for Candidates" />
            </div>
            <FooterDefault />
            </>
    )
}

export default Subscription;
