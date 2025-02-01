import React, { useState } from 'react';
import Qualifications from './Qualifications';
import Experience from './Experience';
import Location from './Location';
import Details from './Details';
import Preferences from './Preferences';
import LocationMap from './LocationMap';

const Tutions = () => {

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

  return (
    <div>
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