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
            <PersonalDetails dateOfBirth={false} className="easy-view" />
            <Address city={false} houseNo={false} pincode={false} className="easy-view" />
            <Education isEasyMode={viewMode === 'easy'} className="easy-view" 
            grade12syllabus={false} grade12school={false} grade12percentage={false} grade12mode={false} 
            degreeCollege={false} degreePlace={false} degreeUniversity={false} degreePercentage={false} degreeMode={false}
             masterCollege={false} masterPlace={false} masterUniversity={false} masterPercentage={false} masterMode={false} 
             doctorateCollege={false} doctorateUniversity={false} doctorateMode={false}
             bEdCollege={false} bEdPlace={false} bEdAffiliated={false} bEdCourseDuration={false} bEdPercentage={false} bEdMode={false}
             certificatePlace={false} certificateCourseDuration={false} certificateSpecialization={false} certificateMode={false}
            />
            <Experience excludeAdditionalDetails={false} className="easy-view" />
            <JobPreferences className="easy-view" />
            <Social isEasyMode={true} className="easy-view" />
          </>
        ) : (
          <>
            <LogoUpload />
            <PersonalDetails dateOfBirth={true} />  
            <Address city={true} houseNo={true} pincode={true} />
            <Education isEasyMode={false} 
            grade12syllabus={true} grade12school={true} grade12percentage={true} grade12mode={true} 
            degreeCollege={true} degreePlace={true} degreeUniversity={true} degreePercentage={true} degreeMode={true} 
            masterCollege={true} masterPlace={true} masterUniversity={true} masterPercentage={true} masterMode={true} 
            doctorateCollege={true} doctorateUniversity={true} doctorateMode={true}
            bEdCollege={true} bEdPlace={true} bEdAffiliated={true} bEdCourseDuration={true} bEdPercentage={true} bEdMode={true}
            certificatePlace={true} certificateCourseDuration={true} certificateSpecialization={true} certificateMode={true}
            />
            <Experience excludeAdditionalDetails={true} />
            <Languages />
            <JobPreferences />
            <Social isEasyMode={false} />
            <ContactInfoBox />
            <AdditionalInfo />
          </>
        )}
      </div>
    </div>
  );
};

export default FormInfoBox;
