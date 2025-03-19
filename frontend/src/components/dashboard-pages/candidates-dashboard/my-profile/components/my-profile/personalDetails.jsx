// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../../../../../contexts/AuthContext";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaCheckCircle} from 'react-icons/fa';


// const PersonalDetails = ({ className, dateOfBirth,photo }) => {
//   const { user } = useAuth();
  
//   const [formData, setFormData] = useState({
//     firebase_uid: user?.uid || "",
//     fullName: user?.name || "",
//     email: user?.email || "",
//     gender: "",
//     dateOfBirth: "",
//     callingNumber: user?.phone_number || "",
//     whatsappNumber: ""
//   });
//   const [imageFile, setImageFile] = useState(null);
//   // This will store the row 'id' after inserting the image row
//   const [profilePicId, setProfilePicId] = useState(null);
//   // Add verification states
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
//   const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
//   const [emailOtp, setEmailOtp] = useState('');
//   const [phoneOtp, setPhoneOtp] = useState('');

//   const imageFileHandler = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };
//    // Convert file to Base64 string (for image uploads).
//    const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };
  
//   // Check if user has verified email/phone
//   useEffect(() => {
    
//     // Set verification state based on user data
//     if (user) {
//       setEmailVerified(user?.emailVerified || false);
//       setPhoneVerified(user?.phoneVerified || false);
//     }
//   }, [user]);

//   const [date, setDate] = useState("text");
//   const handleFocus = () => setDate("date");
//   const handleBlur = (e) => {
//     if (!e.target.value) setDate("text");
//   };

//   const [whatsappType, setWhatsappType] = useState("text");
//   const [showWhatsappHint, setShowWhatsappHint] = useState(false);

//   const handleFocusWhatsapp = () => {
//     setWhatsappType("text");
//     setShowWhatsappHint(true);
//   };

//   const handleBlurWhatsapp = (e) => {
//     if (!e.target.value) {
//       setWhatsappType("text");
//     }
//     setShowWhatsappHint(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//  const IMAGE_API_URL =
//     "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-image";
//     const uploadPhoto = async () => {
//       if (!imageFile) {
//         setMessage("Please select a photo file.");
//         return;
//       }
//       try {
//         setUploading(true);
//         setMessage("");
//         const base64Data = await fileToBase64(imageFile);
//         const payload = {
//           file: base64Data,
//           fileType: imageFile.type,
//           firebase_uid: user.uid, // Updated as per Address component reference
//         };
//         // Send POST to /upload-image
//         const response = await axios.post(IMAGE_API_URL, payload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         console.log("Photo submitted successfully:", response.data);
//         toast.success("Photo submitted successfully");
//         setMessage("Photo uploaded successfully!");
  
//         // Store the row 'id' for later usage when uploading the video
//         if (response.data.id) {
//           setProfilePicId(response.data.id);
//         }
//       } catch (error) {
//         console.error("Error uploading photo:", error);
//         toast.error("Error uploading photo");
//         setMessage("Photo upload error: " + error.message);
//       } finally {
//         setUploading(false);
//       }
//     };



//   // OTP handling functions
//   const sendEmailOtp = async () => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.post(
       
//         import.meta.env.VITE_CREATEOTP_API,
//         { email: formData.email },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         toast.success("OTP sent to your email!");
//         setShowEmailOtpInput(true);
//       }
//     } catch (error) {
//       toast.error(`Failed to send email OTP: ${error.message}`);
//     }
//   };

//   const sendPhoneOtp = async () => {
//     try {
//       // Validate phone number
//       if (formData.callingNumber.length !== 10) {
//         toast.error("Please enter a valid 10-digit mobile number");
//         return;
//       }
      
//       // Call your backend API that will use AWS SNS to send the SMS
//       const response = await axios.post(
//         "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/send-phone-otp",
//         { 
//           phone: formData.callingNumber,
//           countryCode: "+91" // Adjust as needed
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         toast.success("OTP sent to your phone!");
//         setShowPhoneOtpInput(true);
//       }
//     } catch (error) {
//       console.error("Phone OTP error:", error);
//       toast.error(`Failed to send OTP: ${error.message}`);
//     }
//   };

//   const verifyPhoneOtp = async () => {
//     try {
//       if (!phoneOtp || phoneOtp.length < 4) {
//         toast.error("Please enter a valid OTP");
//         return;
//       }
      
//       // Call your backend API to verify the OTP
//       const response = await axios.post(
//         "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/verify-phone-otp",
//         { 
//           phone: formData.callingNumber,
//           otp: phoneOtp 
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         toast.success("Phone number verified successfully!");
//         setPhoneVerified(true);
//         setShowPhoneOtpInput(false);
//       } else {
//         toast.error("Invalid or expired OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast.error(`Failed to verify: ${error.message}`);
//     }
//   };

//   const verifyEmailOtp = async () => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.post(
//         import.meta.env.VITE_VERIFYOTP_API,
//         { 
//           email: formData.email,
//           otp: emailOtp 
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );
      
//       if (response.status === 200) {
//         toast.success("Email verified successfully!");
//         setEmailVerified(true);
//         setShowEmailOtpInput(false);
//       }
//     } catch (error) {
//       toast.error(`Failed to verify email: ${error.message}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Prepare payload. If user_id is an empty string, remove it.
//     const payload = { ...formData };
//     if (!payload.user_id) delete payload.user_id;

//     try {
//       const response = await axios.post(
//         "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         toast.success("Personal details saved successfully!");
//       } else {
//         throw new Error(response.data?.message || "Failed to save details");
//       }
//     } catch (error) {
//       console.error("Error details:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         stack: error.stack
//       });
//       toast.error(
//         `Error: ${error.response?.data?.message || error.message || "Something went wrong"}`
//       );
//     }
//   };

//   // const handleFileChange = (e) => {
//   //   const fileName = e.target.files[0]?.name || "Upload your profile image";
//   //   document.querySelector('.file-placeholder').textContent = fileName;
//   // };

//   return (
//     <div className={`personal-details ${className}`}>
//       <form onSubmit={handleSubmit}>
//         <div className="row">
//           <h6>Personal Details</h6>
//           {/* Optionally, if you want to send user_id from the client, you can uncomment the next line */}
//           {/* <input type="hidden" name="user_id" value={formData.user_id} /> */}

//           <div className="form-group col-lg-6 col-md-12">
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="Full Name"
//               required
//               maxLength="50"
//             />
//           </div>
//           {photo && (
//           <div className="form-group col-lg-6 col-md-12">
//             <div className="uploadButton-input-wrap">
//               <input
//                 className="uploadButton-input"
//                 type="file"
//                 name="attachments[]"
//                 accept="image/*"
//                 id="upload-image"
//                 style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
//                 onChange={imageFileHandler}
//               />
//               <label 
//                 htmlFor="upload-image" 
//                 className="form-control file-upload-label"
//               >
//                 <span className="upload-text">
//                   {imageFile ? imageFile.name : "Upload your profile image"}
//                 </span>
//                 <span className="file-button">Browse</span>
               
//               </label>
//             </div>
//           </div>
//           )}

//           <div className="form-group col-lg-6 col-md-12">
//             <div className="input-with-verification">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Email address"
//                 maxLength="50"
//                 required
//                 disabled={emailVerified}
//               />
//               {emailVerified ? (
//                 <span className="verification-icon verified">
//                   <FaCheckCircle color="green" />
//                 </span>
//               ) : (
//                 <button 
//                   type="button" 
//                   className="verify-btn"
//                   onClick={sendEmailOtp}
//                 >
//                   Verify
//                 </button>
//               )}
//             </div>
//             {showEmailOtpInput && (
//               <div className="otp-verification">
//                 <input
//                   type="text"
//                   placeholder="Enter OTP sent to your email"
//                   value={emailOtp}
//                   onChange={(e) => setEmailOtp(e.target.value)}
//                   maxLength="6"
//                 />
//                 <button 
//                   type="button" 
//                   className="verify-otp-btn"
//                   onClick={verifyEmailOtp}
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Gender Dropdown (replacing radio buttons) */}
//           <div className="form-group col-lg-6 col-md-12">
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleInputChange}
//               className="form-select"
//               required
//             >
//               <option value="" disabled>Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="transgender">Transgender</option>
//             </select>
//           </div>

//           {dateOfBirth && (
//             <div className="form-group col-lg-6 col-md-12">
//               <input
//                 type={date}
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleInputChange}
//                 placeholder="Date of Birth"
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//                 max={new Date().toISOString().split("T")[0]}
//               />
//             </div>
//           )}

//           {/* Calling Number */}
//           <div className="form-group col-lg-6 col-md-12">
//             <div className="input-with-verification">
//               <input
//                 type="text"
//                 name="callingNumber"
//                 value={formData.callingNumber}
//                 onChange={handleInputChange}
//                 placeholder="Mobile Number (calling)"
//                 onInput={(e) => {
//                   e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                 }}
//                 maxLength="10"
//                 required
//                 disabled={phoneVerified}
//               />
//               {phoneVerified ? (
//                 <span className="verification-icon verified">
//                   <FaCheckCircle color="green" />
//                 </span>
//               ) : (
//                 <button 
//                   type="button" 
//                   className="verify-btn"
//                   onClick={sendPhoneOtp}
//                 >
//                   Verify
//                 </button>
//               )}
//             </div>
//             {showPhoneOtpInput && (
//               <div className="otp-verification">
//                 <input
//                   type="text"
//                   placeholder="Enter OTP sent to your phone"
//                   value={phoneOtp}
//                   onChange={(e) => setPhoneOtp(e.target.value)}
//                   maxLength="6"
//                 />
//                 <button 
//                   type="button" 
//                   className="verify-otp-btn"
//                   onClick={verifyPhoneOtp}
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* WhatsApp Number */}
//           <div className="form-group col-lg-6 col-md-12">
//             <input
//               type={whatsappType}
//               name="whatsappNumber"
//               value={formData.whatsappNumber}
//               onChange={handleInputChange}
//               onFocus={handleFocusWhatsapp}
//               onBlur={handleBlurWhatsapp}
//               placeholder="Mobile Number (WhatsApp)"
//               onInput={(e) => {
//                 const newValue = e.target.value.replace(/[^0-9]/g, "");
//                 if (newValue.length <= 10) {
//                   e.target.value = newValue;
//                 } else {
//                   e.target.value = newValue.slice(0, 10);
//                 }
//               }}
//               required
//             />
//           </div>

//           {showWhatsappHint && (
//             <small>
//               Mobile number for calling and WhatsApp can be same
//             </small>
//           )}
//           <div className="form-group col-12">
//             <button type="submit" className="theme-btn btn-style-three">
//               Save personal details
//             </button>
//           </div>

//           {/* Submit Button */}
         
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PersonalDetails;


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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Set verification flags on mount. These can come from your auth context or from a backend fetch.
  useEffect(() => {
    setEmailVerified(user?.emailVerified || false);
    setPhoneVerified(user?.phoneVerified || false);
  }, [user]);

  const [date, setDate] = useState("text");
  const handleFocus = () => setDate("date");
  const handleBlur = (e) => {
    if (!e.target.value) setDate("text");
  };

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
      setMessage("Photo upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // OTP handling functions

  const sendEmailOtp = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_DEV1_API + '/otp/create',
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Bearer `${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        setShowEmailOtpInput(true);
      }
    } catch (error) {
      toast.error(`Failed to send email OTP: ${error.message}`);
    }
  };

  const sendPhoneOtp = async () => {
    try {
      if (formData.callingNumber.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      const response = await axios.post(
        import.meta.env.VITE_DEV1_API + '/send-phone-otp',
        { 
          phone: formData.callingNumber,
          countryCode: "+91"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Bearer `${localStorage.getItem("token")}`
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
        import.meta.env.VITE_DEV1_API + '/verify-phone-otp',
        { 
          phone: formData.callingNumber,
          otp: phoneOtp 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Bearer `${localStorage.getItem("token")}`
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

  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_DEV1_API + '/otp/verify',  
        { 
          email: formData.email,
          otp: emailOtp 
        },
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: Bearer `${localStorage.getItem("token")}`
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
            Authorization: Bearer `${localStorage.getItem("token")}`
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

  const handleFileChange = (e) => {
    const fileName = e.target.files[0]?.name || "Upload your profile image";
    document.querySelector(".file-placeholder").textContent = fileName;
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
                  onChange={imageFileHandler}
                />
                <label 
                  htmlFor="upload-image" 
                  className="form-control file-upload-label"
                >
                  <span className="upload-text">
                    {imageFile ? imageFile.name : "Upload your profile image"}
                  </span>
                  <span className="file-button">Browse</span>
                </label>
              </div>
            </div>
          )}

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
                >
                  Verify
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

          <div className="form-group col-lg-6 col-md-12">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>

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
            <small>
              Mobile number for calling and WhatsApp can be same
            </small>
          )}
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