import { React, useState } from "react";
import PersonalDetails from "./personalDetails";
import Address from "./address";
import Education from "./Education";
import Experience from "./experience";
//import Salary from "./salary";
import Languages from "./languages";
import JobPreferences from "./jobPreferences";
import Social from "./social";
import ContactInfoBox from "../ContactInfoBox";
import AdditionalInfo from "./additionalInfo";
import "./profile-styles.css";

const FormInfoBox = () => {

  return (
    <form action="#" className="default-form">
     
      <PersonalDetails/>

        <Address />

        <Education />

        <Experience/>

        <Languages/>

        {/* <Salary/> */}

        <JobPreferences/>
        
        <Social/>
       
       <ContactInfoBox/>

        <AdditionalInfo/>
       
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-center">
          <button type="submit" className="theme-btn btn-style-one">
            Save Profile
          </button>
        </div>
    </form>
  );
};

export default FormInfoBox;
