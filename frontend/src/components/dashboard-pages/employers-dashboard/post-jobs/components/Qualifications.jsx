import React, { useState } from 'react';
import Select from 'react-select';

const Qualifications = () => {
  const qualificationOptions = [
    { value: 'grade12', label: 'Grade 12' },
    { value: 'degree', label: 'Degree' },
    { value: 'masterDegree', label: 'Master Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'bed', label: 'B.Ed' }
  ];

  const [selectedQualifications, setSelectedQualifications] = useState({
    compulsory: [],
    optional: []
  });

  const handleCompulsoryChange = (selected) => {
    setSelectedQualifications(prev => ({
      ...prev,
      compulsory: selected || []
    }));
  };

  const handleOptionalChange = (selected) => {
    setSelectedQualifications(prev => ({
      ...prev,
      optional: selected || []
    }));
  };

  return (
    <>
    <div className="row">
    <div className="form-group col-lg-6 col-md-12">
        <label>Qualification</label>
        <Select
          isMulti
          name="compulsoryQualifications"
          options={qualificationOptions}
          value={selectedQualifications.compulsory}
          onChange={handleCompulsoryChange}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Qualifications"
        />
      </div>
     

      {/* Conditional Rendering for Grade 12 */}
      {selectedQualifications.compulsory.some(qual => qual.value === 'grade12') && (
        <div className="form-group col-lg-12 col-md-12">
          <label>Core Subjects (Grade 12)</label>
          <Select
            isMulti
            name="grade12Subjects"
            options={[
              { value: 'math', label: 'Mathematics' },
              { value: 'physics', label: 'Physics' },
              { value: 'chemistry', label: 'Chemistry' },
              // Add more subjects as needed
            ]}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Core Subjects"
          />
        </div>
      )}

      {/* Conditional Rendering for Degree */}
      {selectedQualifications.compulsory.some(qual => qual.value === 'degree') && (
        <>
          <div className="form-group col-lg-6 col-md-12">
            <label>Core Subjects (3 year degree)</label>
            <Select
              isMulti
              name="degreeSubjects3Year"
              options={[
                { value: 'cs', label: 'Computer Science' },
                { value: 'it', label: 'Information Technology' },
                // Add more subjects
              ]}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select Core Subjects"
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Specialization (4 year degree)</label>
            <Select
              isMulti
              name="degreeSpecialization4Year"
              options={[
                { value: 'ai', label: 'Artificial Intelligence' },
                { value: 'networking', label: 'Networking' },
                // Add more specializations
              ]}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Specialization"
            />
          </div>
        </>
      )}

      {/* Similar conditional blocks for Master's, Doctorate, and B.Ed */}
      {selectedQualifications.compulsory.some(qual => qual.value === 'masterDegree') && (
        <>
          <div className="form-group col-lg-6 col-md-12">
            <label>Core Subjects (Master's)</label>
            <Select
              isMulti
              name="masterSubjects"
              options={[
                // Add master's subjects
              ]}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Core Subjects"
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Specialization</label>
            <Select
              isMulti
              name="masterSpecialization"
              options={[
                // Add specializations
              ]}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Specialization"
            />
          </div>
        </>
         
      )}
      {/* Repeat similar blocks for Optional qualifications */}
      </div>


    <div className="row">
    <div className="form-group col-lg-6 col-md-12">
        <label>Qualification (Optional)</label>
        <Select
          isMulti
          name="optionalQualifications"
          options={qualificationOptions}
          value={selectedQualifications.optional}
          onChange={handleOptionalChange}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Qualifications"
        />
      </div>
      </div>
    </>
  );
};

export default Qualifications;
