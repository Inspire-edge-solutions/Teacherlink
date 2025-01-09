import { React, useState } from "react";
import Select from "react-select";
import csc from "countries-states-cities";
import "./profile-styles.css";

const FormInfoBox = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [educationFields, setEducationFields] = useState([
    {
      degree: '',
      institution: '',
      yearOfPassing: '',
      percentage: ''
    }
  ]);

  const countries = csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const states = selectedCountry
    ? csc.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];

  const cities = selectedState
    ? csc.getCitiesOfState(selectedState.value).map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];
  

  const catOptions = [
    { value: "Primary teacher", label: "Primary teacher" },
    { value: "High school teacher", label: "High school teacher" },
    { value: "Puc faculty", label: "Puc faculty" },
    { value: "NEET faculty", label: "NEET faculty" },
    { value: "CET faculty", label: "CET faculty" },
    { value: "JEE faculty", label: "JEE faculty" },
    { value: "Montessori teacher", label: "Montessori teacher" },
  ];

  const handleAddEducation = () => {
    setEducationFields([...educationFields, {
      degree: '',
      institution: '',
      yearOfPassing: '',
      percentage: ''
    }]);
  };

  const handleEducationChange = (index, field, value) => {
    const newFields = [...educationFields];
    newFields[index][field] = value;
    setEducationFields(newFields);
  };

  const handleRemoveEducation = (index) => {
    const newFields = educationFields.filter((_, i) => i !== index);
    setEducationFields(newFields);
  };

  return (
    <form action="#" className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Jerome" required />
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
        

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address</label>
          <input
            type="text"
            name="email"
            placeholder="yourEmail@gmail.com"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
        
          <h3>Permanent address</h3><br/>
          <div className="form-group">
          <label>House no. & street</label>
          <input
            type="text"
            name="street"
            placeholder="Enter your permanent address"
            required
          />
        </div>

        <div className="form-group">
        <label>Country:</label>
        <Select
          options={countries}
          value={selectedCountry}
          onChange={(option) => {
            setSelectedCountry(option);
            setSelectedState(null); // Reset state when country changes
            setSelectedCity(null);  // Reset city when country changes
          }}
        />
      </div>
      <div className="form-group">
        <label>State:</label>
        <Select
          options={states}
          value={selectedState}
          onChange={(option) => {
            setSelectedState(option);
            setSelectedCity(null); // Reset city when state changes
          }}
        />
      </div>
      <div className="form-group">
        <label>City:</label>
        <Select
          options={cities}
          value={selectedCity}
          onChange={(option) => setSelectedCity(option)}
        />
      </div>
      </div>

      <div className="form-group col-lg-6 col-md-12">
        
          <h3>Present address</h3><br/>
          <div className="form-group">
          <label>House no. & street</label>
          <input
            type="text"
            name="street"
            placeholder="Enter your present address"
            required
          />
        </div>

        <div className="form-group">
        <label>Country:</label>
        <Select
          options={countries}
          value={selectedCountry}
          onChange={(option) => {
            setSelectedCountry(option);
            setSelectedState(null); // Reset state when country changes
            setSelectedCity(null);  // Reset city when country changes
          }}
        />
      </div>
      <div className="form-group">
        <label>State:</label>
        <Select
          options={states}
          value={selectedState}
          onChange={(option) => {
            setSelectedState(option);
            setSelectedCity(null); // Reset city when state changes
          }}
        />
      </div>
      <div className="form-group">
        <label>City:</label>
        <Select
          options={cities}
          value={selectedCity}
          onChange={(option) => setSelectedCity(option)}
        />
      </div>
      </div>

      <div className="form-group col-lg-6 col-md-12">
          <label>Mobile Number (calling)</label>
          <input
            type="number"
            name="calling"
            placeholder="+91 9606889003"
            required
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Mobile Number (WhatsApp)</label>
          <input
            type="number"
            name="whatsapp"
            placeholder="+91 9606889003"
            required
          />
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <h3>Education Details</h3>
          {educationFields.map((field, index) => (
            <div key={index} className="education-entry row">
              <div className="form-group col-lg-6 col-md-12">
                <label>Degree/Course</label>
                <input
                  type="text"
                  value={field.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Education"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <label>Institution</label>
                <input
                  type="text"
                  value={field.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Institution name"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <label>Year of Passing</label>
                <input
                  type="number"
                  value={field.yearOfPassing}
                  onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <label>Percentage/CGPA</label>
                <input
                  type="number"
                  value={field.percentage}
                  onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                  placeholder="Enter percentage or CGPA"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                />
              </div>

              {index > 0 && (
                <div className="form-group col-lg-12 col-md-12">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="theme-btn btn-style-one bg-danger"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          
          <div className="form-group col-lg-12 col-md-12">
            <button
              type="button"
              onClick={handleAddEducation}
              className="theme-btn btn-style-one"
            >
              Add More Education
            </button>
          </div>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Current Salary(INR)</label>
          <select className="chosen-single form-select" required>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>100-150 K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Expected Salary(INR)</label>
          <select className="chosen-single form-select" required>
            <option>120-350 K</option>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>100-150 K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <input type="text" name="name" placeholder="5-10 Years" required />
        </div>

        {/* <!-- Input --> */}
       

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Languages known</label>
          <input
            type="text"
            name="name"
            placeholder="English, Turkish"
            required
          />
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
        
        <h3>Social Network</h3><br/>
        <div className="form-group col-lg-6 col-md-12">
          <label>Facebook</label>
          <input
            type="text"
            name="name"
            placeholder="www.facebook.com/your-id"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Linkedin</label>
          <input type="text" name="name" placeholder="www.linkedin.com/your-id" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Instagram</label>
          <input type="text" name="name" placeholder="www.instagram.com/your-id" required />
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Profile Summary</label>
          <textarea placeholder="Write brief description about yourself (max 100 words)"></textarea>
        </div>
       
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
