import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import "./profileStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { createOrganization } from "./ApiService"; // Adjust path as needed
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../../../../contexts/AuthContext"; // Import auth context

const OrgDetails = () => {
  // -------------- AUTH & BASIC FLAGS --------------
  const { user, loading } = useAuth();
  
  // Wait for auth state to resolve
  if (loading) {
    return <div>Loading...</div>;
  }

  const firebase_uid = user?.uid;
  const isGoogleAccount = user?.is_google_account === 1;

  // -------------- TYPE & ORG DETAILS --------------
  const [selectedType, setSelectedType] = useState("");
  const [originalType, setOriginalType] = useState("");

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

  const [parentDetails, setParentDetails] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  // -------------- IMAGES & SOCIAL --------------
  const [images, setImages] = useState([]);
  const [socialData, setSocialData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  // -------------- DESIGNATIONS --------------
  const [designations, setDesignations] = useState([]);
  const [isOwner, setIsOwner] = useState(""); // "yes" or "no"

  // Reporting Authority
  const [reporting_authority, setReportingAuthority] = useState({
    name: "",
    gender: "",
    designation: [],
    phone1: "",
    phone2: "",
    email: "",
  });

  const [otherContactPersonDesignation, setOtherContactPersonDesignation] = useState("");
  const [otherReportingAuthorityDesignation, setOtherReportingAuthorityDesignation] =
    useState("");

  // -------------- VERIFICATION STATES (EMAIL ONLY) --------------
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  // -------------- PHONE OTP LOGIC (for now, treat as verified) --------------
  const phone1Verified = true;
  const phone2Verified = true;

  // -------------- COUNTRY/STATE/CITY LISTS --------------
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // -------------- LOAD COUNTRIES ONCE --------------
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // -------------- WATCH orgDetails.country -> LOAD STATES --------------
  useEffect(() => {
    if (orgDetails.country) {
      const countryStates = State.getStatesOfCountry(orgDetails.country);
      setStates(countryStates);
      setOrgDetails((prev) => ({ ...prev, state: "", city: "" }));
      setCities([]);
    }
  }, [orgDetails.country]);

  // -------------- WATCH orgDetails.state -> LOAD CITIES --------------
  useEffect(() => {
    if (orgDetails.state && orgDetails.country) {
      let stateCities = City.getCitiesOfState(orgDetails.country, orgDetails.state);
      if (orgDetails.city && !stateCities.find((c) => c.name === orgDetails.city)) {
        stateCities = [...stateCities, { name: orgDetails.city }];
      }
      setCities(stateCities);
      setOrgDetails((prev) => ({ ...prev, city: prev.city }));
    }
  }, [orgDetails.state, orgDetails.country, orgDetails.city]);

  // -------------- FETCH DESIGNATIONS --------------
  const fetchDesignations = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_DEV1_API + "/constants");
      const data = await response.json();
      const transformedData = data.map((item) => ({
        category: item.category,
        value: item.value,
        label: item.label,
      }));
      setDesignations(
        transformedData.filter((item) => item.category === "Administration") || []
      );
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // -------------- ON LOAD: if google user => email verified --------------
  useEffect(() => {
    if (isGoogleAccount) {
      setEmailVerified(true);
    }
  }, [isGoogleAccount]);

  // -------------- LOAD ORG DETAILS FROM BACKEND --------------
  useEffect(() => {
    if (firebase_uid) {
      const url = `${import.meta.env.VITE_DEV1_API}/organization/${firebase_uid}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setSelectedType(data.type || "");
            setOriginalType(data.type || "");
            if (data.organization_details) {
              setOrgDetails({
                name: data.organization_details.name || "",
                websiteUrl: data.organization_details.websiteUrl || "",
                video: data.organization_details.video || "",
                panNumber: data.organization_details.panNumber || "",
                panName: data.organization_details.panName || "",
                gstin: data.organization_details.gstin || "",
                address: data.organization_details.address || "",
                city: data.organization_details.city || "",
                state: data.organization_details.state || "",
                pincode: data.organization_details.pincode || "",
                country: data.organization_details.country || "",
                contactPerson: data.account_operated_by || {
                  name: "",
                  gender: "",
                  designation: [],
                  phone1: "",
                  phone2: "",
                  email: "",
                },
              });
            } else {
              if (data.account_operated_by) {
                setOrgDetails((prev) => ({
                  ...prev,
                  contactPerson: data.account_operated_by,
                }));
              }
            }
            if (data.parent_details) {
              setParentDetails({
                address: data.parent_details.address || "",
                city: data.parent_details.city || "",
                state: data.parent_details.state || "",
                pincode: data.parent_details.pincode || "",
                country: data.parent_details.country || "",
              });
            }
            if (data.reporting_authority) {
              setReportingAuthority((prev) => ({
                ...prev,
                ...data.reporting_authority,
                gender: data.reporting_authority.gender
                  ? data.reporting_authority.gender.toLowerCase().trim()
                  : "",
              }));
            }
            setSocialData({
              facebook: data.facebook || "",
              twitter: data.twitter || "",
              linkedin: data.linkedin || "",
              instagram: data.instagram || "",
            });
            if (data.account_operated_by?.is_email_verified) {
              setEmailVerified(true);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching organization details:", error);
        });
    }
  }, [firebase_uid]);

  // -------------- RESET DESIGNATIONS WHEN TYPE CHANGES --------------
  useEffect(() => {
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: [],
      },
    }));
  }, [selectedType]);

  // -------------- HANDLERS --------------
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    if (newType !== originalType) {
      if (newType === "Parent/ Guardian looking for Tuitions") {
        setOrgDetails({
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
        setIsOwner("");
        setReportingAuthority({});
      } else {
        setParentDetails({
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        });
        setIsOwner("");
        setReportingAuthority({
          name: "",
          gender: "",
          designation: [],
          phone1: "",
          phone2: "",
          email: "",
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleParentInputChange = (e) => {
    const { name, value } = e.target;
    setParentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChangeFiles = async (e) => {
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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialData((prev) => ({ ...prev, [name]: value }));
  };

  // Contact Person handlers
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    if (isGoogleAccount && name === "email") return;
    if (name === "email" && value !== orgDetails.contactPerson.email) {
      setEmailVerified(false);
      setShowEmailOtpInput(false);
      setEmailOtp("");
    }
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: { ...prev.contactPerson, [name]: value },
    }));
  };

  const handleContactPersonDesignationChange = (selectedOptions) => {
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
      },
    }));
  };

  // Reporting Authority handlers
  const handleReportingAuthorityChange = (e) => {
    const { name, value } = e.target;
    if (name === "reportingAuthorityGender") {
      setReportingAuthority((prev) => ({ ...prev, gender: value }));
    } else {
      setReportingAuthority((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReportingAuthorityDesignationChange = (selectedOptions) => {
    setReportingAuthority((prev) => ({
      ...prev,
      designation: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  // Email OTP handlers
  const sendEmailOtp = async () => {
    try {
      setIsEmailVerifying(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/create`,
        { email: orgDetails.contactPerson.email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success("OTP sent to contact person's email!");
        setShowEmailOtpInput(true);
      }
    } catch (error) {
      toast.error(`Failed to send email OTP: ${error.message}`);
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV1_API}/otp/verify`,
        {
          email: orgDetails.contactPerson.email,
          otp: emailOtp,
          firebase_uid,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success("Contact person's email verified successfully!");
        setEmailVerified(true);
        setShowEmailOtpInput(false);
        setOrgDetails((prev) => ({
          ...prev,
          contactPerson: { ...prev.contactPerson },
        }));
        if (!isGoogleAccount) {
          try {
            await axios.post(`${import.meta.env.VITE_DEV1_API}/organization/update-verification`, {
              firebase_uid,
              is_email_verified: true,
            });
          } catch (dbError) {
            console.error("Failed to store 'is_email_verified' in DB:", dbError);
          }
        }
      }
    } catch (error) {
      toast.error(`Failed to verify email: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    if (originalType && selectedType !== originalType) {
      toast.error("You cannot change the organization type once submitted.");
      return;
    }

    if (!isGoogleAccount && !emailVerified) {
      toast.error("Please verify the email before submitting.");
      return;
    }

    const updatedContactPerson = { ...orgDetails.contactPerson };
    if (
      updatedContactPerson.phone1 &&
      updatedContactPerson.phone1 === updatedContactPerson.phone2
    ) {
      updatedContactPerson.phone2 = "";
    }

    const payload = {
      route: "CreateOrganization",
      firebase_uid,
      type: selectedType,
      organization_details:
        selectedType !== "Parent/ Guardian looking for Tuitions"
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
              video: orgDetails.video,
            }
          : null,
      parent_details:
        selectedType === "Parent/ Guardian looking for Tuitions"
          ? {
              address: parentDetails.address,
              city: parentDetails.city,
              state: parentDetails.state,
              pincode: parentDetails.pincode,
              country: parentDetails.country,
            }
          : null,
      account_operated_by: {
        ...updatedContactPerson,
        is_phone1_verified: phone1Verified,
        is_phone2_verified: phone2Verified,
        is_email_verified: emailVerified || isGoogleAccount,
        other_designation: (orgDetails.contactPerson.designation || []).includes("Others")
          ? otherContactPersonDesignation
          : null,
      },
      reporting_authority:
        isOwner === "no" && selectedType !== "Parent/ Guardian looking for Tuitions"
          ? {
              ...reporting_authority,
              other_designation: (reporting_authority.designation || []).includes("Others")
                ? otherReportingAuthorityDesignation
                : null,
            }
          : null,
      social: socialData,
      images,
      additional_owner: null,
    };

    if (
      payload.organization_details &&
      (!payload.organization_details.pincode || payload.organization_details.pincode === "")
    ) {
      payload.organization_details.pincode = "0";
    }
    if (
      payload.parent_details &&
      (!payload.parent_details.pincode || payload.parent_details.pincode === "")
    ) {
      payload.parent_details.pincode = "0";
    }

    console.log("Submitting payload:", payload);
    const result = await createOrganization(payload);
    if (result) {
      toast.success("Organization created or updated successfully!");
      console.log("API response:", result);
      if (window.opener) {
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    } else {
      toast.error("Failed to create/update organization.");
    }
  };

  const isNonParentType = () =>
    selectedType && selectedType !== "Parent/ Guardian looking for Tuitions";

  return (
    <div className="default-form">
      <div className="row">
        {/* Organization Type */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            className="form-control"
            value={selectedType}
            onChange={handleTypeChange}
            required
          >
            <option value="">Select Organization/Entity Type</option>
            <option value="School / College/ University">School / College/ University</option>
            <option value="Coaching Centers/ Institutes">Coaching Centers/ Institutes</option>
            <option value="Ed Tech company">Ed Tech company</option>
            <option value="Parent/ Guardian looking for Tuitions">
              Parent/ Guardian looking for Tuitions
            </option>
          </select>
        </div>

        {/* NON-PARENT BLOCK */}
        {isNonParentType() && selectedType && (
          <div className="row">
            {/* Organization Details */}
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
                onChange={handleFileChangeFiles}
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
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Address"
                className="form-control"
                name="address"
                value={orgDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-control"
                name="country"
                value={orgDetails.country || ""}
                onChange={handleInputChange}
                required
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
                required
              >
                <option value="">State</option>
                {states.map((st) => (
                  <option key={st.isoCode} value={st.isoCode}>
                    {st.name}
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
                required
              >
                <option value="">City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Pin code"
                className="form-control"
                name="pincode"
                value={orgDetails.pincode}
                onChange={(e) =>
                  setOrgDetails((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
                maxLength="6"
                required
              />
            </div>

            {/* Contact Person */}
            <div className="col-12">
              <h4>Account operated by (Contact Person)</h4>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                name="name"
                value={orgDetails.contactPerson.name}
                onChange={handleContactPersonChange}
                placeholder="Contact Person Name"
                required
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
                    checked={orgDetails.contactPerson.gender === "male"}
                    onChange={handleContactPersonChange}
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
                    checked={orgDetails.contactPerson.gender === "female"}
                    onChange={handleContactPersonChange}
                    required
                  />
                  <label htmlFor="female">Female</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="transgender"
                    name="gender"
                    value="transgender"
                    checked={orgDetails.contactPerson.gender === "transgender"}
                    onChange={handleContactPersonChange}
                    required
                  />
                  <label htmlFor="transgender">Transgender</label>
                </div>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <Select
                isMulti
                options={designations}
                value={designations.filter((option) =>
                  (orgDetails.contactPerson.designation || []).includes(option.value)
                )}
                onChange={handleContactPersonDesignationChange}
                className={`custom-select ${
                  orgDetails.contactPerson.designation ? "required" : ""
                }`}
                placeholder="Designation"
                isClearable
              />
            </div>
            {(orgDetails.contactPerson.designation || []).includes("Others") && (
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
              <div className="input-with-verification">
                <input
                  type="text"
                  className="form-control"
                  name="phone1"
                  value={orgDetails.contactPerson.phone1}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Number-1 (Calling)"
                  maxLength="10"
                  required
                />
                <span className="verification-icon verified">
                  <FaCheckCircle />
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
                  className="form-control"
                  name="phone2"
                  value={orgDetails.contactPerson.phone2}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Number-2 (WhatsApp)"
                  maxLength="10"
                  required
                />
                {orgDetails.contactPerson.phone2 &&
                orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={orgDetails.contactPerson.email}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Person Email"
                  required
                  disabled={isGoogleAccount || emailVerified}
                />
                {!isGoogleAccount && !emailVerified && (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendEmailOtp}
                    disabled={isEmailVerifying}
                  >
                    {isEmailVerifying ? "Sending..." : "Verify"}
                  </button>
                )}
                {(!isGoogleAccount && emailVerified) && (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                )}
                {isGoogleAccount && (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
              {showEmailOtpInput && !emailVerified && !isGoogleAccount && (
                <div className="otp-verification">
                  <input
                    type="text"
                    placeholder="Enter OTP sent to email"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    maxLength="6"
                  />
                  <button type="button" className="verify-otp-btn" onClick={verifyEmailOtp}>
                    Submit
                  </button>
                </div>
              )}
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
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="radio-group">
                    <h6>Gender</h6>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="raMale"
                        name="reportingAuthorityGender"
                        value="male"
                        checked={reporting_authority.gender === "male"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="raMale">Male</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="raFemale"
                        name="reportingAuthorityGender"
                        value="female"
                        checked={reporting_authority.gender === "female"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="raFemale">Female</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="raTransgender"
                        name="reportingAuthorityGender"
                        value="transgender"
                        checked={reporting_authority.gender === "transgender"}
                        onChange={handleReportingAuthorityChange}
                      />
                      <label htmlFor="raTransgender">Transgender</label>
                    </div>
                  </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <Select
                    isMulti
                    options={designations}
                    value={designations.filter((option) =>
                      (reporting_authority.designation || []).includes(option.value)
                    )}
                    onChange={handleReportingAuthorityDesignationChange}
                    className={`custom-select ${
                      reporting_authority.designation ? "required" : ""
                    }`}
                    placeholder="Designation"
                    isClearable
                  />
                </div>
                {(reporting_authority.designation || []).includes("Others") && (
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
                    type="text"
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
                    required
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
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
                    required
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
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* PARENT/GUARDIAN BLOCK */}
        {selectedType === "Parent/ Guardian looking for Tuitions" && (
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                name="address"
                value={parentDetails.address}
                onChange={handleParentInputChange}
                placeholder="Address: No./ Lane / Area"
                required
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-control"
                name="country"
                value={parentDetails.country || ""}
                onChange={handleParentInputChange}
                required
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
                value={parentDetails.state || ""}
                onChange={handleParentInputChange}
                disabled={!parentDetails.country}
                required
              >
                <option value="">State</option>
                {states.map((st) => (
                  <option key={st.isoCode} value={st.isoCode}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-control"
                name="city"
                value={parentDetails.city || ""}
                onChange={handleParentInputChange}
                disabled={!parentDetails.state}
                required
              >
                <option value="">City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={parentDetails.pincode}
                onChange={(e) =>
                  setParentDetails((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
                maxLength="6"
                placeholder="Pin code"
                required
              />
            </div>

            <div className="col-12">
              <h4>Account operated by (Contact Person)</h4>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                name="name"
                value={orgDetails.contactPerson.name}
                onChange={handleContactPersonChange}
                placeholder="Contact Person Name"
                required
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
                    required
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
                    required
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
                    required
                  />
                  <label htmlFor="parentGenderTransgender">Transgender</label>
                </div>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <Select
                isMulti
                options={designations}
                value={designations.filter((option) =>
                  (orgDetails.contactPerson.designation || []).includes(option.value)
                )}
                onChange={handleContactPersonDesignationChange}
                className={`custom-select ${
                  orgDetails.contactPerson.designation ? "required" : ""
                }`}
                placeholder="Designation"
                isClearable
              />
            </div>
            {(orgDetails.contactPerson.designation || []).includes("Others") && (
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
              <div className="input-with-verification">
                <input
                  type="text"
                  className="form-control"
                  name="phone1"
                  value={orgDetails.contactPerson.phone1}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Number-1 (Calling)"
                  maxLength="10"
                  required
                />
                <span className="verification-icon verified">
                  <FaCheckCircle />
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
                  className="form-control"
                  name="phone2"
                  value={orgDetails.contactPerson.phone2}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Number-2 (WhatsApp)"
                  maxLength="10"
                  required
                />
                {orgDetails.contactPerson.phone2 &&
                orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={orgDetails.contactPerson.email}
                  onChange={handleContactPersonChange}
                  placeholder="Contact Person Email"
                  required
                  disabled={isGoogleAccount || emailVerified}
                />
                {!isGoogleAccount && !emailVerified && (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendEmailOtp}
                    disabled={isEmailVerifying}
                  >
                    {isEmailVerifying ? "Sending..." : "Verify"}
                  </button>
                )}
                {(!isGoogleAccount && emailVerified) && (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                )}
                {isGoogleAccount && (
                  <span className="verification-icon verified">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
              {showEmailOtpInput && !emailVerified && !isGoogleAccount && (
                <div className="otp-verification">
                  <input
                    type="text"
                    placeholder="Enter OTP sent to email"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    maxLength="6"
                  />
                  <button type="button" className="verify-otp-btn" onClick={verifyEmailOtp}>
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOCIAL FIELDS */}
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              name="facebook"
              placeholder="Facebook"
              value={socialData.facebook}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={socialData.twitter}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={socialData.linkedin}
              onChange={handleSocialChange}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              name="instagram"
              placeholder="Instagram"
              value={socialData.instagram}
              onChange={handleSocialChange}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="form-group col-12" style={{ marginTop: "20px" }}>
          <button className="theme-btn btn-style-one" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgDetails;
