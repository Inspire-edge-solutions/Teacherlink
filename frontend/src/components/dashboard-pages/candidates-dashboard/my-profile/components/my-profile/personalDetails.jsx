import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
import "./profile-styles.css";

const PersonalDetails = ({ className, dateOfBirth, photo }) => {
  const { user } = useAuth();
  const currentUid = user?.uid; // UID from Firebase (for both email/password & Google)

  const [formData, setFormData] = useState({
    firebase_uid: currentUid || "",
    fullName: user?.name || "",
    email: user?.email || "",
    gender: "",
    dateOfBirth: "",
    callingNumber: user?.phone_number || "",
    whatsappNumber: ""
  });

  // State for image upload
  const [imageFile, setImageFile] = useState(null);
  const [profilePicId, setProfilePicId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  // Whether user record is new
  const [isNewUser, setIsNewUser] = useState(true);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  // Fetch user details from your backend
  const fetchUserDetails = useCallback(async () => {
    try {
      if (!currentUid) return;
      console.log("Fetching form data with current UID:", currentUid);
      const response = await axios.get(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
        { params: { firebase_uid: currentUid, t: Date.now() } }
      );
      if (response.status === 200 && response.data.length > 0) {
        const userData = response.data[0];
        setFormData({
          firebase_uid: currentUid,
          fullName: userData.fullName || "",
          email: userData.email || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          callingNumber: userData.callingNumber || "",
          whatsappNumber: userData.whatsappNumber || ""
        });
        setEmailVerified(userData.email_verify === 1);
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, [currentUid]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // For dateOfBirth toggling
  const [dateType, setDateType] = useState("text");
  const handleFocusDate = () => setDateType("date");
  const handleBlurDate = (e) => {
    if (!e.target.value) setDateType("text");
  };

  // For WhatsApp hint toggling
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && value !== formData.email) {
      setEmailVerified(false);
      setShowEmailOtpInput(false);
      setEmailOtp("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert file to Base64
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

  // File selection handlers
  const imageFileHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
  const handleFileChange = (e) => {
    const fileName = e.target.files[0]?.name || "Upload your profile image";
    const placeholderElement = document.querySelector(".file-placeholder");
    if (placeholderElement) {
      placeholderElement.textContent = fileName;
    }
  };

  // Function to check for duplicate email, callingNumber, and whatsappNumber
  const checkDuplicates = async () => {
    try {
      // Send GET request with filtering parameters.
      const response = await axios.get(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
        {
          params: {
            email: formData.email,
            callingNumber: formData.callingNumber,
            whatsappNumber: formData.whatsappNumber,
            t: Date.now()
          }
        }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        // Exclude your own record (if any) from duplicate check.
        const duplicates = response.data.filter(
          (record) => record.firebase_uid !== currentUid
        );
        const duplicateEmail = duplicates.find(
          (record) =>
            record.email &&
            record.email.toLowerCase() === formData.email.toLowerCase()
        );
        const duplicateCalling = duplicates.find(
          (record) => record.callingNumber === formData.callingNumber
        );
        const duplicateWhatsApp = duplicates.find(
          (record) => record.whatsappNumber === formData.whatsappNumber
        );
        if (duplicateEmail) {
          toast.error("Email already in use");
          return true;
        }
        if (duplicateCalling) {
          toast.error("Calling number already in use");
          return true;
        }
        if (duplicateWhatsApp) {
          toast.error("WhatsApp number already in use");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking duplicates:", error);
      // Optionally, you might decide to allow submission if the check fails.
      return false;
    }
  };

  // Email OTP functions (omitted for brevity; keep your existing OTP logic)
  const sendEmailOtp = async () => {
    try {
      const checkResponse = await axios.get(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal",
        { params: { email: formData.email, t: Date.now() } }
      );
      if (
        checkResponse.status === 200 &&
        Array.isArray(checkResponse.data) &&
        checkResponse.data.length > 0
      ) {
        const otherRecord = checkResponse.data.find(
          (record) =>
            record.email.toLowerCase() === formData.email.toLowerCase() &&
            record.firebase_uid !== currentUid
        );
        if (otherRecord) {
          toast.error("Email already in use");
          return;
        }
      }
    } catch (err) {
      console.error("Error checking email usage:", err);
    }
    try {
      setIsEmailVerifying(true);
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
          email: formData.email,
          otp: emailOtp,
          firebase_uid: formData.firebase_uid
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

  // Phone OTP functions (similar to your existing logic)
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

  // Submit personal details (main handler)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUid) {
      toast.error("No user is logged in. Cannot update profile.");
      return;
    }

    // Basic validations for phone numbers and email format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.callingNumber)) {
      toast.error("callingNumber must be 10 digits and start with 6,7,8, or 9");
      return;
    }
    if (!phoneRegex.test(formData.whatsappNumber)) {
      toast.error("WhatsApp number must be 10 digits and start with 6,7,8, or 9");
      return;
    }
    const emailLower = formData.email.toLowerCase();
    if (!emailLower.endsWith("@gmail.com")) {
      toast.error("Please use a valid Gmail address (must end with @gmail.com)");
      return;
    }

    // Check duplicates by calling GET /personal with filtering parameters.
    const duplicateFound = await checkDuplicates();
    if (duplicateFound) return; // Stop submission if a duplicate is found.

    // If a photo file is selected and not yet uploaded, upload it.
    if (imageFile && !profilePicId) {
      try {
        setUploading(true);
        setUploadMessage("Uploading photo...");
        const base64Data = await fileToBase64(imageFile);
        const payloadPhoto = {
          file: base64Data,
          fileType: imageFile.type,
          firebase_uid: currentUid
        };
        const responsePhoto = await axios.post(IMAGE_API_URL, payloadPhoto, {
          headers: { "Content-Type": "application/json" }
        });
        if (responsePhoto.data.id) {
          setProfilePicId(responsePhoto.data.id);
          setUploadMessage("Photo uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error("Photo upload error: " + error.message);
        setUploadMessage("Photo upload failed!");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Always ensure the payload includes the current firebase_uid.
    const payload = {
      ...formData,
      firebase_uid: currentUid,
      emailVerified,
      profilePicId: profilePicId || ""
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

        // Then update the login record.
        try {
          const loginPayload = {
            firebase_uid: currentUid,
            email: formData.email,
            name: formData.fullName,
            phone_number: formData.callingNumber
          };
          const loginResponse = await axios.put(
            "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/login",
            loginPayload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          if (!(loginResponse.status === 200 || loginResponse.status === 201)) {
            toast.error("Failed to update login details.");
          }
        } catch (loginError) {
          console.error("Login API error:", loginError);
          const errorMsg =
            loginError.response?.data?.message || loginError.message || "";
          if (errorMsg.toLowerCase().includes("email already in use")) {
            toast.error("Email already in use");
          } else if (
            errorMsg.toLowerCase().includes("duplicate") &&
            errorMsg.toLowerCase().includes("phone_number")
          ) {
            toast.error("Phone number already in use");
          } else {
            toast.error("Failed to update login details: " + errorMsg);
          }
        }
      } else {
        throw new Error(response.data?.message || "Failed to save details");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "";
      if (errorMsg.toLowerCase().includes("email already in use")) {
        toast.error("Email already in use");
      } else if (
        errorMsg.toLowerCase().includes("duplicate") &&
        (errorMsg.toLowerCase().includes("callingnumber") ||
          errorMsg.toLowerCase().includes("whatsappnumber"))
      ) {
        toast.error("Phone number already in use");
      } else {
        toast.error(
          `Error: ${
            error.response?.data?.message ||
            error.message ||
            "Something went wrong"
          }`
        );
      }
    }
  };

  return (
    <div className={`personal-details ${className}`}>
      {uploading && (
        <div style={{ marginBottom: "10px" }}>
          <span className="spinner-border spinner-border-sm" />{" "}
          <span>{uploadMessage}</span>
        </div>
      )}
      {!uploading && uploadMessage && (
        <div style={{ marginBottom: "10px" }}>{uploadMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* <h6>Personal Details</h6> */}

          {/* Full Name */}
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

          {/* Profile Image Upload */}
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
                type={dateType}
                name="dateOfBirth"
                value={
                  formData.dateOfBirth
                    ? formData.dateOfBirth.split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                placeholder="Date of Birth"
                onFocus={handleFocusDate}
                onBlur={handleBlurDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}

          {/* Calling Number */}
          <div className="form-group col-lg-6 col-md-12">
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
              minLength="10"
              required
              disabled={phoneVerified}
            />
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
                e.target.value =
                  newValue.length <= 10 ? newValue : newValue.slice(0, 10);
              }}
              required
            />
          </div>

          {showWhatsappHint && (
            <small>Mobile number for calling and WhatsApp can be same</small>
          )}

          {/* Save Personal Details Button */}
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

PersonalDetails.propTypes = {
  className: PropTypes.string,
  dateOfBirth: PropTypes.bool,
  photo: PropTypes.bool
};

export default PersonalDetails;