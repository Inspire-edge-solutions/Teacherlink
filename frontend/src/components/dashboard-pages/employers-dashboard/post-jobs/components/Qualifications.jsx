import { useState } from "react";
import Select from "react-select";

const Qualifications = ({ onChange }) => {
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedOptionalQualification, setSelectedOptionalQualification] = useState(null);

  const qualificationOptions = [
    { value: "grade12", label: "Grade 12" },
    { value: "degree", label: "Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "bed", label: "B.Ed" },
  ];

  const subjectOptions = {
    grade12: [{ value: "core_subjects", label: "Core Subjects" }],
    degree: [
      { value: "core_subjects_3year", label: "Core Subjects (3 year degree)" },
      { value: "specialization_4year", label: "Specialization (4 year degree)" },
    ],
    masters: [
      { value: "core_subjects", label: "Core Subjects" },
      { value: "specialization", label: "Specialization" },
    ],
    doctorate: [
      { value: "core_specialization", label: "Core Subjects/Specialization" },
    ],
    bed: [{ value: "specialized_subjects", label: "Specialized Subjects" }],
  };

  const handleQualificationChange = (option) => {
    setSelectedQualification(option);
    onChange?.({ qualification: option?.value, subjects: [] });
  };

  const handleSubjectsChange = (options) => {
    onChange?.({ 
      qualification: selectedQualification?.value, 
      subjects: options.map(option => option.value) 
    });
  };

  const handleOptionalQualificationChange = (option) => {
    setSelectedOptionalQualification(option);
    onChange?.({ 
      required: { qualification: selectedQualification?.value, subjects: [] },
      optional: { qualification: option?.value, subjects: [] }
    });
  };

  const handleOptionalSubjectsChange = (options) => {
    onChange?.({ 
      required: {
        qualification: selectedQualification?.value,
        subjects: selectedSubjects
      },
      optional: {
        qualification: selectedOptionalQualification?.value,
        subjects: options.map(option => option.value)
      }
    });
  };

  return (
    <div className="form-group">
      <div className="row">
        <div className="form-group col-lg-6 col-md-12">
          <Select
            placeholder="Qualification"
            options={qualificationOptions}
            onChange={handleQualificationChange}
            value={selectedQualification}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {selectedQualification && (
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Core Subjects"
              options={subjectOptions[selectedQualification.value]}
              onChange={handleSubjectsChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        )}
      </div>

      <div className="row mt-3">
        <div className="form-group col-lg-6 col-md-12">
          <Select
            placeholder="Optional Qualification"
            options={qualificationOptions}
            onChange={handleOptionalQualificationChange}
            value={selectedOptionalQualification}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {selectedOptionalQualification && (
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="core Subjects"
              options={subjectOptions[selectedOptionalQualification.value]}
              onChange={handleOptionalSubjectsChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Qualifications;
