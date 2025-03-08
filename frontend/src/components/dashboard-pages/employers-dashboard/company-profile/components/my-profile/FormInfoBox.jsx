// import OrgDetails from "./OrgDetails";
// import LogoCoverUploader from "./LogoCoverUploader";
// import ContactInfoBox from "../ContactInfoBox";
// import SocialNetworkBox from "../SocialNetworkBox";

// const FormInfoBox = () => {

//     return (
//         // <form className="default-form">
//             <div className="row">
//                 <LogoCoverUploader />
//                 <OrgDetails />
//                 <SocialNetworkBox />
//                 <ContactInfoBox />
               
//                 {/* <div className="form-group col-lg-6 col-md-12">
//                     <button className="theme-btn btn-style-one">Save</button>
//                 </div> */}
//             </div>
//         // </form>
//     );
// };

// export default FormInfoBox;

// FormInfoBox.jsx
import React, { useState } from "react";
import OrgDetails from "./OrgDetails";
import LogoCoverUploader from "./LogoCoverUploader";
import ContactInfoBox from "../ContactInfoBox";

const FormInfoBox = () => {

  return (
    <div className="default-form">
      <div className="row">
        <LogoCoverUploader />
        <OrgDetails />
        <ContactInfoBox />
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormInfoBox;
