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
import Easyview from './Easyview';
import Fullview from './Fullview';

const FormInfoBox = () => {
  const [viewMode, setViewMode] = useState('full'); // default to full view
  const [showProfile, setShowProfile] = useState(false);

  const handleViewChange = (e) => {
    setViewMode(e.target.value);
    setShowProfile(false); // Reset profile view when changing modes
  };

  const toggleProfileView = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="profile-box">
      {/* Header Section */}
      <div className="profile-header">
        <div className="title-box">
          <h3>My profile</h3>
          <button 
            className="theme-btn btn-style-two" 
            onClick={toggleProfileView}
          >
            {showProfile ? 'Edit Profile' : 'View Profile'}
          </button>
        </div>
      </div>

      {!showProfile ? (
        <>
          {/* Selection Section - All in one line */}
          <div className="selection-wrapper">
            <h4>Select how you want to fill your details:</h4>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="viewMode"
                  value="easy"
                  checked={viewMode === 'easy'}
                  onChange={handleViewChange}
                />
                <span className="radio-label">Easy Mode</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="viewMode"
                  value="full"
                  checked={viewMode === 'full'}
                  onChange={handleViewChange}
                />
                <span className="radio-label">Full Mode</span>
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
                <Experience excludeAdditionalDetails={false} excludeTeachingCurriculum={false} excludeAdminCurriculum={false} excludeTeachingAdminCurriculum={false} className="easy-view" />
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
                <Experience excludeAdditionalDetails={true} excludeTeachingCurriculum={true} excludeAdminCurriculum={true} excludeTeachingAdminCurriculum={true} />
                <Languages />
                <JobPreferences />
                <Social isEasyMode={false} />
                <ContactInfoBox />
                <AdditionalInfo />
              </>
            )}
          </div>
        </>
      ) : (
        // Show the appropriate view component based on viewMode
        viewMode === 'easy' ? <Easyview /> : <Fullview />
      )}
    </div>
  );
};

export default FormInfoBox;
