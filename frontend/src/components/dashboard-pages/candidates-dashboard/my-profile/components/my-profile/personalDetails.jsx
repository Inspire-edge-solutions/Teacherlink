import React from "react";

const PersonalDetails = () => {
  return <div>
     <div className="row">
        <h3>Personal Details</h3>
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Full Name" required />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="email"
            placeholder="Email address"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="radio-group ">
            <h5>Gender</h5>
            <div className="radio-option">
              <input 
                type="radio" 
                id="male" 
                name="gender" 
                value="male" 
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
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="transgender" 
                name="gender" 
                value="transgender" 
              />
              <label htmlFor="transgender">Transgender</label>
            </div>
          </div>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <input 
            type="date" 
            name="dateOfBirth"
            placeholder="Date of Birth - dd/mm/yyyy"
            max={new Date().toISOString().split('T')[0]} // Prevents future dates
            required 
          />
          <label>Date of Birth</label>
        </div>
        
        <div className="form-group col-lg-6 col-md-12">
        <input
          type="number"
          name="calling"
          placeholder="Mobile Number (calling)"
          required
        />
      </div>
      <div className="form-group col-lg-6 col-md-12">
        <input
          type="number"
          name="whatsapp"
          placeholder="Mobile Number (WhatsApp)"
          required
        />
      </div>
  </div>
  </div>
};

export default PersonalDetails;
