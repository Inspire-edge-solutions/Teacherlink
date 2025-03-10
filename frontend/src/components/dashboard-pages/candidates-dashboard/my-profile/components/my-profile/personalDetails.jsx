import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PersonalDetails = ({ className, dateOfBirth }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Optional: if you want to pass user_id from the client, include it.
    // Otherwise, leave it empty so the backend can insert null.
    firebase_id: user.uid,
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    callingNumber: "",
    whatsappNumber: ""
  });

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

          {/* Gender Radio Buttons */}
          <div className="form-group col-lg-6 col-md-12">
            <div className={`radio-group ${!formData.gender ? "required" : ""}`}>
              <h6>Gender:</h6>
              <div className="radio-option">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="transgender"
                  name="gender"
                  value="transgender"
                  checked={formData.gender === "transgender"}
                  onChange={handleInputChange}
                />
                <label htmlFor="transgender">Transgender</label>
              </div>
            </div>
          </div>

          {dateOfBirth && (
            <div className="form-group col-lg-6 col-md-12">
              <input
                type={date}
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="Date of Birth - dd/mm/yyyy"
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