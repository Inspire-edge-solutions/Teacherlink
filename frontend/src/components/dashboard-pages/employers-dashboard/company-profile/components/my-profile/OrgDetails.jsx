import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import "./profileStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { createOrganization } from "./ApiService"; // Adjust path as needed
import { toast } from "react-toastify";
import { useAuth } from "../../../../../../contexts/AuthContext"; // Import auth context

const OrgDetails = () => {
  // Get the authenticated user (with token) from the AuthContext
  const { user } = useAuth();
  // For display purposes, we get the firebase_uid and token from the user object.
  const firebase_uid = user?.uid;
  const token = user?.token;

  const [designations, setDesignations] = useState([]);

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
  const [showContactPersonDesignations, setShowContactPersonDesignations] = useState(false);
  const [showReportingAuthorityDesignations, setShowReportingAuthorityDesignations] = useState(false);
  const [isOwner, setIsOwner] = useState("");
  const [reporting_authority, setReportingAuthority] = useState({
    name: "",
    gender: "",
    designation: [],
    phone1: "",
    phone2: "",
    email: "",
  });

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

  // Add useEffect to fetch designations when component mounts
  useEffect(() => {
    fetchDesignations();
  }, []);

  const orgTypes = [
    "School / College/ University",
    "Coaching Centers/ Institutes",
    "Ed Tech company",
    "Parent/ Guardian looking for Tuitions",
  ];
  const fetchDesignations = async () => {
    try {
      const response = await fetch(
        "https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/constants"
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
      console.error("Error fetching designations:", error);
      toast.error("Error fetching designations");
    }
  };


  const isNonParentType = () =>
    selectedType && selectedType !== "Parent/ Guardian looking for Tuitions";

  const handleTypeChange = (e) => setSelectedType(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Helper: Convert file to base64 string.
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

  const handleDesignationSelect = (designationValue) => {
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: prev.contactPerson.designation.includes(designationValue)
          ? prev.contactPerson.designation.filter((d) => d !== designationValue)
          : [...prev.contactPerson.designation, designationValue],
      },
    }));
  };

  const handleReportingAuthorityChange = (e) => {
    const { name, value } = e.target;
    setReportingAuthority((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportingAuthorityDesignationSelect = (designationValue) => {
    setReportingAuthority((prev) => ({
      ...prev,
      designation: prev.designation.includes(designationValue)
        ? prev.designation.filter((d) => d !== designationValue)
        : [...prev.designation, designationValue],
    }));
  };

  // Submission handler: Build payload and call createOrganization API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    const payload = {
      route: "CreateOrganization",
      firebase_uid, // Although the backend will override this with the verified uid, we include it for reference.
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
    const result = await createOrganization(payload, token);
    if (result) {
      toast.success("Organization created successfully!");
      console.log("API response:", result);
      // Optionally, reset form state here.
    } else {
      toast.error("Failed to create organization.");
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
                      onClick={() => setShowContactPersonDesignations(!showContactPersonDesignations)}
                    >
                      {orgDetails.contactPerson.designation.length > 0
                        ? orgDetails.contactPerson.designation.join(", ")
                        : "Select Designation(s)"}
                    </div>
                    {showContactPersonDesignations && (
                      <div className="select-options">
                        {designations.map((designation) => (
                          <div
                            key={designation.value}
                            className="select-option"
                            onClick={() => handleDesignationSelect(designation.value)}
                          >
                            <input
                              type="checkbox"
                              checked={orgDetails.contactPerson.designation.includes(designation.value)}
                              readOnly
                            />
                            <span>{designation.label}</span>
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
                  onClick={() => setShowContactPersonDesignations(!showContactPersonDesignations)}
                >
                  {orgDetails.contactPerson.designation.length > 0
                    ? orgDetails.contactPerson.designation.join(", ")
                    : "Select Designation(s)"}
                </div>
                {showContactPersonDesignations && (
                  <div className="select-options">
                    {designations.map((designation) => (
                      <div
                        key={designation.value}
                        className="select-option"
                        onClick={() => handleDesignationSelect(designation.value)}
                      >
                        <input
                          type="checkbox"
                          checked={orgDetails.contactPerson.designation.includes(designation.value)}
                          readOnly
                        />
                        <span>{designation.label}</span>
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