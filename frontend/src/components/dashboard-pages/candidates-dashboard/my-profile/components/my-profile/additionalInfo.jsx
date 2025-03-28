import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../../../../contexts/AuthContext";

const AdditionalInfo = () => {
  const { user } = useAuth();

  // For available religions (from a reference API)
  const [availableReligions, setAvailableReligions] = useState([]);
  
  const skillOptions = [
    { value: "Basic knowledge", label: "Basic knowledge" },
    { value: "Word", label: "Word" },
    { value: "Excel", label: "Excel" },
    { value: "PPT", label: "PPT" },
    { value: "ERP", label: "ERP" },
    { value: "Tally", label: "Tally" },
    { value: "Other", label: "Other" },
  ];

  // State to hold form data. Note: The field names match your DB columns.
  const [formData, setFormData] = useState({
    firebase_id: user?.uid || '',
    // additional_information1 fields
    computerSkills: [],
    accountingKnowledge: '',
    projects: '',
    accomplishments: '',
    certifications: '',
    researchPublications: '',
    patents: '',
    maritalStatus: '',
    spouseNeedJob: '',
    spouseName: '',
    spouseQualification: '',
    spouseWorkExperience: '',
    spouseExpertise: '',
    accommodation: '',
    // additional_information2 fields
    religion: '',
    differentlyAbled: '',
    healthIssues: '',
    aadhaarNo: '',
    citizenship: '',
    preferableTimings: '',
    passportAvailable: '',
    passportExpiryDate: '',
    workPermitDetails: '',
    criminalCharges: '',
    additionalInfo: ''
  });

  // Flags to indicate if records already exist (for PUT vs POST)
  const [info1Exists, setInfo1Exists] = useState(false);
  const [info2Exists, setInfo2Exists] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch available religions
  useEffect(() => {
    const fetchReligion = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_DEV1_API + '/languages');
        const filtered = response.data.filter(lang => lang.category === 'Religion');
        setAvailableReligions(filtered);
      } catch (error) {
        console.error('Error fetching religions:', error);
      }
    };
    fetchReligion();
  }, []);

  // Fetch current user's additional information from both endpoints
  useEffect(() => {
    if (!user?.uid) return;
    const fetchAdditionalInfo = async () => {
      try {
        // additional_information1
        const res1 = await axios.get('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info1', {
          params: { firebase_uid: user.uid }
        });
        if (res1.status === 200 && res1.data.length > 0) {
          const record1 = res1.data[0];
          setInfo1Exists(true);
          // Update formData for additional_information1 fields
          setFormData(prev => ({
            ...prev,
            firebase_id: record1.firebase_uid || prev.firebase_id,
            computerSkills: record1.computer_skills ? JSON.parse(record1.computer_skills) : [],
            accountingKnowledge: record1.accounting_knowledge || '',
            projects: record1.projects || '',
            accomplishments: record1.accomplishments || '',
            certifications: record1.certifications || '',
            researchPublications: record1.research_publications || '',
            patents: record1.patents || '',
            maritalStatus: record1.marital_status || '',
            spouseNeedJob: record1.spouse_need_job || '',
            spouseName: record1.spouse_name || '',
            spouseQualification: record1.spouse_qualification || '',
            spouseWorkExperience: record1.spouse_work_experience || '',
            spouseExpertise: record1.spouse_expertise || '',
            accommodation: record1.accommodation_required || ''
          }));
        }
        // additional_information2
        const res2 = await axios.get('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info2', {
          params: { firebase_uid: user.uid }
        });
        if (res2.status === 200 && res2.data.length > 0) {
          const record2 = res2.data[0];
          setInfo2Exists(true);
          // Update formData for additional_information2 fields
          setFormData(prev => ({
            ...prev,
            firebase_id: record2.firebase_uid || prev.firebase_id,
            religion: record2.religion || '',
            differentlyAbled: record2.differently_abled || '',
            healthIssues: record2.health_issues || '',
            aadhaarNo: record2.aadhaar_number || '',
            citizenship: record2.citizenship || '',
            preferableTimings: record2.preferable_timings || '',
            passportAvailable: record2.passport_available || '',
            passportExpiryDate: record2.passport_expiry_date || '',
            workPermitDetails: record2.work_permit_details || '',
            criminalCharges: record2.criminal_charges || '',
            additionalInfo: record2.additional_info || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching user's additional information:", error);
      }
    };
    fetchAdditionalInfo();
  }, [user?.uid]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate Aadhaar Number (if provided, must be 12 digits)
    if (formData.aadhaarNo && formData.aadhaarNo.length !== 12) {
      toast.error('Please enter a valid Aadhaar number (12 digits).');
      return;
    }

    // Prepare payloads for each endpoint

    // For additional_information1
    const payload1 = {
      firebase_id: formData.firebase_id,
      computer_skills: JSON.stringify(formData.computerSkills),
      accounting_knowledge: formData.accountingKnowledge,
      projects: formData.projects,
      accomplishments: formData.accomplishments,
      certifications: formData.certifications,
      research_publications: formData.researchPublications,
      patents: formData.patents,
      marital_status: formData.maritalStatus,
      spouse_need_job: formData.spouseNeedJob,
      spouse_name: formData.spouseName,
      spouse_qualification: formData.spouseQualification,
      spouse_work_experience: formData.spouseWorkExperience,
      spouse_expertise: formData.spouseExpertise,
      accommodation_required: formData.accommodation
    };

    // For additional_information2
    const payload2 = {
      firebase_id: formData.firebase_id,
      religion: formData.religion,
      differently_abled: formData.differentlyAbled,
      health_issues: formData.healthIssues,
      aadhaar_number: formData.aadhaarNo,
      citizenship: formData.citizenship,
      preferable_timings: formData.preferableTimings,
      passport_available: formData.passportAvailable,
      passport_expiry_date: formData.passportExpiryDate,
      work_permit_details: formData.workPermitDetails,
      criminal_charges: formData.criminalCharges,
      additional_info: formData.additionalInfo
    };

    try {
      // Depending on whether the record exists, use PUT (update) or POST (create)
      if (info1Exists) {
        await axios.put('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info1', payload1, {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        await axios.post('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info1', payload1, {
          headers: { "Content-Type": "application/json" }
        });
      }

      if (info2Exists) {
        await axios.put('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info2', payload2, {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        await axios.post('https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/additional_info2', payload2, {
          headers: { "Content-Type": "application/json" }
        });
      }
      
      toast.success('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      toast.error('Error submitting form!');
    }
  };

  return (
    <div className="default-form">
      <div className="row">

        {/* Computer Skills */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <Select
            isMulti
            name="computerSkills"
            options={skillOptions}
            placeholder="Computer Skills"
            value={skillOptions.filter(option =>
              formData.computerSkills.includes(option.value)
            )}
            onChange={(selectedOptions) => {
              handleChange(
                'computerSkills',
                selectedOptions ? selectedOptions.map(option => option.value) : []
              );
            }}
          />
          <span className="custom-tooltip">Computer Skills</span>
        </div>
        </div>

        {/* Knowledge of Accounting */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select 
            className="chosen-single form-select"
            value={formData.accountingKnowledge}
            onChange={(e) => handleChange('accountingKnowledge', e.target.value)}
          >
            <option value="" disabled>Knowledge of Accounting Process</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <span className="custom-tooltip">Knowledge of Accounting Process</span>
        </div>
        </div>

        {/* Projects */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control form-input"
              placeholder="Projects"
              maxLength={40}
              value={formData.projects}
              onChange={(e) => handleChange('projects', e.target.value)}
              aria-label="Projects"
            />
            <span className="custom-tooltip">Projects</span>
          </div>
        </div>

        {/* Accomplishments */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Accomplishments"
              maxLength={40}
              value={formData.accomplishments}
              onChange={(e) => handleChange('accomplishments', e.target.value)}
            />
            <span className="custom-tooltip">Accomplishments</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Certifications"
              maxLength={40}
              value={formData.certifications}
              onChange={(e) => handleChange('certifications', e.target.value)}
            />
            <span className="custom-tooltip">Certifications</span>
          </div>
        </div>

        {/* Research Publications */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Research Publications"
              maxLength={40}
              value={formData.researchPublications}
              onChange={(e) => handleChange('researchPublications', e.target.value)}
            />
            <span className="custom-tooltip">Research Publications</span>
          </div>
        </div>

        {/* Patents */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Patents"
              maxLength={40}
              value={formData.patents}
              onChange={(e) => handleChange('patents', e.target.value)}
            />
            <span className="custom-tooltip">Patents</span>
          </div>
        </div>

        {/* Marital Status */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
            <select 
              className="chosen-single form-select"
              value={formData.maritalStatus}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
          >
            <option value="" disabled>Select Marital Status</option>
            <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
            </select>
            <span className="custom-tooltip">Marital Status</span>
          </div>
        </div>

        {/* Spouse Need Job */}
        {formData.maritalStatus === "Married" && (
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <select 
              className="chosen-single form-select"
              value={formData.spouseNeedJob}
              onChange={(e) => handleChange('spouseNeedJob', e.target.value)}
            >
              <option value="" disabled>Spouse need job in same organization</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <span className="custom-tooltip">Spouse Need Job</span>
          </div>
          </div>
        )}

        {/* Conditional Spouse Fields */}
        {formData.spouseNeedJob === 'Yes' && (
          <>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Name"
                maxLength={20}
                value={formData.spouseName}
                onChange={(e) => handleChange('spouseName', e.target.value)}
              />
              <span className="custom-tooltip">Spouse Name</span>
            </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Qualification"
                maxLength={20}
                value={formData.spouseQualification}
                onChange={(e) => handleChange('spouseQualification', e.target.value)}
              />
              <span className="custom-tooltip">Spouse Qualification</span>
            </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <select 
                className="chosen-single form-select"
                value={formData.spouseWorkExperience}
                onChange={(e) => handleChange('spouseWorkExperience', e.target.value)}
              >
                <option value="" disabled>Spouse Work Experience</option>
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
                <option value=">20">&gt;20</option>
              </select>
              <span className="custom-tooltip">Spouse Work Experience</span>
            </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Expertise"
                maxLength={40}
                value={formData.spouseExpertise}
                onChange={(e) => handleChange('spouseExpertise', e.target.value)}
              />
              <span className="custom-tooltip">Spouse Expertise</span>
            </div>
            </div>
          </>
        )}

        {/* Accommodation */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select 
            className="chosen-single form-select"
            value={formData.accommodation}
            onChange={(e) => handleChange('accommodation', e.target.value)}
          >
            <option value="" disabled>Accommodation Required</option>
            <option value="Yes - Bachelor">Yes - Bachelor</option>
            <option value="Yes - Family">Yes - Family</option>
            <option value="No">No</option>
          </select>
          <span className="custom-tooltip">Accommodation</span>
        </div>
        </div>

        {/* Religion */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select 
            className="chosen-single form-select"
            value={formData.religion}
            onChange={(e) => handleChange('religion', e.target.value)}
          >
            <option value="" disabled>Religion</option>
            {availableReligions.map((availableReligion) => (
              <option key={availableReligion.id} value={availableReligion.value}>
                {availableReligion.label}
              </option>
            ))}
          </select>
          <span className="custom-tooltip">Religion</span>
        </div>
        </div>

        {/* Differently Abled */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select 
            className="chosen-single form-select"
            value={formData.differentlyAbled}
            onChange={(e) => handleChange('differentlyAbled', e.target.value)}
          >
            <option value="" disabled>Differently Abled</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <span className="custom-tooltip">Differently Abled</span>
        </div>
        </div>

        {/* Health Issues */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Health Issues"
            maxLength={40}
            value={formData.healthIssues}
            onChange={(e) => handleChange('healthIssues', e.target.value)}
          />
          <span className="custom-tooltip">Health Issues</span>
        </div>
        </div>

        {/* Aadhaar Number */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Aadhaar Number"
            value={formData.aadhaarNo}
            maxLength={12}
            onChange={(e) => handleChange('aadhaarNo', e.target.value)}
          />
          <span className="custom-tooltip">Aadhaar Number</span>
        </div>
        </div>

        {/* Citizenship */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Citizenship"
            maxLength={40}
            value={formData.citizenship}
            onChange={(e) => handleChange('citizenship', e.target.value)}
          />
          <span className="custom-tooltip">Citizenship</span>
        </div>
        </div>

        {/* Preferable Timings */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Preferable Timings to contact"
            maxLength={40}
            value={formData.preferableTimings}
            onChange={(e) => handleChange('preferableTimings', e.target.value)}
          />
          <span className="custom-tooltip">Preferable Timings</span>
        </div>
        </div>

        {/* Passport Available */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select
            className="chosen-single form-select"
            value={formData.passportAvailable}
            onChange={(e) => handleChange('passportAvailable', e.target.value)}
          >
            <option value="" disabled>Passport Available</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <span className="custom-tooltip">Passport Available</span>
        </div>
        </div>

        {/* Passport Expiry Date */}
        {formData.passportAvailable === "Yes" && (
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="date"
              className="form-control"
              value={formData.passportExpiryDate}
              onChange={(e) => handleChange('passportExpiryDate', e.target.value)}
            />
          </div>
        )}

        {/* Work Permit Details */}
        {formData.passportAvailable === "Yes" && (
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Work Permit Details"
              value={formData.workPermitDetails}
              onChange={(e) => handleChange('workPermitDetails', e.target.value)}
            />
            <span className="custom-tooltip">Work Permit Details</span>
          </div>
          </div>
        )}

        {/* Criminal Charges */}
        <div className="form-group col-lg-6 col-md-12">
          <div className="input-wrapper">
          <select
            className="chosen-single form-select"
            value={formData.criminalCharges}
            onChange={(e) => handleChange('criminalCharges', e.target.value)}
          >
            <option value="" disabled>Criminal Charges</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <span className="custom-tooltip">Criminal Charges</span>
        </div>
        </div>

        {/* Additional Information */}
        <div className="form-group col-lg-12 col-md-12">
          <div className="input-wrapper">
          <textarea
            className="form-control"
            placeholder="Additional Information"
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
          />
          <span className="custom-tooltip">Additional Information</span>
        </div>
        </div>

        {/* Submit Button */} 
        <div className="form-group col-lg-12 col-md-12">
          <button onClick={handleSubmit} className="theme-btn btn-style-three">
            Save additional information
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;