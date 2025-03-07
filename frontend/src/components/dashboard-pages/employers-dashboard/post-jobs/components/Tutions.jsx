import React, { useState } from 'react';
import Select from 'react-select';
import Qualifications from './Qualifications';
import Experience from './Experience';
import Location from './Location';
import Details from './Details';
import Preferences from './Preferences';
import LocationMap from './LocationMap';

const Tutions = () => {

  const tutionTypes = [
    { value: "Home Tuitions Offline (One-One at students home)", label: "Home Tuitions Offline (One-One at students home)" },
    { value: "Private Tuitions Offline (One-One at teachers home)", label: "Private Tuitions Offline (One-One at teachers home)" },
    { value: "Group Tuitions Offline (at teachers home)", label: "Group Tuitions Offline (at teachers home)" },
    { value: "Private Tuitions Online (One-One)", label: "Private Tuitions Online (One-One)" },
    { value: "Group Tuitions Online (from teacher as tuitions)", label: "Group Tuitions Online (from teacher as tuitions)" }
  ];

  const [salaryRange, setSalaryRange] = useState({
    minSalary: '',
    maxSalary: ''
  });
  const [errors, setErrors] = useState({
    minSalary: '',
    maxSalary: '',
  });

  const validateInput = (name, value) => {
    if (!value) {
      return `${name === 'minSalary' ? 'Minimum' : 'Maximum'} salary is required`;
    }
    if (value <= 0) {
      return 'Salary must be greater than 0';
    }
    if (name === 'maxSalary' && parseFloat(value) <= parseFloat(salaryRange.minSalary)) {
      return 'Maximum salary must be greater than minimum salary';
    }
    return '';
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }

  const [selectedTutions, setSelectedTutions] = useState([]);

  const handleTutionTypesChange = (selectedOptions) => {
    setSelectedTutions(selectedOptions);
  };

  return (
    <div>
      <div className="form-group">
        <Select
          isMulti
          options={tutionTypes}
          value={selectedTutions}
          onChange={handleTutionTypesChange}
          className="custom-select"
          placeholder="Select Tution Types"
          isClearable
        />
      </div>
      <Qualifications/>
      <Experience/>
      <div className="form-group">
        <div className="row">
          <div className="col-md-6">
            <input
              type="number"
              name="minSalary"
              placeholder="Minimum Salary per hour"
              className={`form-control ${errors.minSalary ? 'is-invalid' : ''}`}
              value={salaryRange.minSalary}
              onChange={handleChange}
            />
            {errors.minSalary && (
              <div className="invalid-feedback">{errors.minSalary}</div>
            )}
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="maxSalary"
              placeholder="Maximum Salary per hour"
              className={`form-control ${errors.maxSalary ? 'is-invalid' : ''}`}
              value={salaryRange.maxSalary}
              onChange={handleChange}
            />
            {errors.maxSalary && (
              <div className="invalid-feedback">{errors.maxSalary}</div>
            )}
          </div>
        </div>
      </div>

      <Location/>
      <Details excludeJobSubCategory={false} excludeJobType={true} />
      <Preferences/>
      <LocationMap/>
    </div>
  );
};

export default Tutions;