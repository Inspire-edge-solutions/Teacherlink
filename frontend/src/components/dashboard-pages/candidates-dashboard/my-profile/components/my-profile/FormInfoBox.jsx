import { React, useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import PersonalDetails from "./personalDetails";
import Address from "./address";
import Languages from "./languages";
import Education from "./Education";
import Experience from "./experience";
import JobPreferences from "./jobPreferences";
import Social from "./social";
import AdditionalInfo from "./additionalInfo";
import Easyview from "./Easyview";
import Fullview from "./Fullview";
import "./formInfo.css";
import { toast } from "react-toastify";
import axios from "axios";

// Endpoints for video/resume operations
const VIDEO_API_URL =
  "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-video";
const RESUME_API_URL =
  "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-resume";

// Validate video file types.
function checkVideoFileTypes(file) {
  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
  return allowedTypes.includes(file.type);
}

// Validate resume file types.
function checkResumeFileTypes(files) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  for (let i = 0; i < files.length; i++) {
    if (!allowedTypes.includes(files[i].type)) {
      return false;
    }
  }
  return true;
}

// Helper: Convert file to Base64.
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const FormInfoBox = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState(null); // "easy", "full", or null
  const [showProfile, setShowProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [stepValidations, setStepValidations] = useState({});
  const stepRef = useRef(null);

  // Store current user's UID in formData.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, firebase_uid: user.uid }));
    }
  }, [user]);

  // Clear any media popup when switching mode.
  useEffect(() => {
    // We don't maintain any modal state now because we use new windows.
  }, [viewMode]);

  const [formState, setFormState] = useState({
    personalDetails: { isValid: false, data: null },
    address: { isValid: false, data: null },
    education: { isValid: false, data: null },
    experience: { isValid: false, data: null },
    jobPreferences: { isValid: false, data: null },
  });

  // ===== VIDEO UPLOAD & VIEW =====
  const [demoVideoError, setDemoVideoError] = useState("");
  const [demoVideoUploading, setDemoVideoUploading] = useState(false);
  const demoVideoInputRef = useRef(null);

  // Trigger file input for video upload.
  const handleDemoVideoUploadClick = () => {
    if (demoVideoInputRef.current) {
      demoVideoInputRef.current.click();
    }
  };

  // When a video file is selected.
  const handleDemoVideoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!checkVideoFileTypes(file)) {
      setDemoVideoError("Only accept (.mp4, .webm, .mov) files");
      toast.error("Only accept (.mp4, .webm, .mov) files");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDemoVideoError("File size must be less than 10MB");
      toast.error("File size must be less than 10MB");
      return;
    }
    setDemoVideoError("");
    // Upload video logic:
    await uploadDemoVideo(file);
  };

  const uploadDemoVideo = async (file) => {
    try {
      setDemoVideoUploading(true);
      const toastId = toast.loading("Uploading video...");
      const params = { fileType: file.type, firebase_uid: user?.uid };
      const { data } = await axios.get(VIDEO_API_URL, { params });
      const putUrl = data.url;
      await axios.put(putUrl, file, { headers: { "Content-Type": file.type } });
      toast.update(toastId, {
        render: "Video uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    } finally {
      setDemoVideoUploading(false);
    }
  };

  // When user clicks the dedicated "view" button next to "My demo video -".
  // Instead of using an in-page popup, we open the video in a new tab.
  const handleDemoVideoView = async () => {
    try {
      const toastId = toast.loading("Loading video...");
      const params = { firebase_uid: user?.uid, action: "view" };
      const { data } = await axios.get(VIDEO_API_URL, { params });
      if (data && data.url) {
        // Open the URL in a new tab/window.
        window.open(data.url, "_blank", "noopener,noreferrer");
        toast.dismiss(toastId);
        console.log("Got video URL:", data.url);
      } else {
        toast.update(toastId, {
          render: "No video found",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error retrieving video:", error);
      toast.error("Error retrieving video");
    }
  };

  // ===== RESUME UPLOAD & VIEW =====
  const [resumeError, setResumeError] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const resumeInputRef = useRef(null);

  const handleResumeUploadClick = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.click();
    }
  };

  const handleResumeSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!checkResumeFileTypes(files)) {
      setResumeError("Only accept (.doc, .docx, .pdf) files");
      toast.error("Only accept (.doc, .docx, .pdf) files");
      return;
    }
    setResumeError("");
    for (const file of files) {
      await uploadResume(file);
    }
  };

  const uploadResume = async (file) => {
    try {
      setResumeUploading(true);
      const base64Data = await fileToBase64(file);
      const payload = { file: base64Data, fileType: file.type, firebase_uid: user?.uid };
      await axios.post(RESUME_API_URL, payload, { headers: { "Content-Type": "application/json" } });
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Error uploading resume");
    } finally {
      setResumeUploading(false);
    }
  };

  // When user clicks the dedicated "view" button next to "My resume/cv -".
  // We open the resume URL in a new tab/window.
  const handleResumeView = async () => {
    try {
      const toastId = toast.loading("Loading resume...");
      const params = { firebase_uid: user?.uid, action: "view" };
      const { data } = await axios.get(RESUME_API_URL, { params });
      if (data && data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
        toast.dismiss(toastId);
      } else {
        toast.update(toastId, {
          render: "No resume found",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error retrieving resume:", error);
      toast.error("Error retrieving resume");
    }
  };

  // ===== MULTI-STEP FORM LOGIC (Your steps remain unchanged) =====
  const easyModeSteps = [
    {
      id: 1,
      components: [
        {
          component: PersonalDetails,
          props: { dateOfBirth: false, photo: false, className: "easy-view", hideLanguages: true },
        },
        { component: Address, props: { permanentCity: false, presentCity: false } },
      ],
      title: "Personal Details",
    },
    {
      id: 2,
      components: [
        {
          component: Education,
          props: {
            isEasyMode: true,
            className: "easy-view",
            grade12syllabus: false,
            grade12school: false,
            grade12percentage: false,
            grade12mode: false,
            degreeCollege: false,
            degreePlace: false,
            degreeUniversity: false,
            degreePercentage: false,
            degreeMode: false,
            masterCollege: false,
            masterPlace: false,
            masterUniversity: false,
            masterPercentage: false,
            masterMode: false,
            doctorateCollege: false,
            doctorateUniversity: false,
            doctorateMode: false,
            bEdCollege: false,
            bEdPlace: false,
            bEdAffiliated: false,
            bEdCourseDuration: false,
            bEdPercentage: false,
            bEdMode: false,
            certificatePlace: false,
            certificateCourseDuration: false,
            certificateSpecialization: false,
            certificateMode: false,
          },
        },
      ],
      title: "Education",
    },
    {
      id: 3,
      components: [
        {
          component: Experience,
          props: {
            className: "easy-view",
          },
        },
      ],
      title: "Experience",
    },
    {
      id: 4,
      components: [{ component: JobPreferences, props: { className: "easy-view" } }],
      title: "Job Preferences",
    },
  ];

  const fullModeSteps = [
    {
      id: 1,
      components: [
        { component: PersonalDetails, props: { dateOfBirth: true, photo: true, hideLanguages: false } },
        { component: Address, props: { permanentCity: true, presentCity: true } },
        { component: Languages },
      ],
      title: "Personal Details",
    },
    {
      id: 2,
      components: [
        {
          component: Education,
          props: {
            isEasyMode: false,
            grade12syllabus: true,
            grade12school: true,
            grade12percentage: true,
            grade12mode: true,
            degreeCollege: true,
            degreePlace: true,
            degreeUniversity: true,
            degreePercentage: true,
            degreeMode: true,
            masterCollege: true,
            masterPlace: true,
            masterUniversity: true,
            masterPercentage: true,
            masterMode: true,
            doctorateCollege: true,
            doctorateUniversity: true,
            doctorateMode: true,
            bEdCollege: true,
            bEdPlace: true,
            bEdAffiliated: true,
            bEdCourseDuration: true,
            bEdPercentage: true,
            bEdMode: true,
            certificatePlace: true,
            certificateCourseDuration: true,
            certificateSpecialization: true,
            certificateMode: true,
          },
        },
      ],
      title: "Education",
    },
    {
      id: 3,
      components: [
        {
          component: Experience,
          props: {
            excludeAdditionalDetails: true,
            excludeTeachingCurriculum: true,
            excludeAdminCurriculum: true,
            excludeTeachingAdminCurriculum: true,
          },
        },
      ],
      title: "Experience",
    },
    {
      id: 4,
      components: [{ component: JobPreferences, props: {} }],
      title: "Job Preferences",
    },
    {
      id: 5,
      components: [{ component: Social, props: { isEasyMode: false } }],
      title: "Social Media",
    },
    {
      id: 6,
      components: [{ component: AdditionalInfo, props: {} }],
      title: "Additional Information",
    },
  ];

  useEffect(() => {
    try {
      const maxSteps = viewMode === "easy" ? easyModeSteps.length : fullModeSteps.length;
      if (currentStep > maxSteps) {
        setCurrentStep(1);
      }
    } catch (err) {
      console.error("Error in useEffect:", err);
      toast.error("An error occurred while setting up the form");
    }
  }, [viewMode, currentStep]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setCurrentStep(1);
  };

  const toggleProfileView = () => {
    setShowProfile(!showProfile);
  };

  const nextStep = () => {
    try {
      if (!isStepValid) {
        toast.error("Please fill all required fields before proceeding");
        return;
      }
      const maxSteps = viewMode === "easy" ? easyModeSteps.length : fullModeSteps.length;
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
        const profileBox = document.querySelector(".profile-box");
        if (profileBox) {
          profileBox.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        handleSubmit();
      }
    } catch (err) {
      console.error("Error in nextStep:", err);
      toast.error("An error occurred. Please try again");
    }
  };

  const prevStep = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        const profileBox = document.querySelector(".profile-box");
        if (profileBox) {
          profileBox.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (err) {
      console.error("Error in prevStep:", err);
      toast.error("An error occurred while navigating to the previous step. Please try again.");
    }
  };

  const handleSubmit = () => {
    try {
      if (!isStepValid) {
        toast.error("Please fill all required fields before submitting");
        return;
      }
      //console.log("Form submitted with data:", formData);
      toast.success("Profile updated successfully!");
      setShowProfile(true);
    } catch (err) {
      //console.error("Error in handleSubmit:", err);
      toast.error("An error occurred while submitting");
    }
  };

  const updateFormData = (stepData, isValid) => {
    try {
      setFormData((prev) => ({ ...prev, ...stepData }));
      setStepValidations((prev) => ({ ...prev, [currentStep]: isValid }));
      setIsStepValid(isValid);
    } catch (err) {
      console.error("Error in updateFormData:", err);
      toast.error("An error occurred while updating data");
    }
  };

  const jumpToStep = (stepNumber) => {
    try {
      const maxSteps = viewMode === "easy" ? easyModeSteps.length : fullModeSteps.length;
      if (stepNumber >= 1 && stepNumber <= maxSteps) {
        setCurrentStep(stepNumber);
      }
    } catch (err) {
      console.error("Error in jumpToStep:", err);
      toast.error("An error occurred while jumping to step. Please try again.");
    }
  };

  const steps = viewMode === "easy" ? easyModeSteps : fullModeSteps;
  const totalSteps = steps.length;

  let currentStepData = null;
  try {
    currentStepData = steps.find((step) => step.id === currentStep) || steps[0];
  } catch (err) {
    console.error("Error finding current step:", err);
    toast.error("An error occurred while finding the current step. Please refresh the page.");
  }

  if (!steps.length) {
    return <div className="profile-box">Loading profile form...</div>;
  }

  const renderCurrentStep = () => {
    try {
      if (!currentStepData || !currentStepData.components) {
        return <div>Error loading component. Please try again.</div>;
      }
      return (
        <div ref={stepRef}>
          {currentStepData.components.map(({ component: StepComponent, props }, idx) => (
            <StepComponent key={idx} {...props} formData={formData} updateFormData={(data, isValid) => updateFormData(data, isValid)} />
          ))}
        </div>
      );
    } catch (err) {
      console.error("Error rendering step component:", err);
      return <div>Error loading component. Please try again.</div>;
    }
  };

  // If mode is not selected, show upload section and mode selection.
  if (!viewMode) {
    return (
      <div>
        <div className="video-resume">
          {/* Demo Video Upload & View */}
          <div>
            <label>My demo video - </label>
            <button className="theme-btn btn-style-three" onClick={handleDemoVideoUploadClick}>Upload</button>
            <button className="theme-btn btn-style-three" onClick={handleDemoVideoView}>view</button>
            <input
              type="file"
              ref={demoVideoInputRef}
              style={{ display: "none" }}
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleDemoVideoSelect}
            />
            {demoVideoError && <p className="ui-danger mb-0">{demoVideoError}</p>}
          </div>
          {/* Resume Upload & View */}
          <div>
            <label>My resume/cv - </label>
            <button className="theme-btn btn-style-three" onClick={handleResumeUploadClick}>Upload</button>
            <button className="theme-btn btn-style-three" onClick={handleResumeView}>view</button>
            <input
              type="file"
              ref={resumeInputRef}
              style={{ display: "none" }}
              accept=".doc,.docx,application/msword,application/pdf"
              multiple
              onChange={handleResumeSelect}
            />
            {resumeError && <p className="ui-danger mb-0">{resumeError}</p>}
          </div>
        </div>
        <div className="mode-selection-container">
          <h3>Select Mode</h3>
          <div className="mode-options">
            <div className="mode-card">
              <h3>Easy Mode</h3>
              <p>Quick and simple profile with essential information</p>
              <div className="mode-actions">
                <button className="action-btn fill" onClick={() => { handleViewChange("easy"); setShowProfile(false); }}>Fill Details</button>
                <button className="action-btn view" onClick={() => { handleViewChange("easy"); setShowProfile(true); }}>View Details</button>
              </div>
            </div>
            <div className="mode-card">
              <h3>Full Mode</h3>
              <p>Comprehensive profile with detailed information</p>
              <div className="mode-actions">
                <button className="action-btn fill" onClick={() => { handleViewChange("full"); setShowProfile(false); }}>Fill Details</button>
                <button className="action-btn view" onClick={() => { handleViewChange("full"); setShowProfile(true); }}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a mode is selected, show the multi-step form or final view.
  return (
    <div className="profile-box">
      <div className="profile-header">
        <div className="title-box">
          <h3>My Profile ({viewMode === "easy" ? "Easy Mode" : "Full Mode"})</h3>
        </div>
      </div>
      {!showProfile ? (
        <div className="default-form">
          <div className="step-progress">
            <div className="step-title">
              <h4>Step {currentStep} of {totalSteps}: <span className="step-title-text">{currentStepData?.title || "Loading..."}</span></h4>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>
            <div className="step-indicators">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`step-indicator ${currentStep >= step.id ? "active" : ""} ${currentStep === step.id ? "current" : ""}`}
                  onClick={() => jumpToStep(step.id)}
                  title={step.title}
                >
                  {step.id}
                </div>
              ))}
            </div>
          </div>
          <div className="step-content">{renderCurrentStep()}</div>
          <div className="step-navigation">
            <div className="left-button">
              <button className="theme-btn btn-style-one" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </button>
            </div>
            <div className="right-button">
              <button className="theme-btn btn-style-two" onClick={nextStep}>
                {currentStep === totalSteps ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === "easy" ? (
        <Easyview formData={formData} />
      ) : (
        <Fullview formData={formData} />
      )}
    </div>
  );
};

export default FormInfoBox;
