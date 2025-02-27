import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import './profileStyles.css';
import 'react-toastify/dist/ReactToastify.css';

const OrgDetails = () => {
  const [selectedType, setSelectedType] = useState('');
  const [orgDetails, setOrgDetails] = useState({
    name: '',
    websiteUrl: '',
    photos: '',
    video: '',
    panNumber: '',
    panName: '',
    gstin: '',
    contactPerson: {
      name: '',
      gender: '',
      designation: [],
      phone1: '',
      phone2: '',
      email: ''
    }
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [isOwner, setIsOwner] = useState('');
  const [reportingAuthority, setReportingAuthority] = useState({
    name: '',
    gender: '',
    designation: [],
    phone1: '',
    phone2: '',
    email: ''
  });

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    console.log('Countries:', allCountries);
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (orgDetails.country) {
      console.log('Selected country:', orgDetails.country);
      const countryStates = State.getStatesOfCountry(orgDetails.country);
      console.log('States:', countryStates);
      setStates(countryStates);
      setOrgDetails(prev => ({ ...prev, state: '', city: '' }));
      setCities([]);
    }
  }, [orgDetails.country]);

  useEffect(() => {
    if (orgDetails.state && orgDetails.country) {
      console.log('Selected state:', orgDetails.state);
      const stateCities = City.getCitiesOfState(orgDetails.country, orgDetails.state);
      console.log('Cities:', stateCities);
      setCities(stateCities);
      setOrgDetails(prev => ({ ...prev, city: '' }));
    }
  }, [orgDetails.state, orgDetails.country]);

  const orgTypes = [
    'School / College/ University',
    'Coaching Centers/ Institutes',
    'Ed Tech company',
    'Parent/ Guardian looking for Tuitions'
  ];

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isParentGuardian = () => {
    return selectedType === 'Parent/ Guardian looking for Tuitions';
  };

  const shouldShowAdditionalFields = () => {
    return ['School / College/ University', 'Coaching Centers/ Institutes', 'Ed Tech company'].includes(selectedType);
  };
  
  const designationOptions = [
    'Chairman',
    'Director',
    'Principal',
    'Vice Principal',
    // Add more designations as needed
  ];

  const handleDesignationSelect = (designation) => {
    setOrgDetails(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: prev.contactPerson.designation.includes(designation)
          ? prev.contactPerson.designation.filter(d => d !== designation)
          : [...prev.contactPerson.designation, designation]
      }
    }));
  };

  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name]: value
      }
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options, option => option.value);
    setOrgDetails(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name]: selectedValues
      }
    }));
  };

  const handleReportingAuthorityChange = (e) => {
    const { name, value } = e.target;
    setReportingAuthority(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportingAuthorityDesignationSelect = (designation) => {
    setReportingAuthority(prev => ({
      ...prev,
      designation: prev.designation.includes(designation)
        ? prev.designation.filter(d => d !== designation)
        : [...prev.designation, designation]
    }));
  };

  return (
    <div className='default-form'>
    <div className="row">
    <div className="form-group col-lg-6 col-md-12">
      <select 
        className="form-control"
        value={selectedType}
        onChange={handleTypeChange}
      >
        <option value="">Select Organization/Entity Type</option>
        {orgTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
      </div>

      {shouldShowAdditionalFields() && (
        <>
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="Name of the Organization/ Entity"
              className="form-control"
              name="name"
              value={orgDetails.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="url"
              placeholder="Website URL"
              className="form-control"
              name="websiteUrl"
              value={orgDetails.websiteUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Institution Photos</label>
            <input
              type="file"
              className="form-control"
              name="photos"
              accept="image/*"
              multiple
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="url"
              className="form-control"
              name="video"
              placeholder="Enter YouTube video URL"
              value={orgDetails.video}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="PAN Number"
              className="form-control"
              name="panNumber"
              value={orgDetails.panNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="Name on PAN Card"
              className="form-control"
              name="panName"
              value={orgDetails.panName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="GSTIN"
              className="form-control"
              name="gstin"
              value={orgDetails.gstin}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h4>Account operated by (Contact Person) </h4>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="name"
              value={orgDetails.contactPerson.name}
              onChange={handleContactPersonChange}
              maxLength="20"
              placeholder="Name"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
        <div className="radio-group ">
          <h6>Gender</h6>
          <div className="radio-option">
            <input 
              type="radio" 
              id="male" 
              name="gender" 
              value="male" 
              required 
            />
            <label htmlFor="male">Male</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="female" 
              name="gender" 
              value="female" 
            />
            <label htmlFor="female">Female</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="transgender" 
              name="gender" 
              value="transgender" 
            />
            <label htmlFor="transgender">Transgender</label>
          </div>
        </div>
      </div>
      <div className="form-group col-lg-6 col-md-12">
            <div className="custom-multiselect">
              <div 
                className="select-header form-control"
                onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
              >
                {reportingAuthority.designation.length > 0 
                  ? reportingAuthority.designation.join(', ')
                  : 'Select Designation(s)'}
              </div>
              {showDesignationDropdown && (
                <div className="select-options">
                  {designationOptions.map((designation, index) => (
                    <div 
                      key={index}
                      className="select-option"
                      onClick={() => handleReportingAuthorityDesignationSelect(designation)}
                    >
                      <input
                        type="checkbox"
                        checked={reportingAuthority.designation.includes(designation)}
                        readOnly
                      />
                      <span>{designation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone1"
              value={reportingAuthority.phone1}
              onChange={handleReportingAuthorityChange}
              placeholder="Contact Number-1 (Calling)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
            <small className="text-muted">Verification by OTP at the time of registration</small>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone2"
              value={reportingAuthority.phone2}
              onChange={handleReportingAuthorityChange}
              placeholder="Contact Number-2 (WhatsApp)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
            <small className="text-muted">Verification by OTP at the time of registration</small>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="email"
              className="form-control"
              name="email"
              value={reportingAuthority.email}
              onChange={handleReportingAuthorityChange}
              placeholder="Email"
            />
            <small className="text-muted">Email verification will be done by OTP</small>
          </div>


          </div>

      <div className="form-group col-lg-6 col-md-12">
        <h6>Are you the owner or the main head of the organization?</h6>
        <div className="radio-group">
          <div className="radio-option">
            <input 
              type="radio" 
              id="ownerYes" 
              name="isOwner" 
              value="yes"
              checked={isOwner === 'yes'}
              onChange={(e) => setIsOwner(e.target.value)}
            />
            <label htmlFor="ownerYes">Yes</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="ownerNo" 
              name="isOwner" 
              value="no"
              checked={isOwner === 'no'}
              onChange={(e) => setIsOwner(e.target.value)}
            />
            <label htmlFor="ownerNo">No</label>
          </div>
        </div>
      </div>

      {isOwner === 'no' && (
        <div className="row">
          <div className="col-12">
            <h4>Your Reporting Authority</h4>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="name"
              value={reportingAuthority.name}
              onChange={handleReportingAuthorityChange}
              placeholder="Name"
              maxLength="20"
              pattern="[A-Za-z\s]+"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <div className="radio-group">
              <h6>Gender</h6>
              <div className="radio-option">
                <input 
                  type="radio" 
                  id="raGenderMale" 
                  name="gender" 
                  value="Male"
                  checked={reportingAuthority.gender === 'Male'}
                  onChange={handleReportingAuthorityChange}
                />
                <label htmlFor="raGenderMale">Male</label>
              </div>
              <div className="radio-option">
                <input 
                  type="radio" 
                  id="raGenderFemale" 
                  name="gender" 
                  value="Female"
                  checked={reportingAuthority.gender === 'Female'}
                  onChange={handleReportingAuthorityChange}
                />
                <label htmlFor="raGenderFemale">Female</label>
              </div>
              <div className="radio-option">
                <input 
                  type="radio" 
                  id="raGenderTransgender" 
                  name="gender" 
                  value="Transgender"
                  checked={reportingAuthority.gender === 'Transgender'}
                  onChange={handleReportingAuthorityChange}
                />
                <label htmlFor="raGenderTransgender">Transgender</label>
              </div>
            </div>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <div className="custom-multiselect">
              <div 
                className="select-header form-control"
                onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
              >
                {reportingAuthority.designation.length > 0 
                  ? reportingAuthority.designation.join(', ')
                  : 'Select Designation(s)'}
              </div>
              {showDesignationDropdown && (
                <div className="select-options">
                  {designationOptions.map((designation, index) => (
                    <div 
                      key={index}
                      className="select-option"
                      onClick={() => handleReportingAuthorityDesignationSelect(designation)}
                    >
                      <input
                        type="checkbox"
                        checked={reportingAuthority.designation.includes(designation)}
                        readOnly
                      />
                      <span>{designation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone1"
              value={reportingAuthority.phone1}
              onChange={handleReportingAuthorityChange}
              placeholder="Contact Number-1 (Calling)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
            <small className="text-muted">Verification by OTP at the time of registration</small>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone2"
              value={reportingAuthority.phone2}
              onChange={handleReportingAuthorityChange}
              placeholder="Contact Number-2 (WhatsApp)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
            <small className="text-muted">Verification by OTP at the time of registration</small>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="email"
              className="form-control"
              name="email"
              value={reportingAuthority.email}
              onChange={handleReportingAuthorityChange}
              placeholder="Email"
            />
            <small className="text-muted">Email verification will be done by OTP</small>
          </div>
          <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="country"
              value={orgDetails.country || ''}
              onChange={handleInputChange}
            >
              <option value="">Country</option>
              {countries && countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="state"
              value={orgDetails.state || ''}
              onChange={handleInputChange}
              disabled={!orgDetails.country}
            >
              <option value="">State</option>
              {states && states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="city"
              value={orgDetails.city || ''}
              onChange={handleInputChange}
              disabled={!orgDetails.state}
            >
              <option value="">City</option>
              {cities && cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="address"
              value={orgDetails.address}
              onChange={handleInputChange}
              placeholder="Address:No./ Lane / Area"
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={orgDetails.pincode}
              onChange={handleInputChange}
              placeholder="Pin code"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="6"
            />
          </div>
          </div>
        </div>
      )}
      </>
    )}

      {isParentGuardian() && (
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="country"
              value={orgDetails.country || ''}
              onChange={handleInputChange}
            >
              <option value="">Country</option>
              {countries && countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="state"
              value={orgDetails.state || ''}
              onChange={handleInputChange}
              disabled={!orgDetails.country}
            >
              <option value="">State</option>
              {states && states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-control"
              name="city"
              value={orgDetails.city || ''}
              onChange={handleInputChange}
              disabled={!orgDetails.state}
            >
              <option value="">City</option>
              {cities && cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="address"
              value={orgDetails.address}
              onChange={handleInputChange}
              placeholder="Address:No./ Lane / Area"
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={orgDetails.pincode}
              onChange={handleInputChange}
              placeholder="Pin code"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="6"
            />
          </div>
          <div>
            <h4>Account operated by (Contact Person) </h4>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              name="name"
              value={orgDetails.contactPerson.name}
              onChange={handleContactPersonChange}
              maxLength="20"
              placeholder="Name"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
        <div className="radio-group ">
          <h6>Gender</h6>
          <div className="radio-option">
            <input 
              type="radio" 
              id="male" 
              name="gender" 
              value="male" 
              required 
            />
            <label htmlFor="male">Male</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="female" 
              name="gender" 
              value="female" 
            />
            <label htmlFor="female">Female</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="transgender" 
              name="gender" 
              value="transgender" 
            />
            <label htmlFor="transgender">Transgender</label>
          </div>
        </div>
      </div>

          <div className="form-group col-lg-6 col-md-12">
            <div className="custom-multiselect">
              <div 
                className="select-header form-control"
                onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
              >
                {orgDetails.contactPerson.designation.length > 0 
                  ? orgDetails.contactPerson.designation.join(', ')
                  : 'Select Designation(s)'}
              </div>
              {showDesignationDropdown && (
                <div className="select-options">
                  {designationOptions.map((designation, index) => (
                    <div 
                      key={index}
                      className="select-option"
                      onClick={() => handleDesignationSelect(designation)}
                    >
                      <input
                        type="checkbox"
                        checked={orgDetails.contactPerson.designation.includes(designation)}
                        onChange={() => {}}
                      />
                      <span>{designation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone1"
              value={orgDetails.contactPerson.phone1}
              onChange={handleContactPersonChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              placeholder="Contact Number-1 (Calling)"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="tel"
              className="form-control"
              name="phone2"
              value={orgDetails.contactPerson.phone2}
              onChange={handleContactPersonChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              placeholder="Contact Number-2 (WhatsApp)"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
              type="email"
              className="form-control"
              name="email"
              value={orgDetails.contactPerson.email}
              onChange={handleContactPersonChange}
              placeholder="Email"
            />
          </div>
        </div>
      )}
    </div>

    {shouldShowAdditionalFields() && (
      <div className="form-group col-12">
        <button 
          className="theme-btn btn-style-one"
        >
          Submit
        </button>
      </div>
    )}
    </div>
  );
};

export default OrgDetails;