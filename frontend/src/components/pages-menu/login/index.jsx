import FormContent from "../../common/form/login/FormContent";
import MobileMenu from "../../header/MobileMenu";
//import Header from "./Header";

const index = () => {
  return (
    <>
      {/* <Header /> */}
      {/* <!--End Main Header -->  */}

      <MobileMenu />
      {/* End MobileMenu */}

      <div className="login-section">
        <div
          className="image-layer"
          style={{ backgroundImage: "url(/images/background/12.jpg)" }}
        >
          <h2 style={{color: 'white', lineHeight: '1.8'}}>Connect with Colleges/Institutions, <br/>Inspire Students !!<br/> Login to  
          <strong> TeacherLink</strong> - <br/> Gateway to Teaching Opportunities and Talent!</h2>
        </div>
        <div className="outer-box">
          {/* <!-- Login Form --> */}
          <div className="login-form default-form">
            <FormContent />
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default index;
