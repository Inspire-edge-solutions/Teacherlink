import { React, useState } from "react";
import PersonalDetails from "./personalDetails";
import Address from "./address";
import Education from "./Education";
import Experience from "./experience";
import Languages from "./languages";
import JobPreferences from "./jobPreferences";
import Social from "./social";
import ContactInfoBox from "../ContactInfoBox";
import AdditionalInfo from "./additionalInfo";
import "./profile-styles.css";
import LogoUpload from "./LogoUpload";

const FormInfoBox = () => {

  const [isEasyView, setIsEasyView] = useState(false);

  const toggleView = () => {
    setIsEasyView(!isEasyView);
  };

  return (
    <div>
      <div className="view-toggle">
        <button className="btn btn-style-three mb-3" onClick={toggleView}>
          {isEasyView ? "Switch to Full View" : "Switch to Easy View"}
        </button>
      </div>

      <div className="default-form">
        {isEasyView ? (
          <>
            <PersonalDetails />
            <Address />
            <Education />
            <Experience/>
            <JobPreferences />
          </>
        ) : (
          <>
          <LogoUpload />
            <PersonalDetails />
            <Address />
            <Education />
            <Experience />
            <Languages />
            <JobPreferences />
            <Social />
            <ContactInfoBox />
            <AdditionalInfo />
          </>
        )}
      </div>
    </div>
  );



//   return (
//     // <form action="#" className="default-form">
//      <>
//      <div className="default-form">
//       <PersonalDetails/>

//         <Address />

//         <Education />

//         <Experience/>

//         <Languages/>

//         <JobPreferences/>
        
//         <Social/>
       
//        <ContactInfoBox/>

//         <AdditionalInfo/>
//         </div>

//         </>
       
//     //     <div className="form-group col-lg-12 col-md-12 text-center">
//     //       <button type="submit" className="theme-btn btn-style-one">
//     //         Save Profile
//     //       </button>
//     //     </div>
//     // </form>
//   );
};

export default FormInfoBox;
