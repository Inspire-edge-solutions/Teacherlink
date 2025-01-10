import React, { useState } from "react";

const Education = () => {

    const [educationFields, setEducationFields] = useState([
        {
          degree: '',
          institution: '',
          yearOfPassing: '',
          percentage: ''
        }
      ]);

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
    <div>
      <div className="form-group col-lg-12 col-md-12">
          <h3>Education Details</h3>
          {educationFields.map((field, index) => (
            <div key={index} className="education-entry row">
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={field.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="Degree/Course"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={field.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Institution name"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="number"
                  value={field.yearOfPassing}
                  onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
                  placeholder="Year of Passing - YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="number"
                  value={field.percentage}
                  onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                  placeholder="Percentage/CGPA"
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
               <div className="form-group col-lg-12 col-md-12">
            <button
              type="button"
              onClick={handleAddEducation}
              className="theme-btn btn-style-three"
            >
              Add More Education
            </button>
          </div>
            </div>
            
          ))}
          
         
        </div>
    </div>
  );
};

export default Education;
