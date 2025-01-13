import React from "react";
import Select from "react-select";

const Salary = () => {

    const catOptions = [
        { value: "Primary teacher", label: "Primary teacher" },
        { value: "High school teacher", label: "High school teacher" },
        { value: "Puc faculty", label: "Puc faculty" },
        { value: "NEET faculty", label: "NEET faculty" },
        { value: "CET faculty", label: "CET faculty" },
        { value: "JEE faculty", label: "JEE faculty" },
        { value: "Montessori teacher", label: "Montessori teacher" },
      ];

  return <div>
    <div className="row">
        <h3>Salary details and job preferences</h3>
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
        </div>
  </div>;
};

export default Salary;
