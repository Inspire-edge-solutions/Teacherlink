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
import SocialNetworkBox from "../SocialNetworkBox";
import ContactInfoBox from "../ContactInfoBox";

const FormInfoBox = () => {
  // State to hold the combined form data
  const [formData, setFormData] = useState({
    firebase_uid: "", // Set this after login if needed
    type: "", // e.g., "School / College/ University" or "Parent/ Guardian looking for Tuitions"
    organization_details: {},
    parent_details: {},
    account_operated_by: {},
    reporting_authority: {},
    social: {},
    images: [],
    contact: {} // Data from ContactInfoBox (e.g., find_on_map, latitude, longitude)
  });

  // Handler for changes from OrgDetails component.
  const handleOrgDetailsChange = (data) => {
    // Expected data: { type, organization_details, parent_details, account_operated_by, reporting_authority }
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Handler for changes from SocialNetworkBox component.
  const handleSocialChange = (data) => {
    setFormData((prev) => ({ ...prev, social: data }));
  };

  // Handler for changes from LogoCoverUploader component.
  const handleImagesChange = (imagesData) => {
    setFormData((prev) => ({ ...prev, images: imagesData }));
  };

  // Handler for changes from ContactInfoBox component.
  const handleContactInfoChange = (data) => {
    setFormData((prev) => ({ ...prev, contact: data }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the payload including a route for backend routing
    const payload = {
      route: "CreateOrganization",
      ...formData,
    };

    try {
      const response = await fetch(
        "https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/organization", // ADD YOUR API LINK HERE
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      console.log("Submission result:", result);
      // Optionally, add success handling (e.g., notifications or redirection)
    } catch (error) {
      console.error("Error submitting data to backend:", error);
      // Optionally, add error handling here (e.g., display error messages)
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        <LogoCoverUploader onChange={handleImagesChange} />
        <OrgDetails onChange={handleOrgDetailsChange} />
        <SocialNetworkBox onChange={handleSocialChange} />
        <ContactInfoBox onChange={handleContactInfoChange} />
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
