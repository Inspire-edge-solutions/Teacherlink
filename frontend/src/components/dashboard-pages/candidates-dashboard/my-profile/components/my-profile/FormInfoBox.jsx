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
  const [viewMode, setViewMode] = useState('full'); // default to full view

  const handleViewChange = (e) => {
    setViewMode(e.target.value);
  };

  return (
    <div>
      
      <div className="view-toggle m-4">
      <h3>My profile</h3>
        <div className="radio-group d-flex align-items-flex-start gap-6">
        
        <h4>Select how you want to fill your details : </h4>
        <label className="radio-label">
            <input
              type="radio"
              name="viewMode"
              value="easy"
              checked={viewMode === 'easy'}
              onChange={handleViewChange}
              className="me-2"
            />
            Easy Mode
          </label>

          <label className="radio-label m-3">
            <input
              type="radio"
              name="viewMode"
              value="full"
              checked={viewMode === 'full'}
              onChange={handleViewChange}
              className="me-2"
            />
            Full Mode
          </label>
          
         
        </div>
      </div>

      <div className="default-form">
        {viewMode === 'easy' ? (
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
};

export default FormInfoBox;
