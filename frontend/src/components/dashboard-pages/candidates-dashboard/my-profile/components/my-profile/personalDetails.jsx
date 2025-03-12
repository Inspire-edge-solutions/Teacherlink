import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PersonalDetails = ({ className, dateOfBirth }) => {
  const { user } = useAuth();
  
  
  const [formData, setFormData] = useState({
    firebase_uid: user?.uid || "",
    fullName: "",
    email: user?.email || "",
    gender: "",
    dateOfBirth: "",
    callingNumber: "",
    whatsappNumber: ""
  });
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare payload. If user_id is an empty string, remove it.
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

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          // Try to fetch user profile data from your API
          // You'll need to adjust this URL to match your actual API endpoint
          const response = await axios.get(
            `https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/users/profile/${firebase_uid.uid}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          console.log("Profile data:", response.data);
          
          if (response.data) {
            // Update form data with profile data from API
            setFormData({
              firebase_uid: user.uid,
              fullName: response.data.name || "",
              email: response.data.email || user.email || "",
              gender: response.data.gender || "",
              dateOfBirth: response.data.dateOfBirth || response.data.dob || "",
              callingNumber: response.data.phone_number || "",
              whatsappNumber: response.data.whatsapp_number || response.data.phone_number || ""
            });
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          // If API call fails, try to use any data available in the user object
          setFormData({
            firebase_uid: user.uid,
            fullName: user.displayName || "",
            email: user.email || "",
            gender: "",
            dateOfBirth: "",
            callingNumber: "",
            whatsappNumber: ""
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="text-center py-4">Loading profile data...</div>;
  }

  return (
    <div className={`personal-details ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h3>Personal Details</h3>
          {/* Optionally, if you want to send user_id from the client, you can uncomment the next line */}
          {/* <input type="hidden" name="user_id" value={formData.user_id} /> */}

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

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              maxLength="50"
              required
            />
          </div>

          {/* Gender Dropdown (replacing radio buttons) */}
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
              required
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

          {/* Submit Button */}
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