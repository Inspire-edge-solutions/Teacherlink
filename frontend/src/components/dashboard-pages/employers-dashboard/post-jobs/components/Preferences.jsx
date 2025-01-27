import React, { useState } from 'react';
import Select from 'react-select';

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    gender: '',
    ageMin: '',
    ageMax: '',
    domicileState: [],
    presentResidingState: [],
    languagesKnown: {
      speak: [],
      read: [],
      write: []
    },
    computerSkills: [],
    knowledgeOfAccounting: '',
    noticePeriod: '',
    jobSearchStatus: ''
  });

  const stateOptions = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'maharashtra', label: 'Maharashtra' },
    // Add more states as needed
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    // Add more languages as needed
  ];

  const computerSkillsOptions = [
    { value: 'basic', label: 'Basic Knowledge' },
    { value: 'word', label: 'Word' },
    { value: 'excel', label: 'Excel' },
    { value: 'ppt', label: 'PPT' },
    { value: 'erp', label: 'ERP' },
    { value: 'tally', label: 'Tally' },
  ];

  const handleInputChange = (name, value) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Form data:', preferences);

    try {
      console.log('Making API request...');
      const response = await axios.post(
        'YOUR_API_ENDPOINT/preferences',
        preferences,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('API Response received:', response);

      if (response.data.success) {
        console.log('Success response received');
        alert('Preferences saved successfully!');
      }
    } catch (error) {
      console.log('Error occurred during submission');
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('Failed to save preferences');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="default-form">
      <div className="row">
        {/* Gender */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            value={preferences.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="form-control"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="transgender">Transgender</option>
          </select>
        </div>

        {/* Age Range */}
        <div className="form-group col-lg-3 col-md-12">
          <input
            type="number"
            placeholder="Minimum Age"
            value={preferences.ageMin}
            onChange={(e) => handleInputChange('ageMin', e.target.value)}
            className="form-control"
            min="18"
          />
        </div>

        <div className="form-group col-lg-3 col-md-12">
          <input
            placeholder="Maximum Age"
            type="number"
            value={preferences.ageMax}
            onChange={(e) => handleInputChange('ageMax', e.target.value)}
            className="form-control"
            min="18"
          />
        </div>

        {/* Domicile State */}
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            options={stateOptions}
            value={preferences.domicileState}
            onChange={(value) => handleInputChange('domicileState', value)}
            className="basic-multi-select"
            placeholder="Domicile State"
          />
        </div>

        {/* Present Residing State */}
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            options={stateOptions}
            value={preferences.presentResidingState}
            onChange={(value) => handleInputChange('presentResidingState', value)}
            className="basic-multi-select"
            placeholder="Present Residing State"
          />
        </div>

        {/* Languages */}
        <div className="form-group col-lg-4 col-md-12">
          <Select
            isMulti
            options={languageOptions}
            value={preferences.languagesKnown.speak}
            onChange={(value) => handleInputChange('languagesKnown', {...preferences.languagesKnown, speak: value})}
            className="basic-multi-select"
            placeholder="Languages - Speak"
          />
        </div>

        <div className="form-group col-lg-4 col-md-12">
          <Select
            isMulti
            options={languageOptions}
            value={preferences.languagesKnown.read}
            onChange={(value) => handleInputChange('languagesKnown', {...preferences.languagesKnown, read: value})}
            className="basic-multi-select"
            placeholder="Languages - Read"
          />
        </div>

        <div className="form-group col-lg-4 col-md-12">
          <Select
            isMulti
            options={languageOptions}
            value={preferences.languagesKnown.write}
            onChange={(value) => handleInputChange('languagesKnown', {...preferences.languagesKnown, write: value})}
            className="basic-multi-select"
            placeholder="Languages - Write"
          />
        </div>

        {/* Computer Skills */}
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            options={computerSkillsOptions}
            value={preferences.computerSkills}
            onChange={(value) => handleInputChange('computerSkills', value)}
            className="basic-multi-select"
            placeholder="Computer Skills"
          />
        </div>

        {/* Knowledge of Accounting */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            value={preferences.knowledgeOfAccounting}
            onChange={(e) => handleInputChange('knowledgeOfAccounting', e.target.value)}
            className="form-control"
          >
            <option value="">Knowledge of Accounting Process</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Notice Period */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            value={preferences.noticePeriod}
            onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
            className="form-control"
          >
            <option value="">Notice Period</option>
            <option value="<7">{'<'} 7 days</option>
            <option value="<15">{'<'} 15 days</option>
            <option value="<30">{'<'} 1 month</option>
            <option value=">30">{'>'} 1 Month</option>
          </select>
        </div>

        {/* Job Search Status */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            value={preferences.jobSearchStatus}
            onChange={(e) => handleInputChange('jobSearchStatus', e.target.value)}
            className="form-control"
          >
            <option value="">Job Search Status</option>
            <option value="active">Actively Searching Jobs</option>
            <option value="casual">Casually Exploring Jobs</option>
            <option value="not_looking">Not looking for Jobs</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save Preferences
          </button>
        </div>
      </div>
    </form>
  );
};

export default Preferences;
