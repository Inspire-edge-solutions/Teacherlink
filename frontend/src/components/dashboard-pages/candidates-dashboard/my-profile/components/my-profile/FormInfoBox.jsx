import { React, useState } from "react";
import Select from "react-select";
import PersonalDetails from "./personalDetails";
import Address from "./address";
import Education from "./Education";
import Experience from "./experience";
import Salary from "./salary";
import Languages from "./languages";
import JobPreferences from "./jobPreferences";
import Social from "./social";
import ContactInfoBox from "../ContactInfoBox";
import AdditionalInfo from "./additionalInfo";
import "./profile-styles.css";

const FormInfoBox = () => {

  const catOptions = [
    { value: "Primary teacher", label: "Primary teacher" },
    { value: "High school teacher", label: "High school teacher" },
    { value: "Puc faculty", label: "Puc faculty" },
    { value: "NEET faculty", label: "NEET faculty" },
    { value: "CET faculty", label: "CET faculty" },
    { value: "JEE faculty", label: "JEE faculty" },
    { value: "Montessori teacher", label: "Montessori teacher" },
  ];

  
  return (
    <form action="#" className="default-form">
     
      <PersonalDetails/>

        <Address />

        <Education />

        <Salary/>

        <Experience/>

        <Languages/>

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
