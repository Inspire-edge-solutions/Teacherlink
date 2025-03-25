import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FooterDefault from "../../footer/common-footer";


const WhyTeacherlink = () => {
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


        <section className="why-teacherlink-section">
            <div className="container mt-50 text-center mb-50 p-50">
                <h1>Find Your Dream Job for Free with TeacherLink.in!</h1>
                <p className="mt-30 font-weight-bold">Your ideal destination for discovering exciting teaching career opportunities!</p>
                <img src="public/images/teacherlink_images/White-Simple-5-Steps-Infographic-Graph-1024-x-500-px.png" alt="Find Your Dream Job for Free with TeacherLink.in!" />
            </div>
        </section>
        <FooterDefault />
        </>
    )
}

export default WhyTeacherlink;  
