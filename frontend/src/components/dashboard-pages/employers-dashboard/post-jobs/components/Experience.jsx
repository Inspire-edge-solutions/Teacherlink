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
    value: i === 31 ? '>30 years' : i,
    label: i === 31 ? '>30 years' : `${i} Years`
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
    <div className="row align-items-center mb-3 py-2 border-bottom">
      <div className="col-md-4 mb-2 mb-md-0">
        <div className="fw-500">{label}</div>
      </div>
      <div className="col-md-8">
        <div className="row">
          {/* Minimum Experience */}
          <div className="col-md-6 mb-2 mb-md-0">
            <div className="row g-2">
              <div className="col-6">
                <Select
                  placeholder="Years"
                  options={yearOptions}
                  onChange={(option) => handleExperienceChange(field, 'min', {
                    ...experienceData[field].min,
                    years: option?.value
                  })}
                />
              </div>
              <div className="col-6">
                <Select
                  placeholder="Months"
                  options={monthOptions}
                  onChange={(option) => handleExperienceChange(field, 'min', {
                    ...experienceData[field].min,
                    months: option?.value
                  })}
                />
              </div>
            </div>
          </div>
          {/* Maximum Experience */}
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <Select
                  placeholder="Years"
                  options={yearOptions}
                  onChange={(option) => handleExperienceChange(field, 'max', {
                    ...experienceData[field].max,
                    years: option?.value
                  })}
                />
              </div>
              <div className="col-6">
                <Select
                  placeholder="Months"
                  options={monthOptions}
                  onChange={(option) => handleExperienceChange(field, 'max', {
                    ...experienceData[field].max,
                    months: option?.value
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header bg-light">
        <div className="row">
          <div className="col-md-4">
            <strong>Experience Category</strong>
          </div>
          <div className="col-md-8">
            <div className="row text-center">
              <div className="col-md-6">Minimum</div>
              <div className="col-md-6">Maximum</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body">
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
