import { React, useState, useEffect } from "react";
import PersonalDetails from "./personalDetails";
import Address from "./address";
import Languages from "./languages";
import Education from "./Education";
import Experience from "./experience";
import JobPreferences from "./jobPreferences";
import Social from "./social";
import AdditionalInfo from "./additionalInfo";
//import "./profile-styles.css";
import Easyview from './Easyview';
import Fullview from './Fullview';
import "./formInfo.css";

const FormInfoBox = () => {
  const [viewMode, setViewMode] = useState('full'); // default to full view
  const [showProfile, setShowProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // Define steps for both modes
  const easyModeSteps = [
    { id: 1, components: [
      { component: PersonalDetails, props: { dateOfBirth: false, photo: false, className: "easy-view", hideLanguages: true } },
      { component: Address, props: { permanentCity: false, presentCity:false } },
    ], title: "Personal Details" },
    { id: 2, components: [
      { component: Education, props: { 
        isEasyMode: true, className: "easy-view",
        grade12syllabus: false, grade12school: false, grade12percentage: false, grade12mode: false, 
        degreeCollege: false, degreePlace: false, degreeUniversity: false, degreePercentage: false, degreeMode: false,
      masterCollege: false, masterPlace: false, masterUniversity: false, masterPercentage: false, masterMode: false, 
      doctorateCollege: false, doctorateUniversity: false, doctorateMode: false,
      bEdCollege: false, bEdPlace: false, bEdAffiliated: false, bEdCourseDuration: false, bEdPercentage: false, bEdMode: false,
      certificatePlace: false, certificateCourseDuration: false, certificateSpecialization: false, certificateMode: false
      }}], title: "Education" },
    { id: 3, components: [
      { component: Experience, props: { excludeAdditionalDetails: false, excludeTeachingCurriculum: false, excludeAdminCurriculum: false, excludeTeachingAdminCurriculum: false, className: "easy-view" } },
    ], title: "Experience" },
    { id: 4, components: [
      { component: JobPreferences, props: { className: "easy-view" } },
    ], title: "Job Preferences" }
  ];

  const fullModeSteps = [
    {
      id: 1,
      components: [
        { component: PersonalDetails, props: { dateOfBirth: true, photo: true, hideLanguages: false } },
        { component: Address, props: { permanentCity: true,presentCity:true } },
        { component: Languages }
      ],
      title: "Personal Details"
    },
    { id: 2, components: [
      { component: Education, props: { 
        isEasyMode: false,
        grade12syllabus: true, grade12school: true, grade12percentage: true, grade12mode: true, 
        degreeCollege: true, degreePlace: true, degreeUniversity: true, degreePercentage: true, degreeMode: true, 
      masterCollege: true, masterPlace: true, masterUniversity: true, masterPercentage: true, masterMode: true, 
      doctorateCollege: true, doctorateUniversity: true, doctorateMode: true,
      bEdCollege: true, bEdPlace: true, bEdAffiliated: true, bEdCourseDuration: true, bEdPercentage: true, bEdMode: true,
      certificatePlace: true, certificateCourseDuration: true, certificateSpecialization: true, certificateMode: true
      }}], title: "Education" },
    { id: 3, components: [
      { component: Experience, props: { excludeAdditionalDetails: true, excludeTeachingCurriculum: true, excludeAdminCurriculum: true, excludeTeachingAdminCurriculum: true } },
    ], title: "Experience" },
    { id: 4, components: [
      { component: JobPreferences, props: {} },
    ], title: "Job Preferences" },
    { id: 5, components: [
      { component: Social, props: { isEasyMode: false } },
    ], title: "Social Media" },
    { id: 6, components: [
      { component: AdditionalInfo, props: {} },
    ], title: "Additional Information" }
  ];

  // Ensure currentStep is valid when viewMode changes
  useEffect(() => {
    try {
      const maxSteps = viewMode === 'easy' ? easyModeSteps.length : fullModeSteps.length;
      if (currentStep > maxSteps) {
        setCurrentStep(1);
      }
      setError(null);
    } catch (err) {
      console.error("Error in useEffect:", err);
      setError("An error occurred while setting up the form. Please refresh the page.");
    }
  }, [viewMode, currentStep]);

  const handleViewChange = (e) => {
    try {
      setViewMode(e.target.value);
      setShowProfile(false); // Reset profile view when changing modes
      setCurrentStep(1); // Reset to first step
      setError(null);
    } catch (err) {
      console.error("Error in handleViewChange:", err);
      setError("An error occurred while changing view mode. Please try again.");
    }
  };

  const toggleProfileView = () => {
    setShowProfile(!showProfile);
  };

  const nextStep = () => {
    try {
      const maxSteps = viewMode === 'easy' ? easyModeSteps.length : fullModeSteps.length;
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
        // Scroll to top of form when changing steps
        const profileBox = document.querySelector('.profile-box');
        if (profileBox) {
          profileBox.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Handle form submission when on last step
        handleSubmit();
      }
    } catch (err) {
      console.error("Error in nextStep:", err);
      setError("An error occurred while navigating to the next step. Please try again.");
    }
  };

  const prevStep = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        // Scroll to top of form when changing steps
        const profileBox = document.querySelector('.profile-box');
        if (profileBox) {
          profileBox.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.error("Error in prevStep:", err);
      setError("An error occurred while navigating to the previous step. Please try again.");
    }
  };

  const handleSubmit = () => {
    try {
      // Here you would typically send the formData to your backend
      console.log("Form submitted with data:", formData);
      // Show success message or redirect
      alert("Profile updated successfully!");
      // Optionally show the profile view
      setShowProfile(true);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("An error occurred while submitting the form. Please try again.");
    }
  };

  const updateFormData = (stepData) => {
    try {
      setFormData(prevData => ({
        ...prevData,
        ...stepData
      }));
    } catch (err) {
      console.error("Error in updateFormData:", err);
      setError("An error occurred while updating form data. Please try again.");
    }
  };

  // Function to jump to a specific step
  const jumpToStep = (stepNumber) => {
    try {
      if (stepNumber >= 1 && stepNumber <= totalSteps) {
        setCurrentStep(stepNumber);
      }
    } catch (err) {
      console.error("Error in jumpToStep:", err);
      setError("An error occurred while jumping to step. Please try again.");
    }
  };

  // Get current steps array based on view mode
  const steps = viewMode === 'easy' ? easyModeSteps : fullModeSteps;
  const totalSteps = steps.length;
  
  // Find current step data safely
  let currentStepData = null;
  try {
    currentStepData = steps.find(step => step.id === currentStep);
    if (!currentStepData) {
      currentStepData = steps[0];
    }
  } catch (err) {
    console.error("Error finding current step:", err);
    setError("An error occurred while finding the current step. Please refresh the page.");
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="profile-box">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            className="theme-btn btn-style-two" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If no steps are defined or components are missing
  if (!steps.length) {
    return <div className="profile-box">Loading profile form...</div>;
  }

  // Render the current step component
  const renderCurrentStep = () => {
    try {
      if (!currentStepData || !currentStepData.components) {
        return <div>Error loading component. Please try again.</div>;
      }

      return currentStepData.components.map(({ component: StepComponent, props }, index) => (
        <StepComponent
          key={index}
          {...props}
          onComplete={nextStep}
          updateFormData={updateFormData}
          formData={formData}
        />
      ));
    } catch (err) {
      console.error("Error rendering step component:", err);
      return <div>Error loading component. Please try again.</div>;
    }
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
            {/* Step Progress Indicator */}
            <div className="step-progress">
              <div className="step-title">
                <h4>Step {currentStep} of {totalSteps}: {currentStepData?.title || 'Loading...'}</h4>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              
              {/* Step Indicators */}
              <div className="step-indicators">
                {steps.map((step) => (
                  <div 
                    key={step.id}
                    className={`step-indicator ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
                    onClick={() => jumpToStep(step.id)}
                    title={step.title}
                  >
                    {step.id}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Component */}
            <div className="step-content">
              {renderCurrentStep()}
            </div>

            {/* Navigation Buttons - Modified structure */}
            <div className="step-navigation">
              <div className="left-button">
                <button 
                  className="theme-btn btn-style-one" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
              </div>
              <div className="right-button">
                <button 
                  className="theme-btn btn-style-two" 
                  onClick={nextStep}
                >
                  {currentStep === totalSteps ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Show the appropriate view component based on viewMode
        viewMode === 'easy' ? <Easyview formData={formData} /> : <Fullview formData={formData} />
      )}
    </div>
  );
};

export default FormInfoBox;