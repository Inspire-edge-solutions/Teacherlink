import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";

const PersonalDetails = ({ formData, updateFormData, className, dateOfBirth, photo }) => {
  const { user } = useAuth();
  const currentUid = user?.uid;

  // Keep your existing state setup
  const [localFormData, setLocalFormData] = useState({
    firebase_uid: currentUid || "",
    fullName: user?.name || "",
    email: user?.email || "",
    gender: "",
    dateOfBirth: "",
    callingNumber: user?.phone_number || "",
    whatsappNumber: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [profilePicId, setProfilePicId] = useState(null);

  // Verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  // Upload/photo feedback states
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Loading state for sending email OTP
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  // Track whether the user record exists in your backend
  const [isNewUser, setIsNewUser] = useState(true);

  // State for the "View Profile" display data
  const [profileData, setProfileData] = useState(null);

  // Fetch user details - no need to validate pre-filled data
  const fetchUserDetails = async () => {
    try {
      if (!currentUid) return;
      
      const response = await axios.get(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
        { params: { firebase_uid: currentUid, t: Date.now() } }
      );

      if (response.status === 200 && response.data.length > 0) {
        const userData = response.data[0];
        const newFormData = {
          firebase_uid: currentUid,
          fullName: userData.fullName || "",
          email: userData.email || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          callingNumber: userData.callingNumber || "",
          whatsappNumber: userData.whatsappNumber || ""
        };

        setLocalFormData(newFormData);
        setEmailVerified(userData.email_verify === 1);
        setIsNewUser(false);
        
        // If data is pre-filled, we can assume it's valid
        updateFormData(newFormData, true);
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [currentUid]);

  // Only validate when user makes changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "email" && value !== localFormData.email) {
      setEmailVerified(false);
      setShowEmailOtpInput(false);
      setEmailOtp("");
    }

    const newData = {
      ...localFormData,
      [name]: value
    };

    setLocalFormData(newData);
    
    // Only validate if user is actively changing values
    const isValid = document.querySelector('form').checkValidity();
    updateFormData(newData, isValid);
  };

  // "View Profile" fetch – using the current UID and a timestamp to avoid caching
  const handleViewProfile = async () => {
    try {
      if (!currentUid) {
        console.log("No current UID available in AuthContext");
        return;
      }
      console.log("View Profile clicked. Current UID:", currentUid);
      const response = await axios.get(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
        { params: { firebase_uid: currentUid, t: Date.now() } }
      );
      if (response.status === 200 && response.data.length > 0) {
        console.log("View Profile fetch success. Data:", response.data[0]);
        setProfileData(response.data[0]);
        toast.success("Profile data fetched successfully!");
      } else {
        setProfileData(null);
        toast.info("No profile data found for current user.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data.");
    }
  };

  // Date input toggling
  const [dateType, setDateType] = useState("text");
  const handleFocusDate = () => setDateType("date");
  const handleBlurDate = (e) => {
    if (!e.target.value) setDateType("text");
  };

  // WhatsApp hint toggling
  const [whatsappType, setWhatsappType] = useState("text");
  const [showWhatsappHint, setShowWhatsappHint] = useState(false);
  const handleFocusWhatsapp = () => {
    setWhatsappType("text");
    setShowWhatsappHint(true);
  };
  const handleBlurWhatsapp = (e) => {
    if (!e.target.value) {
      setWhatsappType("text");
    }
    setShowWhatsappHint(false);
  };

  // File selection
  const imageFileHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Photo upload endpoint
  const IMAGE_API_URL =
    "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-image";

  const uploadPhoto = async () => {
    if (!imageFile) {
      setMessage("Please select a photo file.");
      return;
    }
    try {
      setUploading(true);
      setMessage("");
      const base64Data = await fileToBase64(imageFile);
      const payload = {
        file: base64Data,
        fileType: imageFile.type,
        firebase_uid: currentUid
      };
      const response = await axios.post(IMAGE_API_URL, payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Photo submitted successfully:", response.data);
      toast.success("Photo submitted successfully");
      setMessage("Photo uploaded successfully!");
      if (response.data.id) {
        setProfilePicId(response.data.id);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Error uploading photo");
      setMessage(`Photo upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // OTP handling for email
  const sendEmailOtp = async () => {
    try {
      setIsEmailVerifying(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/create`,
        { email: localFormData.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        setShowEmailOtpInput(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to send email OTP: ${error.message}`);
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/verify`,
        {
          email: localFormData.email,
          otp: emailOtp,
          firebase_uid: localFormData.firebase_uid
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("Email verified successfully!");
        setEmailVerified(true);
        setShowEmailOtpInput(false);
      }
    } catch (error) {
      toast.error(`Failed to verify email: ${error.message}`);
    }
  };

  // OTP handling for phone
  const sendPhoneOtp = async () => {
    try {
      if (localFormData.callingNumber.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/send-phone-otp`,
        {
          phone: localFormData.callingNumber,
          countryCode: "+91"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("OTP sent to your phone!");
        setShowPhoneOtpInput(true);
      }
    } catch (error) {
      console.error("Phone OTP error:", error);
      toast.error(`Failed to send OTP: ${error.message}`);
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      if (!phoneOtp || phoneOtp.length < 4) {
        toast.error("Please enter a valid OTP");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/verify-phone-otp`,
        {
          phone: localFormData.callingNumber,
          otp: phoneOtp
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("Phone number verified successfully!");
        setPhoneVerified(true);
        setShowPhoneOtpInput(false);
      } else {
        toast.error("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(`Failed to verify: ${error.message}`);
    }
  };

  // Submit Personal Details
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate callingNumber and WhatsApp number (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(localFormData.callingNumber)) {
      toast.error("callingNumber must be 10 digits and start with 6,7,8, or 9");
      return;
    }
    if (!phoneRegex.test(localFormData.whatsappNumber)) {
      toast.error("WhatsApp number must be 10 digits and start with 6,7,8, or 9");
      return;
    }
    const email = localFormData.email.toLowerCase();
    if (!email.endsWith("@gmail.com")) {
      toast.error("Please use a valid Gmail address (must end with @gmail.com)");
      return;
    }

    const payload = {
      ...localFormData,
      firebase_uid: currentUid,
      emailVerified
    };

    try {
      let response;
      if (isNewUser) {
        response = await axios.post(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      } else {
        response = await axios.put(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success("Personal details saved successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to save details");
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
        }`
      );
    }
  };

  // Optional file name display
  const handleFileChange = (e) => {
    const fileName = e.target.files[0]?.name || "Upload your profile image";
    const placeholderElement = document.querySelector(".file-placeholder");
    if (placeholderElement) {
      placeholderElement.textContent = fileName;
    }
  };


  return (
    <div className={`personal-details ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h6>Personal Details</h6>

          {/* Full Name */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="fullName"
              value={localFormData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              maxLength="50"
            />
            <span className="custom-tooltip">Full Name</span>
            </div>
          </div>

          {/* Profile Image Upload */}
          {photo && (
            <div className="form-group col-lg-6 col-md-12">
              <div className="uploadButton-input-wrap">
                <div className="input-wrapper">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="attachments[]"
                  accept="image/*"
                  id="upload-image"
                  style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                  onChange={(e) => {
                    imageFileHandler(e);
                    handleFileChange(e);
                  }}
                />
                <label
                  htmlFor="upload-image"
                  className="form-control file-upload-label"
                >
                  <span className="upload-text file-placeholder">
                    {imageFile ? imageFile.name : "Upload your profile image"}
                  </span>
                  <span className="file-button">Browse</span>
                </label>
                <span className="custom-tooltip">Profile Image</span>
                </div>
              </div>
            </div>
          )}

          {/* Email with verification */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-with-verification">
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={localFormData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                maxLength="50"
                required
                disabled={emailVerified}
              />
              <span className="custom-tooltip">Email address</span>
              </div>
              {emailVerified ? (
                <span className="verification-icon verified">
                  <FaCheckCircle color="green" />
                </span>
              ) : (
                <button
                  type="button"
                  className="verify-btn"
                  onClick={sendEmailOtp}
                  disabled={isEmailVerifying}
                >
                  {isEmailVerifying ? "Sending..." : "Verify"}
                </button>
              )}
            </div>
            {showEmailOtpInput && (
              <div className="otp-verification">
                <input
                  type="text"
                  placeholder="Enter OTP sent to your email"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  maxLength="6"
                />
                <button
                  type="button"
                  className="verify-otp-btn"
                  onClick={verifyEmailOtp}
                >
                  Submit
                </button>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <select
              name="gender"
              value={localFormData.gender}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
            <span className="custom-tooltip">Gender</span>
            </div>
          </div>

          {/* Date of Birth */}
          {dateOfBirth && (
              <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type={dateType}
                name="dateOfBirth"
                value={
                  localFormData.dateOfBirth
                    ? localFormData.dateOfBirth.split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                placeholder="Date of Birth"
                onFocus={handleFocusDate}
                onBlur={handleBlurDate}
                max={new Date().toISOString().split("T")[0]}
              />
              <span className="custom-tooltip">Date of Birth</span>
            </div>
          </div>
          )}

          {/* Calling Number with phone verification */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-with-verification">
            <div className="input-wrapper">
              <input
                type="text"
                name="callingNumber"
                value={localFormData.callingNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number (calling)"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                maxLength="10"
                required
                disabled={phoneVerified}
              />
              <span className="custom-tooltip">Mobile Number (calling)</span>
              </div>
              {phoneVerified ? (
                <span className="verification-icon verified">
                  <FaCheckCircle color="green" />
                </span>
              ) : (
                <button
                  type="button"
                  className="verify-btn"
                  onClick={sendPhoneOtp}
                >
                  Verify
                </button>
              )}
            </div>
            {showPhoneOtpInput && (
              <div className="otp-verification">
                <input
                  type="text"
                  placeholder="Enter OTP sent to your phone"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  maxLength="6"
                />
                <button
                  type="button"
                  className="verify-otp-btn"
                  onClick={verifyPhoneOtp}
                >
                  Submit
                </button>
              </div>
            )}
          </div>

          {/* WhatsApp Number */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type={whatsappType}
              name="whatsappNumber"
              value={localFormData.whatsappNumber}
              onChange={handleInputChange}
              onFocus={handleFocusWhatsapp}
              onBlur={handleBlurWhatsapp}
              placeholder="Mobile Number (WhatsApp)"
              onInput={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, "");
                if (newValue.length <= 10) {
                  e.target.value = newValue;
                } else {
                  e.target.value = newValue.slice(0, 10);
                }
              }}
              required
            />
            <span className="custom-tooltip">Mobile Number (WhatsApp)</span>
            </div>
          </div>

          {showWhatsappHint && (
            <small>Mobile number for calling and WhatsApp can be same</small>
          )}

          {/* Save Button */}
          <div className="form-group col-12">
            <button type="submit" className="theme-btn btn-style-three">
              Save personal details
            </button>
          </div>

          {/* "View Profile" Button */}
          {/* <div className="form-group col-12">
            <button
              type="button"
              className="theme-btn btn-style-three"
              onClick={handleViewProfile}
            >
              View Profile
            </button>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;