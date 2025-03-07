import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import "./profileStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { createOrganization } from "components/dashboard-pages/employers-dashboard/company-profile/components/my-profile/ApiService";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext";

const OrgDetails = () => {
  // Get the authenticated user from the AuthContext
  const { user } = useAuth();

  // We'll use user?.uid as the firebase_uid
  const firebase_uid = user?.uid; // Adjust if your merged user uses a different property name

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
    contactPerson: {
      name: "",
      gender: "",
      designation: [],
      phone1: "",
      phone2: "",
      email: "",
    },
  });
  
  // State for images (for file uploads)
  const [images, setImages] = useState([]);
  
  // State for social network data
  const [socialData, setSocialData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });
  
  // Location (Country/State/City) states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Other UI states
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [isOwner, setIsOwner] = useState("");
  const [reporting_authority, setReportingAuthority] = useState({
    name: "",
    gender: "",
    designation: [],
    phone1: "",
    phone2: "",
    email: "",
  });
  
  // State for storing fetched organization details from GET API
  const [orgData, setOrgData] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(false);
  const [errorOrg, setErrorOrg] = useState(null);
  
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
  const designationOptions = ["Chairman", "Director", "Principal", "Vice Principal"];
  
  const isNonParentType = () =>
    selectedType && selectedType !== "Parent/ Guardian looking for Tuitions";
  
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({ ...prev, [name]: value }));
  };
  
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
  
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: { ...prev.contactPerson, [name]: value },
    }));
  };
  
  const handleDesignationSelect = (designation) => {
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: prev.contactPerson.designation.includes(designation)
          ? prev.contactPerson.designation.filter((d) => d !== designation)
          : [...prev.contactPerson.designation, designation],
      },
    }));
  };
  
  const handleReportingAuthorityChange = (e) => {
    const { name, value } = e.target;
    setReportingAuthority((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleReportingAuthorityDesignationSelect = (designation) => {
    setReportingAuthority((prev) => ({
      ...prev,
      designation: prev.designation.includes(designation)
        ? prev.designation.filter((d) => d !== designation)
        : [...prev.designation, designation],
    }));
  };
  
  // Submission handler: Builds payload and calls createOrganization API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    const payload = {
      route: "CreateOrganization",
      firebase_uid, // Use the uid from the auth context
      type: selectedType,
      organization_details: !selectedType.includes("Parent/ Guardian looking for Tuitions")
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
      parent_details: selectedType.includes("Parent/ Guardian looking for Tuitions")
        ? {
            address: orgDetails.address,
            city: orgDetails.city,
            state: orgDetails.state,
            pincode: orgDetails.pincode,
            country: orgDetails.country,
          }
        : null,
      account_operated_by: orgDetails.contactPerson,
      reporting_authority,
      social: socialData,
      images,
      additional_owner: null,
    };
    console.log("Submitting payload:", payload);
    const result = await createOrganization(payload);
    if (result) {
      toast.success("Organization created successfully!");
      console.log("API response:", result);
      // Optionally, reset form state here.
    } else {
      toast.error("Failed to create organization.");
    }
  };
  
  // Function to fetch organization details using GET API.
  const fetchOrganization = async () => {
    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoadingOrg(true);
    setErrorOrg(null);
    try {
      const response = await fetch(
        `https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/organization/${firebase_uid}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch organization details");
      }
      const data = await response.json();
      setOrgData(data);
    } catch (err) {
      setErrorOrg(err.message);
    } finally {
      setLoadingOrg(false);
    }
  };
  
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
  
        {/* Non-Parent Types: Render additional fields including owner question */}
        {isNonParentType() && (
          <div className="row">
            {/* Organization basic details */}
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
                        id="male"
                        name="gender"
                        value="male"
                        required
                        onChange={handleContactPersonChange}
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleContactPersonChange}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="transgender"
                        name="gender"
                        value="transgender"
                        onChange={handleContactPersonChange}
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
                        ? orgDetails.contactPerson.designation.join(", ")
                        : "Select Designation(s)"}
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
                    value={orgDetails.contactPerson.phone1}
                    onChange={handleContactPersonChange}
                    placeholder="Contact Number-1 (Calling)"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                    maxLength="10"
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="tel"
                    className="form-control"
                    name="phone2"
                    value={orgDetails.contactPerson.phone2}
                    onChange={handleContactPersonChange}
                    placeholder="Contact Number-2 (WhatsApp)"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
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
                {/* Location fields for non-parent types */}
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
                      onChange={handleInputChange}
                      placeholder="Pin code"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      }
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
                onChange={handleInputChange}
                placeholder="Pin code"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                }
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
                    onChange={handleContactPersonChange}
                  />
                  <label htmlFor="parentGenderTransgender">Transgender</label>
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
                    ? orgDetails.contactPerson.designation.join(", ")
                    : "Select Designation(s)"}
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
                value={orgDetails.contactPerson.phone1}
                onChange={handleContactPersonChange}
                placeholder="Contact Number-1 (Calling)"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                }
                maxLength="10"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="tel"
                className="form-control"
                name="phone2"
                value={orgDetails.contactPerson.phone2}
                onChange={handleContactPersonChange}
                placeholder="Contact Number-2 (WhatsApp)"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                }
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
              placeholder="Linkedin"
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
  
      {/* Buttons: Submit form and View Organization Details */}
      <div className="form-group col-12" style={{ marginTop: "20px" }}>
        <button className="theme-btn btn-style-one" onClick={handleSubmit}>
          Submit
        </button>
        <button
          className="theme-btn btn-style-one"
          style={{ marginLeft: "20px" }}
          onClick={fetchOrganization}
        >
          View Organization Details
        </button>
      </div>
  
      {/* Display Organization Details if fetched */}
      {loadingOrg && <p>Loading organization details...</p>}
      {errorOrg && <p style={{ color: "red" }}>Error: {errorOrg}</p>}
      {orgData && (
        <div className="org-data-display" style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Organization Profile</h3>
          <p><strong>Firebase UID:</strong> {orgData.firebase_uid}</p>
          <p><strong>Type:</strong> {orgData.type}</p>
          {orgData.organization_details && (
            <>
              <h4>Organization Details</h4>
              <p><strong>Name:</strong> {orgData.organization_details.name}</p>
              <p>
                <strong>Website:</strong>{" "}
                <a href={orgData.organization_details.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {orgData.organization_details.websiteUrl}
                </a>
              </p>
              <p><strong>PAN Number:</strong> {orgData.organization_details.panNumber}</p>
              <p><strong>PAN Name:</strong> {orgData.organization_details.panName}</p>
              <p><strong>GSTIN:</strong> {orgData.organization_details.gstin}</p>
              <p><strong>Address:</strong> {orgData.organization_details.address}</p>
              <p><strong>City:</strong> {orgData.organization_details.city}</p>
              <p><strong>State:</strong> {orgData.organization_details.state}</p>
              <p><strong>Pin Code:</strong> {orgData.organization_details.pincode}</p>
              <p><strong>Country:</strong> {orgData.organization_details.country}</p>
              {orgData.organization_details.institution_photos && orgData.organization_details.institution_photos.length > 0 && (
                <div>
                  <h5>Photos:</h5>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {orgData.organization_details.institution_photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        style={{ width: "150px", margin: "8px" }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {orgData.parent_details && (
            <>
              <h4>Parent/Guardian Details</h4>
              <p><strong>Address:</strong> {orgData.parent_details.address}</p>
              <p><strong>City:</strong> {orgData.parent_details.city}</p>
              <p><strong>State:</strong> {orgData.parent_details.state}</p>
              <p><strong>Pin Code:</strong> {orgData.parent_details.pincode}</p>
              <p><strong>Country:</strong> {orgData.parent_details.country}</p>
            </>
          )}
          {orgData.account_operated_by && (
            <>
              <h4>Contact Person</h4>
              <p><strong>Name:</strong> {orgData.account_operated_by.name}</p>
              <p><strong>Gender:</strong> {orgData.account_operated_by.gender}</p>
              <p><strong>Designation:</strong> {orgData.account_operated_by.designation?.join(", ")}</p>
              <p><strong>Phone 1:</strong> {orgData.account_operated_by.phone1}</p>
              <p><strong>Phone 2:</strong> {orgData.account_operated_by.phone2}</p>
              <p><strong>Email:</strong> {orgData.account_operated_by.email}</p>
            </>
          )}
          {orgData.reporting_authority && (
            <>
              <h4>Reporting Authority</h4>
              <p><strong>Name:</strong> {orgData.reporting_authority.name}</p>
              <p><strong>Gender:</strong> {orgData.reporting_authority.gender}</p>
              <p><strong>Designation:</strong> {orgData.reporting_authority.designation?.join(", ")}</p>
              <p><strong>Phone 1:</strong> {orgData.reporting_authority.phone1}</p>
              <p><strong>Phone 2:</strong> {orgData.reporting_authority.phone2}</p>
              <p><strong>Email:</strong> {orgData.reporting_authority.email}</p>
            </>
          )}
          <h4>Social Networks</h4>
          <p><strong>Facebook:</strong> {orgData.facebook}</p>
          <p><strong>Twitter:</strong> {orgData.twitter}</p>
          <p><strong>LinkedIn:</strong> {orgData.linkedin}</p>
          <p><strong>Instagram:</strong> {orgData.instagram}</p>
        </div>
      )}
    </div>
  );
};

export default OrgDetails;