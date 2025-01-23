import { useState } from "react";
import Select from "react-select";
import "./postJobs.css";

const Experience = ({ onChange }) => {
  const [experienceData, setExperienceData] = useState({
    totalExperience: { min: null, max: null },
    teachingExperience: { min: null, max: null },
    educationTeachingFull: { min: null, max: null },
    educationTeachingPart: { min: null, max: null },
    educationAdminFull: { min: null, max: null },
    educationAdminPart: { min: null, max: null },
    nonEducationFull: { min: null, max: null },
    nonEducationPart: { min: null, max: null }
  });

  const yearOptions = Array.from({ length: 32 }, (_, i) => ({
    value: i === 31 ? '>30' : i,
    label: `${i} Years`
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: `${i} Months`
  }));

  const handleExperienceChange = (field, type, value) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }));

    onChange?.(experienceData);
  };

  const ExperienceRow = ({ label, field }) => (
    <div className="experience-row">
      <div className="category-cell">{label}</div>
      <div className="inputs-cell">
        <div className="min-max-container">
          <div className="year-month-group">
            <Select
              placeholder="0 Years"
              options={yearOptions}
              onChange={(option) => handleExperienceChange(field, 'min', {
                ...experienceData[field].min,
                years: option?.value
              })}
              classNamePrefix="select"
            />
            <Select
              placeholder="0 Months"
              options={monthOptions}
              onChange={(option) => handleExperienceChange(field, 'min', {
                ...experienceData[field].min,
                months: option?.value
              })}
              classNamePrefix="select"
            />
          </div>
          <div className="year-month-group">
            <Select
              placeholder="0 Years"
              options={yearOptions}
              onChange={(option) => handleExperienceChange(field, 'max', {
                ...experienceData[field].max,
                years: option?.value
              })}
              classNamePrefix="select"
            />
            <Select
              placeholder="0 Months"
              options={monthOptions}
              onChange={(option) => handleExperienceChange(field, 'max', {
                ...experienceData[field].max,
                months: option?.value
              })}
              classNamePrefix="select"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="experience-table">
      <div className="table-header">
        <div className="category-header">Experience Category</div>
        <div className="min-max-header">
          <div>Min</div>
          <div>Max</div>
        </div>
      </div>
      
      <div className="table-body">
        <ExperienceRow 
          label="All Experience (Full Time + Part Time)" 
          field="totalExperience"
        />
        <ExperienceRow 
          label="Teaching Experience (Full Time + Part Time)" 
          field="teachingExperience"
        />
        <ExperienceRow 
          label="Education - Teaching (Full Time)" 
          field="educationTeachingFull"
        />
        <ExperienceRow 
          label="Education - Teaching (Part Time)" 
          field="educationTeachingPart"
        />
        <ExperienceRow 
          label="Education - Administration (Full Time)" 
          field="educationAdminFull"
        />
        <ExperienceRow 
          label="Education - Administration (Part Time)" 
          field="educationAdminPart"
        />
        <ExperienceRow 
          label="Non-Education - Any Role (Full Time)" 
          field="nonEducationFull"
        />
        <ExperienceRow 
          label="Non-Education - Any Role (Part Time)" 
          field="nonEducationPart"
        />
      </div>
    </div>
  );
};

export default Experience;
