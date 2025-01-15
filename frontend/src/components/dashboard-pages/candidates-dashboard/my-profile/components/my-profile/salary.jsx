import React, { useState } from "react";
import Select from "react-select";

const Salary = () => {
  // State for all form fields
  const [salaryDetails, setSalaryDetails] = useState({
    currentSalary: "",
    expectedSalary: "",
    experience: "",
    jobPreferences: []
  });

  // Options for dropdowns
  const salaryRanges = [
    { value: "less_than_40k", label: "Less than 40K" },
    { value: "40k_70k", label: "40-70 K" },
    { value: "50k_80k", label: "50-80 K" },
    { value: "60k_90k", label: "60-90 K" },
    { value: "70k_100k", label: "70-100 K" },
    { value: "more_than_100k", label: "More than 100K" }
  ];

  const experienceOptions = [
    { value: "less_than_1", label: "Less than 1 year" },
    { value: "1_3_years", label: "1-3 years" },
    { value: "3_5_years", label: "3-5 years" },
    { value: "5_10_years", label: "5-10 years" },
    { value: "more_than_10", label: "More than 10 years" }
  ];

  const jobPreferenceOptions = [
    { value: "primary_teacher", label: "Primary teacher" },
    { value: "high_school_teacher", label: "High school teacher" },
    { value: "puc_faculty", label: "Puc faculty" },
    { value: "neet_faculty", label: "NEET faculty" },
    { value: "cet_faculty", label: "CET faculty" },
    { value: "jee_faculty", label: "JEE faculty" },
    { value: "montessori_teacher", label: "Montessori teacher" }
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", salaryDetails);
    // Add your API call here
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h3>Salary details and job preferences</h3>
          
          {/* Current Salary */}
          <div className="form-group col-lg-6 col-md-12">
            <select 
              className="chosen-single form-select" 
              required
              value={salaryDetails.currentSalary}
              onChange={(e) => setSalaryDetails(prev => ({
                ...prev,
                currentSalary: e.target.value
              }))}
            >
              <option value="">Select current salary(INR)</option>
              {salaryRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Salary */}
          <div className="form-group col-lg-6 col-md-12">
            <select 
              className="chosen-single form-select" 
              required
              value={salaryDetails.expectedSalary}
              onChange={(e) => setSalaryDetails(prev => ({
                ...prev,
                expectedSalary: e.target.value
              }))}
            >
              <option value="">Select expected salary(INR)</option>
              {salaryRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="form-group col-lg-6 col-md-12">
            <select 
              className="chosen-single form-select" 
              placeholder="Select Experience"
              required
              value={salaryDetails.experience}
              onChange={(e) => setSalaryDetails(prev => ({
                ...prev,
                experience: e.target.value
              }))}
            >
              <option value="">Select experience</option>
              {experienceOptions.map(exp => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Preferences */}
          <div className="form-group col-lg-6 col-md-12">
            
            <Select
              isMulti
              name="jobPreferences"
              options={jobPreferenceOptions}
              placeholder="Select job preferences"
              className="basic-multi-select"
              classNamePrefix="select"
              value={salaryDetails.jobPreferences}
              onChange={(selected) => setSalaryDetails(prev => ({
                ...prev,
                jobPreferences: selected
              }))}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Salary;