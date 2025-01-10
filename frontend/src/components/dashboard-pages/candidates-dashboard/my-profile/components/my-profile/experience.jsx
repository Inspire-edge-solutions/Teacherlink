import React, { useState } from 'react';
import './profile-styles.css';

const Experience = () => {
  const [experiences, setExperiences] = useState([{
    currentlyWorking: null,
  }]);

  // New separate state for teaching experience
  const [teachingExperience, setTeachingExperience] = useState({
    edTechCompany: null,
    online: null,
    coachingCenters: null,
    groupTuitions: null,
    privateTuitions: null,
    homeTuitions: null
  });

  // Update handler for teaching experience
  const handleTeachingExperienceChange = (field) => {
    setTeachingExperience(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const addNewExperience = () => {
    setExperiences(prev => [...prev, {
      currentlyWorking: null,
    }]);
  };

  const removeExperience = (index) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="form-group">
      <h3>Experience Details</h3>
      
      {experiences.map((experience, index) => (
        <div key={index} className="experience-entry">
          <div className="experience-header">
            <h4>Experience {index + 1}</h4>
            {experiences.length > 1 && (
              <button 
                type="button" 
                className="remove-experience"
                onClick={() => removeExperience(index)}
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="row">
            {/* Organization Name */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Name of the organization"
                maxLength={20}
                className="form-control"
              />
            </div>

            {/* Job Category */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="radio-group">
                <label>
                  <input type="radio" name="jobCategory" value="fullTime" /> Full Time
                </label>
                <label>
                  <input type="radio" name="jobCategory" value="partTime" /> Part Time
                </label>
              </div>
            </div>

            {/* Job Type */}
            <div className="form-group col-lg-6 col-md-12">
              <select className="form-control">
                <option value="">Select Job Type</option>
                <option value="teaching">Education - Teaching</option>
                <option value="administration">Education - Administration</option>
                <option value="both">Education - Teaching + Administration</option>
                <option value="nonEducation">Non-Education (Any Role)</option>
              </select>
            </div>

            {/* Currently Working */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="radio-group">
                <label> Currently Working : 
                  <input
                    type="radio"
                    name="currentlyWorking"
                    checked={experience.currentlyWorking}
                    onChange={() => experience.currentlyWorking = true}
                  /> Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="currentlyWorking"
                    checked={!experience.currentlyWorking}
                    onChange={() => experience.currentlyWorking = false}
                  /> No
                </label>
              </div>
            </div>

            {/* Work Duration */}
            
              <div className="form-group col-lg-6 col-md-12">
                <label>Worked from </label>
              <input 
            type="date" 
            name="worked-from"
            max={new Date().toISOString().split('T')[0]} // Prevents future dates
            required 
          />
         
              </div>
              <div className="form-group col-lg-6 col-md-12">
              <label>Worked till </label>
              <input 
            type="date" 
            name="worked-till"
            max={new Date().toISOString().split('T')[0]} // Prevents future dates
            required 
          />
              </div>
            

            {/* Salary */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Salary (LPA for Full Time / Per Hour for Part Time)"
              />
            </div>

            {/* Upload Pay Slip */}
            <div className="form-group col-lg-6 col-md-12">
              <label>Upload Pay Slip 
              <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" />
              </label>
            </div>

            {/* Designation */}
            <div className="form-group col-lg-6 col-md-12">
              <select className="form-control">
                <option value="">Select Designation</option>
                <option value="nurseryTeacher">Nursery Teacher</option>
                <option value="montessoriTeacher">Montessori Teacher</option>
                <option value="neetFaculty">NEET faculty</option>
                <option value="jeeFaculty">JEE faculty</option>
                <option value="cetFaculty">CET faculty</option>
              </select>
            </div>

            {/* Curriculum/Board/University */}
            <div className="form-group col-lg-6 col-md-12">
              <select className="form-control">
                <option value="">Select Board</option>
                <option value="stateBoard">State Board</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="university">Affiliated University</option>
                <option value="deemed">Deemed University</option>
              </select>
            </div>

            {/* Job Process */}
            <div className="form-group col-lg-6 col-md-12">
              <select className="form-control">
                <option value="">Select Job Process</option>
                <option value="regular">Regular (Offline)</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          <button 
        type="button" 
        className="theme-btn btn-style-three"
        onClick={addNewExperience}
      >
        Add Another Experience
      </button>

        </div>
      ))}

      
      {/* Other Teaching Experience section */}
    
      <div className="form-group col-lg-12 col-md-12">
        <h4>Other Teaching Experiences</h4>
        <div className="teaching-experience-grid">
          {/* Ed. Tech Company */}
          <div className="experience-item">
            <label>Ed. Tech Company:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.edTechCompany === true}
                  onChange={() => handleTeachingExperienceChange('edTechCompany')}
                  name="edTechCompany"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.edTechCompany === false}
                  onChange={() => handleTeachingExperienceChange('edTechCompany')}
                  name="edTechCompany"
                /> No
              </label>
            </div>
          </div>

          {/* Online */}
          <div className="experience-item">
            <label>Online:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.online === true}
                  onChange={() => handleTeachingExperienceChange('online')}
                  name="online"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.online === false}
                  onChange={() => handleTeachingExperienceChange('online')}
                  name="online"
                /> No
              </label>
            </div>
          </div>

          {/* Coaching Centers */}
          <div className="experience-item">
            <label>Coaching Centers:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.coachingCenters === true}
                  onChange={() => handleTeachingExperienceChange('coachingCenters')}
                  name="coachingCenters"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.coachingCenters === false}
                  onChange={() => handleTeachingExperienceChange('coachingCenters')}
                  name="coachingCenters"
                /> No
              </label>
            </div>
          </div>

          {/* Group Tuitions */}
          <div className="experience-item">
            <label>Group Tuitions:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.groupTuitions === true}
                  onChange={() => handleTeachingExperienceChange('groupTuitions')}
                  name="groupTuitions"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.groupTuitions === false}
                  onChange={() => handleTeachingExperienceChange('groupTuitions')}
                  name="groupTuitions"
                /> No
              </label>
            </div>
          </div>

          {/* Private Tuitions */}
          <div className="experience-item">
            <label>Private Tuitions:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.privateTuitions === true}
                  onChange={() => handleTeachingExperienceChange('privateTuitions')}
                  name="privateTuitions"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.privateTuitions === false}
                  onChange={() => handleTeachingExperienceChange('privateTuitions')}
                  name="privateTuitions"
                /> No
              </label>
            </div>
          </div>

          {/* Home Tuitions */}
          <div className="experience-item">
            <label>Home Tuitions:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.homeTuitions === true}
                  onChange={() => handleTeachingExperienceChange('homeTuitions')}
                  name="homeTuitions"
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={teachingExperience.homeTuitions === false}
                  onChange={() => handleTeachingExperienceChange('homeTuitions')}
                  name="homeTuitions"
                /> No
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
