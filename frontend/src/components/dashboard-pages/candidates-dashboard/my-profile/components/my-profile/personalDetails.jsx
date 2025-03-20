import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";

const PersonalDetails = ({ className, dateOfBirth, photo }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firebase_uid: user?.uid || "",
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

  // Use the API-provided property name: email_verify (if your backend returns that).
  // Otherwise, if your backend returns "emailVerified", adjust accordingly.
  useEffect(() => {
    setEmailVerified(user?.email_verify || false);
    // If phone verification is also stored in your DB, adjust accordingly.
    setPhoneVerified(user?.phoneVerified || false);
  }, [user]);

  // State and handlers for dateOfBirth input toggling
  const [date, setDate] = useState("text");
  const handleFocus = () => setDate("date");
  const handleBlur = (e) => {
    if (!e.target.value) setDate("text");
  };

  // State and handlers for WhatsApp hint toggling
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

  // Generic input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Image file handling and conversion
  const imageFileHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Example image upload endpoint
  const IMAGE_API_URL = "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-image";

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
        firebase_uid: user.uid
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

  // ---- OTP handling functions ----

  // Send Email OTP
  const sendEmailOtp = async () => {
    try {
      setIsEmailVerifying(true); // show loading state
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/create`,
        { email: formData.email },
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
      console.log(error);
      toast.error(`Failed to send email OTP: ${error.message}`);
    } finally {
      setIsEmailVerifying(false); // hide loading state
    }
  };

  // Verify Email OTP
  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/verify`,
        {
          email: formData.email,
          otp: emailOtp
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

  // Send Phone OTP
  const sendPhoneOtp = async () => {
    try {
      if (formData.callingNumber.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/send-phone-otp`,
        { 
          phone: formData.callingNumber,
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

  // Verify Phone OTP
  const verifyPhoneOtp = async () => {
    try {
      if (!phoneOtp || phoneOtp.length < 4) {
        toast.error("Please enter a valid OTP");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/verify-phone-otp`,
        {
          phone: formData.callingNumber,
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

  // ---- Submit Personal Details ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.user_id) delete payload.user_id;

    try {
      const response = await axios.post(
        "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

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
        `Error: ${error.response?.data?.message || error.message || "Something went wrong"}`
      );
    }
  };

  // Optional file name display (if needed for a placeholder element)
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

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              maxLength="50"
            />
          </div>

          {photo && (
            <div className="form-group col-lg-6 col-md-12">
              <div className="uploadButton-input-wrap">
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
              </div>
            </div>
          )}

          {/* Email with verification */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-with-verification">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                maxLength="50"
                required
                disabled={emailVerified}
              />
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
            <select
              name="gender"
              value={formData.gender}
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
          </div>

          {/* Date of Birth */}
          {dateOfBirth && (
            <div className="form-group col-lg-6 col-md-12">
              <input
                type={date}
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="Date of Birth"
                onFocus={handleFocus}
                onBlur={handleBlur}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}

          {/* Calling Number with phone verification */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-with-verification">
              <input
                type="text"
                name="callingNumber"
                value={formData.callingNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number (calling)"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                maxLength="10"
                required
                disabled={phoneVerified}
              />
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
            <input
              type={whatsappType}
              name="whatsappNumber"
              value={formData.whatsappNumber}
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
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;