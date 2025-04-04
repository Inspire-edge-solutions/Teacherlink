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
  const { user } = useAuth();
  const firebase_uid = user?.uid;

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

  const [images, setImages] = useState([]);
  const [socialData, setSocialData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [designations, setDesignations] = useState([]);
  const [isOwner, setIsOwner] = useState(""); // "yes" or "no"

  // Reporting Authority (for the first 3 types if isOwner === "no")
  const [reporting_authority, setReportingAuthority] = useState({
    name: user?.name || "",
    gender: "",
    designation: [],
    phone1: user?.phone_number || "",
    phone2: "",
    email: user?.email || "",
  });

  const [otherContactPersonDesignation, setOtherContactPersonDesignation] = useState("");
  const [otherReportingAuthorityDesignation, setOtherReportingAuthorityDesignation] =
    useState("");

  // ============ OTP STATES FOR CONTACT PERSON ============
  // Email
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  // --- Mobile OTP logic is commented out for now ---
  // const [phone1Verified, setPhone1Verified] = useState(false);
  // const [showPhone1OtpInput, setShowPhone1OtpInput] = useState(false);
  // const [phone1Otp, setPhone1Otp] = useState("");
  // const [isPhone1Verifying, setIsPhone1Verifying] = useState(false);
  //
  // const [phone2Verified, setPhone2Verified] = useState(false);
  // const [showPhone2OtpInput, setShowPhone2OtpInput] = useState(false);
  // const [phone2Otp, setPhone2Otp] = useState("");
  // const [isPhone2Verifying, setIsPhone2Verifying] = useState(false);
  // -----------------------------------------------------

  // For now, assume mobile numbers are verified (since OTP is not implemented)
  const phone1Verified = true;
  const phone2Verified = true;

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (orgDetails.country) {
      const countryStates = State.getStatesOfCountry(orgDetails.country);
      setStates(countryStates);
      setOrgDetails((prev) => ({ ...prev, state: "", city: "" }));
      setCities([]);
    }
  }, [orgDetails.country]);

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

  // ============ PREFILL EXISTING DATA ============
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
          }
        })
        .catch((error) => {
          console.error("Error fetching organization details:", error);
        });
    }
  }, [firebase_uid]);
  // =======================================

  const isNonParentType = () =>
    selectedType && selectedType !== "Parent/ Guardian looking for Tuitions";

  useEffect(() => {
    setOrgDetails((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        designation: [],
      },
    }));
  }, [selectedType]);

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
          name: user?.name || "",
          gender: "",
          designation: [],
          phone1: user?.phone_number || "",
          phone2: "",
          email: user?.email || "",
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

  // Contact Person
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
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

  // Reporting Authority
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

  // ================= OTP LOGIC (Contact Person) =================
  // Email OTP (kept active)
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
      }
    } catch (error) {
      toast.error(`Failed to verify email: ${error.message}`);
    }
  };

  // --- Mobile OTP logic for phone numbers is commented out ---
  // const sendPhone1Otp = async () => { ... }
  // const verifyPhone1Otp = async () => { ... }
  // const sendPhone2Otp = async () => { ... }
  // const verifyPhone2Otp = async () => { ... }
  // -------------------------------------------------------------

  // For now, assume mobile numbers are verified
  // (All OTP buttons and related UI for phone numbers remain visible, but you may choose to hide them if desired)

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

    // --- Mobile verification checks are commented out ---
    // if (!phone1Verified) {
    //   toast.error("Please verify the calling number before submitting.");
    //   return;
    // }
    // if (
    //   orgDetails.contactPerson.phone2 &&
    //   orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 &&
    //   !phone2Verified
    // ) {
    //   toast.error("Please verify the WhatsApp number before submitting.");
    //   return;
    // }
    // -----------------------------------------------------

    // If calling and WhatsApp numbers are the same, clear phone2
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
            video: orgDetails.video,
          }
        : null,
      parent_details: !isNonParentType()
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

    console.log("Submitting payload:", payload);
    const result = await createOrganization(payload);
    if (result) {
      toast.success("Organization created successfully!");
      console.log("API response:", result);
    } else {
      toast.error("Failed to create organization.");
    }
  };

  useEffect(() => {
    if (user) {
      setReportingAuthority((prevData) => ({
        ...prevData,
        name: user.name || prevData.name,
      }));
    }
  }, [user]);

  return (
    <div className="default-form">
      <div className="row">
        {/* Organization/Entity Type */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select
            className="form-control"
            value={selectedType}
            onChange={handleTypeChange}
            required
          >
            <option value="" disabled>Select Organization/Entity Type</option>
            <option value="School / College/ University">School / College/ University </option>
            <option value="Coaching Centers/ Institutes">Coaching Centers/ Institutes</option>
            <option value="Ed Tech company">Ed Tech company</option>
            <option value="Parent/ Guardian looking for Tuitions">Parent/ Guardian looking for Tuitions</option>
          </select>
          <span className="custom-tooltip">
            Select the type of organization/entity you are registering with.
        </span>
        </div>
        </div>

        {/* NON-PARENT BLOCK */}
        {isNonParentType() && selectedType && (
          <div className="row">
            {/* Basic Organization Details */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                placeholder="Name of the Organization/ Entity"
                className="form-control"
                name="name"
                value={orgDetails.name}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">Name</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="url"
                placeholder="Website URL"
                className="form-control"
                name="websiteUrl"
                value={orgDetails.websiteUrl}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">Website URL</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <label>Institution Photos</label>
              <input
                type="file"
                className="form-control"
                name="photos"
                accept="image/*"
                multiple
                onChange={handleFileChangeFiles}
              />
              <span className="custom-tooltip">Institution Photos</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="url"
                className="form-control"
                name="video"
                placeholder="Enter YouTube video URL"
                value={orgDetails.video}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">YouTube video URL</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                placeholder="PAN Number"
                className="form-control"
                name="panNumber"
                value={orgDetails.panNumber}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">PAN Number</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                placeholder="Name on PAN Card"
                className="form-control"
                name="panName"
                value={orgDetails.panName}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">Name on PAN Card</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                placeholder="GSTIN"
                className="form-control"
                name="gstin"
                value={orgDetails.gstin}
                onChange={handleInputChange}
              />
              <span className="custom-tooltip">GSTIN</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                placeholder="Address"
                className="form-control"
                name="address"
                value={orgDetails.address}
                onChange={handleInputChange}
                required
              />
              <span className="custom-tooltip">Address</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="country"
                value={orgDetails.country || ""}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">Country</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="state"
                value={orgDetails.state || ""}
                onChange={handleInputChange}
                disabled={!orgDetails.country}
                required
              >
                <option value="" disabled>State</option>
                {states.map((st) => (
                  <option key={st.isoCode} value={st.isoCode}>
                    {st.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">State</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="city"
                value={orgDetails.city || ""}
                onChange={handleInputChange}
                disabled={!orgDetails.state}
                required
              >
                <option value="" disabled>City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">City</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
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
              <span className="custom-tooltip">Pin code</span>
            </div>
            </div>

            {/* Account operated by (Contact Person) */}
            <div className="col-12">
              <h4>Account operated by (Contact Person)</h4>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                name="name"
                value={orgDetails.contactPerson.name}
                onChange={handleContactPersonChange}
                placeholder="Contact Person Name"
                required
              />
              <span className="custom-tooltip">Contact Person Name</span>
            </div>
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
              <div className="input-wrapper">
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
              <span className="custom-tooltip">Designation</span>
            </div>
            </div>
            {(orgDetails.contactPerson.designation || []).includes("Others") && (
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Specify other designation"
                  value={otherContactPersonDesignation}
                  onChange={(e) => setOtherContactPersonDesignation(e.target.value)}
                  required
                />
                <span className="custom-tooltip">Specify other designation</span>
              </div>
              </div>
            )}

            {/* phone1 (Calling) with OTP */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
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
                  required
                  // Mobile OTP is commented out so disable verification check
                  disabled={false}
                />
                {/* OTP button for phone1 is commented out; if needed, enable later */}
                {/* {phone1Verified ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle color="green" />
                  </span>
                ) : (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendPhone1Otp}
                    disabled={isPhone1Verifying}
                  >
                    {isPhone1Verifying ? "Sending..." : "Verify"}
                  </button>
                )} */}
              </div>
              {/* OTP input block commented out */}
              {/* {showPhone1OtpInput && !phone1Verified && (
                <div className="otp-verification">
                  <input
                    type="text"
                    placeholder="Enter OTP sent to calling number"
                    value={phone1Otp}
                    onChange={(e) => setPhone1Otp(e.target.value)}
                    maxLength="6"
                  />
                  <button type="button" className="verify-otp-btn" onClick={verifyPhone1Otp}>
                    Submit
                  </button>
                </div>
              )} */}
            </div>

            {/* phone2 (WhatsApp) with OTP */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
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
                  required
                  disabled={false}
                />
                {orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 ? (
                  // Mobile OTP for phone2 is commented out
                  /* phone2Verified ? (
                    <span className="verification-icon verified">
                      <FaCheckCircle color="green" />
                    </span>
                  ) : ( */
                  <button
                    type="button"
                    className="verify-btn"
                    // onClick={sendPhone2Otp}
                    disabled={false}
                  >
                    Verify
                  </button>
                  /* ) */
                ) : null}
              </div>
              {/* OTP input block for phone2 commented out */}
              {/* {orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 &&
                showPhone2OtpInput &&
                !phone2Verified && (
                  <div className="otp-verification">
                    <input
                      type="text"
                      placeholder="Enter OTP sent to WhatsApp"
                      value={phone2Otp}
                      onChange={(e) => setPhone2Otp(e.target.value)}
                      maxLength="6"
                    />
                    <button type="button" className="verify-otp-btn" onClick={verifyPhone2Otp}>
                      Submit
                    </button>
                  </div>
                )} */}
            </div>

            {/* Email with OTP (active) */}
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
                  disabled={emailVerified}
                />
                {emailVerified ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle color="green" />
                  </span>
                ) : (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendEmailOtp}
                    disabled={isEmailVerifying}
                  >
                    {isEmailVerifying ? "Sending..." : "Verify"}
                  </button>
                )}
              </div>
              {showEmailOtpInput && !emailVerified && (
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

            {/* "Are you the owner..." block */}
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

            {/* Reporting Authority (only if isOwner === "no") */}
            {isOwner === "no" && (
              <div className="row">
                <div className="col-12">
                  <h4>Your Reporting Authority</h4>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={reporting_authority.name}
                    onChange={handleReportingAuthorityChange}
                    placeholder="Name"
                    required
                  />
                  <span className="custom-tooltip">Name</span>
                </div>
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
                  <div className="input-wrapper">
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
                  <span className="custom-tooltip">Designation</span>
                </div>
                </div>
                {(reporting_authority.designation || []).includes("Others") && (
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Specify other designation"
                      value={otherReportingAuthorityDesignation}
                      onChange={(e) => setOtherReportingAuthorityDesignation(e.target.value)}
                      required
                    />
                    <span className="custom-tooltip">Specify other designation</span>
                  </div>
                  </div>
                )}
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
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
                  <span className="custom-tooltip">Contact Number-1 (Calling)</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
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
                  <span className="custom-tooltip">Contact Number-2 (WhatsApp)</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={reporting_authority.email}
                    onChange={handleReportingAuthorityChange}
                    placeholder="Email"
                    required
                  />
                  <span className="custom-tooltip">Email</span>
                </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========== PARENT/GUARDIAN BLOCK =========== */}
        {selectedType === "Parent/ Guardian looking for Tuitions" && (
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                name="address"
                value={parentDetails.address}
                onChange={handleParentInputChange}
                placeholder="Address: No./ Lane / Area"
                required
              />
              <span className="custom-tooltip">Address: No./ Lane / Area</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="country"
                value={parentDetails.country || ""}
                onChange={handleParentInputChange}
                required
              >
                <option value="" disabled>Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">Country</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="state"
                value={parentDetails.state || ""}
                onChange={handleParentInputChange}
                disabled={!parentDetails.country}
                required
              >
                <option value="" disabled>State</option>
                {states.map((st) => (
                  <option key={st.isoCode} value={st.isoCode}>
                    {st.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">State</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select
                className="form-control"
                name="city"
                value={parentDetails.city || ""}
                onChange={handleParentInputChange}
                disabled={!parentDetails.state}
                required
              >
                <option value="" disabled>City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="custom-tooltip">City</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
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
              <span className="custom-tooltip">Pin code</span>
            </div>
            </div>

            {/* Single Account operated by block for Parent/Guardian */}
            <div className="col-12">
              <h4>Account operated by (Contact Person)</h4>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                name="name"
                value={orgDetails.contactPerson.name}
                onChange={handleContactPersonChange}
                placeholder="Contact Person Name"
                required
              />
              <span className="custom-tooltip">Contact Person Name</span>
            </div>
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
              <div className="input-wrapper">
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
              <span className="custom-tooltip">Designation</span>
            </div>
            </div>
            {(orgDetails.contactPerson.designation || []).includes("Others") && (
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Specify other designation"
                  value={otherContactPersonDesignation}
                  onChange={(e) => setOtherContactPersonDesignation(e.target.value)}
                  required
                />
                <span className="custom-tooltip">Specify other designation</span>
                </div>
              </div>
            )}

            {/* phone1 (Calling) with OTP */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
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
                  required
                  // Mobile OTP commented out; input is enabled
                  disabled={false}
                />
                {/* Mobile OTP button commented out */}
                {/* {phone1Verified ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle color="green" />
                  </span>
                ) : (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendPhone1Otp}
                    disabled={isPhone1Verifying}
                  >
                    {isPhone1Verifying ? "Sending..." : "Verify"}
                  </button>
                )} */}
              </div>
              {/* OTP input block commented out */}
              {/* {showPhone1OtpInput && !phone1Verified && (
                <div className="otp-verification">
                  <input
                    type="text"
                    placeholder="Enter OTP sent to calling number"
                    value={phone1Otp}
                    onChange={(e) => setPhone1Otp(e.target.value)}
                    maxLength="6"
                  />
                  <button type="button" className="verify-otp-btn" onClick={verifyPhone1Otp}>
                    Submit
                  </button>
                </div>
              )} */}
            </div>

            {/* phone2 (WhatsApp) with OTP */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-with-verification">
                <input
                  type="text"
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
                  required
                  disabled={false}
                />
                {orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 ? (
                  // Mobile OTP for phone2 is commented out
                  /* phone2Verified ? (
                    <span className="verification-icon verified">
                      <FaCheckCircle color="green" />
                    </span>
                  ) : ( */
                  <button
                    type="button"
                    className="verify-btn"
                    // onClick={sendPhone2Otp}
                    disabled={false}
                  >
                    Verify
                  </button>
                  /* ) */
                ) : null}
              </div>
              {/* OTP input block commented out */}
              {/* {orgDetails.contactPerson.phone2 !== orgDetails.contactPerson.phone1 &&
                showPhone2OtpInput &&
                !phone2Verified && (
                  <div className="otp-verification">
                    <input
                      type="text"
                      placeholder="Enter OTP sent to WhatsApp"
                      value={phone2Otp}
                      onChange={(e) => setPhone2Otp(e.target.value)}
                      maxLength="6"
                    />
                    <button type="button" className="verify-otp-btn" onClick={verifyPhone2Otp}>
                      Submit
                    </button>
                  </div>
                )} */}
            </div>

            {/* Email with OTP (active) */}
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
                  disabled={emailVerified}
                />
                {emailVerified ? (
                  <span className="verification-icon verified">
                    <FaCheckCircle color="green" />
                  </span>
                ) : (
                  <button
                    type="button"
                    className="verify-btn"
                    onClick={sendEmailOtp}
                    disabled={isEmailVerifying}
                  >
                    {isEmailVerifying ? "Sending..." : "Verify"}
                  </button>
                )}
              </div>
              {showEmailOtpInput && !emailVerified && (
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

        {/* Social Fields */}
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="facebook"
              placeholder="Facebook"
              value={socialData.facebook}
              onChange={handleSocialChange}
              />
            <span className="custom-tooltip">Facebook</span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={socialData.twitter}
              onChange={handleSocialChange}
            />  
            <span className="custom-tooltip">Twitter</span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={socialData.linkedin}
              onChange={handleSocialChange}
            />
            <span className="custom-tooltip">LinkedIn</span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="instagram"
              placeholder="Instagram"
              value={socialData.instagram}
              onChange={handleSocialChange}
            />
            <span className="custom-tooltip">Instagram</span>
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
    </div>
  );
};

export default OrgDetails;
