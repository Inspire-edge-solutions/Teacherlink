import { React, useState } from "react";
import Select from "react-select";
import Address from "./address";
import Education from "./Education";
import Experience from "./experience";
import Languages from "./languages";
import ContactInfoBox from "../ContactInfoBox";
import "./profile-styles.css";

const FormInfoBox = () => {

  const catOptions = [
    { value: "Primary teacher", label: "Primary teacher" },
    { value: "High school teacher", label: "High school teacher" },
    { value: "Puc faculty", label: "Puc faculty" },
    { value: "NEET faculty", label: "NEET faculty" },
    { value: "CET faculty", label: "CET faculty" },
    { value: "JEE faculty", label: "JEE faculty" },
    { value: "Montessori teacher", label: "Montessori teacher" },
  ];

  
  return (
    <form action="#" className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
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
          <label>Gender</label>
          <div className="radio-group ">
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
          <label>Date of Birth</label>
          <input 
            type="date" 
            name="dateOfBirth"
            max={new Date().toISOString().split('T')[0]} // Prevents future dates
            required 
          />
        </div>
        

        {/* <!-- Input --> */}
      

        <Address />

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

        <Education />

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Current Salary(INR)</label>
          <select className="chosen-single form-select" required>
          <option>Less than 40K</option>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>More than 100K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Expected Salary(INR)</label>
          <select className="chosen-single form-select" required>
            <option>Less than 40K</option>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>More than 100K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <select className="chosen-single form-select" required>
            <option>Less than 1 year</option>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5-10 years</option>
            <option>More than 10 years</option>
          </select>
        </div>


        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job preferences </label>
          <Select
            defaultValue={[catOptions[1]]}
            isMulti
            name="colors"
            options={catOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            required
          />
        </div>

        <Experience/>

        <Languages/>

        <h3>Social Networks</h3><br/>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="name"
            placeholder="Facebook - www.facebook.com/your-id"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Linkedin - www.linkedin.com/your-id" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Instagram - www.instagram.com/your-id" required />
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <textarea placeholder="Profile Summary - Write brief description about yourself (max 100 words)"></textarea>
        </div>
       <ContactInfoBox/>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-center">
          <button type="submit" className="theme-btn btn-style-one">
            Save Profile
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
