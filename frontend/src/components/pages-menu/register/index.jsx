//import FormContent from "@/components/common/form/register/FormContent";
import Register from "../../common/form/register/Register";
import MobileMenu from "../../header/MobileMenu";
//import Header from "./Header";
import "./register.css";
import { useState } from "react";

const RegisterPage = () => {
  const [selectedUserType, setSelectedUserType] = useState("Candidate");

  const getWelcomeText = () => {
    if (selectedUserType === "Candidate") {
      return (
        <h2 style={{color: 'white', lineHeight: '1.8'}}>
          Looking for a teaching or non-teaching job in educational institutions?<br/>
          You're in the right place!<br/>
          Create your account today and unlock endless opportunities in the education sector! 🚀
        </h2>
      );
    } else {
      return (
        <h2 style={{color: 'white', lineHeight: '1.8'}}>
          Looking to hire top talent for your educational institution?<br/>
          You're in the right place!<br/>
          Create your account today and connect with qualified educators and professionals effortlessly! 🎯
        </h2>
      );
    }
  };

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
          {getWelcomeText()}
        </div>
        <div className="outer-box">
          {/* <!-- Login Form --> */}
          <div className="login-form default-form">
            <Register onUserTypeChange={setSelectedUserType} />
            {/* <FormContent /> */}
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default RegisterPage;
