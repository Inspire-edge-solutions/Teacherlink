import React, { useState } from "react";
import axios from 'axios';

const PersonalDetails = () => {

  const [date, setDate] = useState('text');

  const handleFocus = () => setDate('date');
  const handleBlur = (event) => {
    if (!event.target.value) setDate('text');
  };

  const [whatsappType, setWhatsappType] = useState('text');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showWhatsappHint, setShowWhatsappHint] = useState(false);

  const handleFocusWhatsapp = () => {
    setWhatsappType('number');
    setShowWhatsappHint(true);
  };

  const handleBlurWhatsapp = (event) => {
    if (!event.target.value) {
      setWhatsappType('text');
    }
    setShowWhatsappHint(false);
  };

  // Add form data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    callingNumber: '',
    whatsappNumber: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission with Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data being sent:', formData); // Debug log
    
    try {
      const token = localStorage.getItem('token'); // Get token if you're using one
      console.log('Token:', token); // Debug log

      const response = await axios.post(
        'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token if required
          }
        }
      );

      console.log('Response:', response); // Debug log

      if (response.status === 200) {
        alert('Personal details updated successfully');
        console.log('Success:', response.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating personal details');
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <h3>Personal Details</h3>
        <div className="form-group col-lg-6 col-md-12">
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name" 
            required 
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="radio-group ">
            <h6>Gender</h6>
            <div className="radio-option">
              <input 
                type="radio" 
                id="male" 
                name="gender" 
                value="male"
                checked={formData.gender === 'male'}
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
                checked={formData.gender === 'female'}
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
                checked={formData.gender === 'transgender'}
                onChange={handleInputChange}
              />
              <label htmlFor="transgender">Transgender</label>
            </div>
          </div>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <input
            type={date}
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            placeholder="Date of Birth - dd/mm/yyyy"
            onFocus={handleFocus}
            onBlur={handleBlur}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            required
          />
        </div>
        
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="number"
            name="callingNumber"
            value={formData.callingNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number (calling)"
            maxLength="10"
            required
          />
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
            maxLength="10"
            required
          />
          {showWhatsappHint && (
            <small>
              Mobile number for calling and WhatsApp can be same
            </small>
          )}
        </div>

        <div className="form-group col-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save details
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalDetails;
