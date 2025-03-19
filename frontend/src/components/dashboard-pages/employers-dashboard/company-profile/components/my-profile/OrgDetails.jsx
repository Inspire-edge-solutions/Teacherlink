import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { Country, State, City } from "country-state-city";
import "./profileStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { createOrganization } from "./ApiService"; // Adjust path as needed
import { toast } from "react-toastify";
import { useAuth } from "../../../../../../contexts/AuthContext"; // Import auth context

const OrgDetails = () => {
  // Get the authenticated user (with firebase_uid) from AuthContext
  const { user } = useAuth();
  // Use firebase_uid directly from the user object
  const firebase_uid = user?.uid;

  // Organization details state
  const [selectedType, setSelectedType] = useState("");
  const [orgDetails, setOrgDetails] = useState({
    name: "",
    websiteUrl: "",
    video: "",
    panNumber: "",
    panName: "",
    gstin: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    // If user is owner, this contactPerson is the "account_operated_by"
    contactPerson: {
      name: "",
      gender: "",
      designation: [],
      phone1: "",
      phone2: "",
      email: "",
    },
  });

  // State for images (file uploads)
  const [images, setImages] = useState([]);

  // Social network data
  const [socialData, setSocialData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  // Country/State/City data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // UI states
  const [designations, setDesignations] = useState([]);
  const [isOwner, setIsOwner] = useState(""); // "yes" or "no"
  // If user is not the owner, we fill out the reporting_authority here:
  const [reporting_authority, setReportingAuthority] = useState({
    name: user?.name || "",
    gender: "",
    designation: [],
    phone1: user?.phone_number||"",
    phone2: "",
    email: user?.email || "",
  });


  // Add state for other designation
  const [otherContactPersonDesignation, setOtherContactPersonDesignation] = useState('');
  const [otherReportingAuthorityDesignation, setOtherReportingAuthorityDesignation] = useState('');

  // Load country list on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states list when country changes
  useEffect(() => {
    if (orgDetails.country) {
      const countryStates = State.getStatesOfCountry(orgDetails.country);
      setStates(countryStates);
      setOrgDetails((prev) => ({ ...prev, state: "", city: "" }));
      setCities([]);
    }
  }, [orgDetails.country]);

  // Update cities list when state changes
  useEffect(() => {
    if (orgDetails.state && orgDetails.country) {
      const stateCities = City.getCitiesOfState(orgDetails.country, orgDetails.state);
      setCities(stateCities);
      setOrgDetails((prev) => ({ ...prev, city: "" }));
    }
  }, [orgDetails.state, orgDetails.country]);

  const orgTypes = [
    "School / College/ University",
    "Coaching Centers/ Institutes",
    "Ed Tech company",
    "Parent/ Guardian looking for Tuitions",
  ];
  const fetchDesignations = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_DEV1_API + '/constants'
      );
      const data = await response.json();
      const transformedData = data.map((item) => ({
        category: item.category,
        value: item.value,
        label: item.label
      }));
      setDesignations(
        transformedData.filter((item) => item.category === "Administration") || []
      );
    } catch (error) {
      console.error("Error fetching drop down data list:", error);
    }
  };

  // Ensure fetchDesignations is called to populate designations
  useEffect(() => {
    fetchDesignations();
  }, []);

  // Utility: check if the selected type is NOT parent/guardian
  const isNonParentType = () =>
    selectedType && selectedType !== "Parent/ Guardian looking for Tuitions";

  // Handler for organization type selection
  const handleTypeChange = (e) => setSelectedType(e.target.value);

  // Generic handler for fields in orgDetails (like name, website, address, etc.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Helper: Convert file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // File change handler for institution photos
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArr = Array.from(files);
      const convertedFiles = await Promise.all(
        fileArr.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          return { base64, fileName: file.name };
        })
      );
      setImages(convertedFiles);
    }
  };

  // Social data change handler
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialData((prev) => ({ ...prev, [name]: value }));
  };

  // If user is the owner, we store data in orgDetails.contactPerson
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: { ...prev.contactPerson, [name]: value },
    }));
  };

  // For contact person designation
  const handleContactPersonDesignationChange = (selectedOptions) => {
    setOrgDetails(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: selectedOptions ? selectedOptions.map(option => option.value) : []
      }
    }));
  };

  // If user is NOT the owner, we store data in reporting_authority
  const handleReportingAuthorityChange = (e) => {
    const { name, value } = e.target;
    setReportingAuthority((prev) => ({ ...prev, [name]: value }));
  };

  // For reporting authority designation
  const handleReportingAuthorityDesignationChange = (selectedOptions) => {
    setReportingAuthority(prev => ({
      ...prev,
      designation: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  // Add a new handler specifically for parent/guardian designation
  const handleParentDesignationChange = (selectedOptions) => {
    setOrgDetails(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: selectedOptions ? selectedOptions.map(option => option.value) : []
      }
    }));
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    // Build the payload
    const payload = {
      route: "CreateOrganization",
      firebase_uid,
      type: selectedType,
      // For non-parent types, store organization details
      organization_details: isNonParentType()
        ? {
            name: orgDetails.name,
            websiteUrl: orgDetails.websiteUrl,
            panNumber: orgDetails.panNumber,
            panName: orgDetails.panName,
            gstin: orgDetails.gstin,
            address: orgDetails.address,
            city: orgDetails.city,
            state: orgDetails.state,
            pincode: orgDetails.pincode,
            country: orgDetails.country,
            institution_photos: images,
          }
        : null,
      // For parent/guardian, store parent_details
      parent_details: !isNonParentType()
        ? {
            address: orgDetails.address,
            city: orgDetails.city,
            state: orgDetails.state,
            pincode: orgDetails.pincode,
            country: orgDetails.country,
          }
        : null,

      // If user is owner => account_operated_by = contactPerson
      // If user is not owner => account_operated_by is null, and we use reporting_authority
      account_operated_by: isOwner === "yes" ? {
        ...orgDetails.contactPerson,
        other_designation: orgDetails.contactPerson.designation.includes('Others') 
          ? otherContactPersonDesignation 
          : null
      } : null,
      reporting_authority: isOwner === "no" ? {
        ...reporting_authority,
        other_designation: reporting_authority.designation.includes('Others') 
          ? otherReportingAuthorityDesignation 
          : null
      } : null,

      social: socialData,
      images,
      additional_owner: null,
    };

    console.log("Submitting payload:", payload);

    const result = await createOrganization(payload);
    if (result) {
      toast.success("Organization created successfully!");
      console.log("API response:", result);
      // Optionally reset form or navigate away
    } else {
      toast.error("Failed to create organization.");
    }
  };

  // Use useEffect to update form data when user data is available
  useEffect(() => {
    if (user) {
      setReportingAuthority(prevData => ({
        ...prevData,
        name: user.name || prevData.name
      }));
    }
  }, [user]);

  return (
    <div className="default-form">
      <div className="row">
        {/* Organization Type Selection */}
        <div className="form-group col-lg-6 col-md-12">
          <select className="form-control" value={selectedType} onChange={handleTypeChange}>
            <option value="">Select Organization/Entity Type</option>
            {orgTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Non-Parent Types: Render additional fields */}
        {isNonParentType() && (
          <div className="row">
            {/* Basic Organization Details */}
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
                onChange={handleFileChange}
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
              
              maxLength="20"
              placeholder="Name"
              required
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
          <Select
          isMulti
          options={designations}
          value={designations.filter(option => 
          orgDetails.contactPerson.designation.includes(option.value)
          )}
          onChange={handleContactPersonDesignationChange}
          className={`custom-select ${orgDetails.contactPerson.designation.length === 0 ? 'required' : ''}`}
          placeholder="Designation"
          isClearable
          />
        </div>
                  {orgDetails.contactPerson.designation.includes('Others') && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        placeholder="Specify other designation"
                        value={otherContactPersonDesignation}
                        onChange={(e) => setOtherContactPersonDesignation(e.target.value)}
                        required
                      />
                    </div>
                  )}

          <div className="form-group col-lg-6 col-md-12">
            <input
            required
              type="tel"
              className="form-control"
              name="phone1"
             
              placeholder="Contact Number-1 (Calling)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
            required
              type="tel"
              className="form-control"
              name="phone2"
              
              placeholder="Contact Number-2 (WhatsApp)"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
              maxLength="10"
              title="Please enter exactly 10 digits"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <input
            required
              type="email"
              className="form-control"
              name="email"
             
              placeholder="Email"
            />
          </div>


            {/* Owner Question */}
            <div className="form-group col-lg-6 col-md-12">
              <h6>Are you the owner or the main head of the organization?</h6>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="ownerYes"
                    name="isOwner"
                    value="yes"
                    checked={isOwner === "yes"}
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
                    checked={isOwner === "no"}
                    onChange={(e) => setIsOwner(e.target.value)}
                  />
                  <label htmlFor="ownerNo">No</label>
                </div>
              </div>
            </div>

            {/* Reporting Authority Fields (if not owner) */}
            {isOwner === "no" && (
              <div className="row">
                <div className="col-12">
                  <h4>Your Reporting Authority</h4>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={reporting_authority.name}
                    onChange={handleReportingAuthorityChange}
                    maxLength="20"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="radio-group">
                    <h6>Gender</h6>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={reporting_authority.gender === "male"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={reporting_authority.gender === "female"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="transgender"
                        name="gender"
                        value="transgender"
                        checked={reporting_authority.gender === "transgender"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="transgender">Transgender</label>
                    </div>
                  </div>
                </div>
          <div className="form-group col-lg-6 col-md-12">
          <Select
          isMulti
          options={designations}
          value={designations.filter(option => 
          reporting_authority.designation.includes(option.value)
          )}
          onChange={handleReportingAuthorityDesignationChange}
          className={`custom-select ${reporting_authority.designation.length === 0 ? 'required' : ''}`}
          placeholder="Designation"
          isClearable
          />
        </div>
                {reporting_authority.designation.includes('Others') && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        placeholder="Specify other designation"
                        value={otherReportingAuthorityDesignation}
                        onChange={(e) => setOtherReportingAuthorityDesignation(e.target.value)}
                        required
                      />
                    </div>
                  )}

                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="tel"
                    className="form-control"
                    name="phone1"
                    value={reporting_authority.phone1}
                    onChange={(e) =>
                      setReportingAuthority((prev) => ({
                        ...prev,
                        phone1: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                    placeholder="Contact Number-1 (Calling)"
                    maxLength="10"
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="tel"
                    className="form-control"
                    name="phone2"
                    value={reporting_authority.phone2}
                    onChange={(e) =>
                      setReportingAuthority((prev) => ({
                        ...prev,
                        phone2: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                    placeholder="Contact Number-2 (WhatsApp)"
                    maxLength="10"
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={reporting_authority.email}
                    onChange={handleReportingAuthorityChange}
                    placeholder="Email"
                  />
                </div>

                {/* Location fields if you also want them for reporting authority
                    (optional — depends on your design)
                 */}
                <div className="row">
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      className="form-control"
                      name="country"
                      value={orgDetails.country || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Country</option>
                      {countries.map((country) => (
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
                      value={orgDetails.state || ""}
                      onChange={handleInputChange}
                      disabled={!orgDetails.country}
                    >
                      <option value="">State</option>
                      {states.map((state) => (
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
                      value={orgDetails.city || ""}
                      onChange={handleInputChange}
                      disabled={!orgDetails.state}
                    >
                      <option value="">City</option>
                      {cities.map((city) => (
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
                      name="pincode"
                      value={orgDetails.pincode}
                      onChange={(e) =>
                        setOrgDetails((prev) => ({
                          ...prev,
                          pincode: e.target.value.replace(/[^0-9]/g, ""),
                        }))
                      }
                      placeholder="Pin code"
                      maxLength="6"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parent/ Guardian Fields */}
        {selectedType === "Parent/ Guardian looking for Tuitions" && (
          <div className="row">
            {/* Location Fields */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                name="address"
                value={orgDetails.address}
                onChange={handleInputChange}
                placeholder="Address: No./ Lane / Area"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-control"
                name="country"
                value={orgDetails.country || ""}
                onChange={handleInputChange}
              >
                <option value="">Country</option>
                {countries.map((country) => (
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
                value={orgDetails.state || ""}
                onChange={handleInputChange}
                disabled={!orgDetails.country}
              >
                <option value="">State</option>
                {states.map((state) => (
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
                value={orgDetails.city || ""}
                onChange={handleInputChange}
                disabled={!orgDetails.state}
              >
                <option value="">City</option>
                {cities.map((city) => (
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
                name="pincode"
                value={orgDetails.pincode}
                onChange={(e) =>
                  setOrgDetails((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
                placeholder="Pin code"
                maxLength="6"
              />
            </div>
            {/* Contact Person Fields for Parent/ Guardian */}
            <div>
              <h4>Account operated by (Contact Person)</h4>
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
              <div className="radio-group">
                <h6>Gender</h6>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="parentGenderMale"
                    name="gender"
                    value="male"
                    checked={orgDetails.contactPerson.gender === "male"}
                    onChange={handleContactPersonChange}
                  />
                  <label htmlFor="parentGenderMale">Male</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="parentGenderFemale"
                    name="gender"
                    value="female"
                    checked={orgDetails.contactPerson.gender === "female"}
                    onChange={handleContactPersonChange}
                  />
                  <label htmlFor="parentGenderFemale">Female</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="parentGenderTransgender"
                    name="gender"
                    value="transgender"
                    checked={orgDetails.contactPerson.gender === "transgender"}
                    onChange={handleContactPersonChange}
                  />
                  <label htmlFor="parentGenderTransgender">Transgender</label>
                </div>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <Select
                isMulti
                options={designations}
                value={designations.filter(option => 
                  orgDetails.contactPerson.designation.includes(option.value)
                )}
                onChange={handleParentDesignationChange}
                className={`custom-select ${orgDetails.contactPerson.designation.length === 0 ? 'required' : ''}`}
                placeholder="Designation"
                isClearable
              />
            </div>
            {orgDetails.contactPerson.designation.includes('Others') && (
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  placeholder="Specify other designation"
                  value={otherContactPersonDesignation}
                  onChange={(e) => setOtherContactPersonDesignation(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="tel"
                className="form-control"
                name="phone1"
                value={orgDetails.contactPerson.phone1}
                onChange={(e) =>
                  setOrgDetails((prev) => ({
                    ...prev,
                    contactPerson: {
                      ...prev.contactPerson,
                      phone1: e.target.value.replace(/[^0-9]/g, ""),
                    },
                  }))
                }
                placeholder="Contact Number-1 (Calling)"
                maxLength="10"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="tel"
                className="form-control"
                name="phone2"
                value={orgDetails.contactPerson.phone2}
                onChange={(e) =>
                  setOrgDetails((prev) => ({
                    ...prev,
                    contactPerson: {
                      ...prev.contactPerson,
                      phone2: e.target.value.replace(/[^0-9]/g, ""),
                    },
                  }))
                }
                placeholder="Contact Number-2 (WhatsApp)"
                maxLength="10"
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

        {/* Social network fields */}
        <div className="row">
          <div className="form-group col-lg-3 col-md-6">
            <input
              type="text"
              name="facebook"
              placeholder="Facebook"
              value={socialData.facebook}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-3 col-md-6">
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={socialData.twitter}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-3 col-md-6">
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={socialData.linkedin}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-3 col-md-6">
            <input
              type="text"
              name="instagram"
              placeholder="Instagram"
              value={socialData.instagram}
              onChange={handleSocialChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-group col-12" style={{ marginTop: "20px" }}>
        <button className="theme-btn btn-style-one" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default OrgDetails;