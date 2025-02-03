// import React, { useState } from 'react';
// import Select from "react-select";

// const AdditionalInfo = () => {
//   const skillOptions = [
//     { value: "Basic knowledge", label: "Basic knowledge" },
//     { value: "Word", label: "Word" },
//     { value: "Excel", label: "Excel" },
//     { value: "PPT", label: "PPT" },
//     { value: "ERP", label: "ERP" },
//     { value: "Tally", label: "Tally" },
//   ];

//   const [formData, setFormData] = useState({
//     computerSkills: [],
//     accountingKnowledge: '',
//     projects: '',
//     accomplishments: '',
//     certifications: '',
//     researchPublications: '',
//     patents: '',
//     maritalStatus: '',
//     spouseNeedJob: '',
//     spouseName: '',
//     spouseQualification: '',
//     spouseWorkExperience: '',
//     spouseExpertise: '',
//     accommodation: '',
//     religion: '',
//     differentlyAbled: '',
//     healthIssues: '',
//     aadhaarNo: '',
//     citizenship: '',
//     preferableTimings: '',
//     passportAvailable: '',
//     passportExpiryDate: '',
//     workPermitDetails: '',
//     criminalCharges: '',
//     additionalInfo: ''
//   });

//   const handleChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <div className="default-form">
//       <div className="row">
//         <h3>Additional Information</h3>
//         {/* Computer Skills */}
//         <div className="form-group col-lg-6 col-md-12">
//           <Select
//             isMulti
//             name="computerSkills"
//             options={skillOptions}
//             placeholder="Computer Skills"
//             className="basic-multi-select"
//             classNamePrefix="select"
//             value={skillOptions.filter(option => 
//               formData.computerSkills.includes(option.value)
//             )}
//             onChange={(selectedOptions) => {
//               handleChange(
//                 'computerSkills',
//                 selectedOptions ? selectedOptions.map(option => option.value) : []
//               );
//             }}
//           />
//         </div>

//         {/* Knowledge of Accounting */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             value={formData.accountingKnowledge}
//             onChange={(e) => handleChange('accountingKnowledge', e.target.value)}
//           >
//             <option value="">Knowledge of Accounting Process</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {/* Projects */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Projects'
//             maxLength={40}
//             value={formData.projects}
//             onChange={(e) => handleChange('projects', e.target.value)}
//           />
//         </div>

//         {/* Accomplishments */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Accomplishments'
//             maxLength={40}
//             value={formData.accomplishments}
//             onChange={(e) => handleChange('accomplishments', e.target.value)}
//           />
//         </div>

//         {/* Certifications */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Certifications'
//             maxLength={40}
//             value={formData.certifications}
//             onChange={(e) => handleChange('certifications', e.target.value)}
//           />
//         </div>

//         {/* Research Publications */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Research Publications'
//             maxLength={40}
//             value={formData.researchPublications}
//             onChange={(e) => handleChange('researchPublications', e.target.value)}
//           />
//         </div>

//         {/* Patents */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Patents'
//             maxLength={40}
//             value={formData.patents}
//             onChange={(e) => handleChange('patents', e.target.value)}
//           />
//         </div>

//         {/* Marital Status */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             placeholder='Marital Status'
//             value={formData.maritalStatus}
//             onChange={(e) => handleChange('maritalStatus', e.target.value)}
//           >
//             <option value="">Select Marital Status</option>
//             <option value="Married">Married</option>
//             <option value="Un married">Un married</option>
//           </select>
          
//         </div>

//         {/* Spouse Need Job */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             placeholder='Spouse need job in same organization'
//             value={formData.spouseNeedJob}
//             onChange={(e) => handleChange('spouseNeedJob', e.target.value)}
//           >
//             <option value="">Spouse need job in same organization</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {/* Conditional Spouse Fields */}
//         {formData.spouseNeedJob === 'Yes' && (
//           <>
//             <div className="form-group col-lg-6 col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder='Spouse Name'
//                 maxLength={20}
//                 value={formData.spouseName}
//                 onChange={(e) => handleChange('spouseName', e.target.value)}
//               />
//             </div>

//             <div className="form-group col-lg-6 col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder='Spouse Qualification'
//                 maxLength={20}
//                 value={formData.spouseQualification}
//                 onChange={(e) => handleChange('spouseQualification', e.target.value)}
//               />
//             </div>

//             <div className="form-group col-lg-6 col-md-12">
//               <select 
//                 className="chosen-single form-select"
//                 placeholder='Spouse Work Experience'
//                 value={formData.spouseWorkExperience}
//                 onChange={(e) => handleChange('spouseWorkExperience', e.target.value)}
//               >
//                 <option value="">Spouse Work Experience</option>
//                 {Array.from({ length: 21 }, (_, i) => (
//                   <option key={i} value={i}>{i}</option>
//                 ))}
//                 <option value=">20">&gt;20</option>
//               </select>
//             </div>

//             <div className="form-group col-lg-6 col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder='Spouse Expertise'
//                 maxLength={40}
//                 value={formData.spouseExpertise}
//                 onChange={(e) => handleChange('spouseExpertise', e.target.value)}
//               />
//             </div>
//           </>
//         )}

//         {/* Accommodation */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             placeholder='Accommodation Required'
//             value={formData.accommodation}
//             onChange={(e) => handleChange('accommodation', e.target.value)}
//           >
//             <option value="">Accommodation Required</option>
//             <option value="Yes - Bachelor">Yes - Bachelor</option>
//             <option value="Yes - Family">Yes - Family</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {/* Religion */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             placeholder='Religion'
//             value={formData.religion}
//             onChange={(e) => handleChange('religion', e.target.value)}
//           >
//             <option value="">Select Religion</option>
//             {["Hinduism", "Islam", "Christianity", "Sikhism"].map(religion => (
//               <option key={religion} value={religion}>{religion}</option>
//             ))}
//           </select>
//         </div>

//         {/* Differently Abled */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Differently Abled'
//             maxLength={40}
//             value={formData.differentlyAbled}
//             onChange={(e) => handleChange('differentlyAbled', e.target.value)}
//           />
//         </div>

//         {/* Health Issues */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Any Major Health Issues'
//             maxLength={40}
//             value={formData.healthIssues}
//             onChange={(e) => handleChange('healthIssues', e.target.value)}
//           />
//         </div>

//         {/* Aadhaar */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Aadhaar No.'
//             maxLength={12}
//             pattern="\d*"
//             value={formData.aadhaarNo}
//             onChange={(e) => handleChange('aadhaarNo', e.target.value.replace(/\D/g, ''))}
//           />
//         </div>

//         {/* Citizenship */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Citizenship'
//             maxLength={40}
//             value={formData.citizenship}
//             onChange={(e) => handleChange('citizenship', e.target.value)}
//           />
//         </div>

//         {/* Contact Timings */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Preferable Timings to contact'
//             maxLength={40}
//             value={formData.preferableTimings}
//             onChange={(e) => handleChange('preferableTimings', e.target.value)}
//           />
//         </div>

//         {/* Passport */}
//         <div className="form-group col-lg-6 col-md-12">
//           <select 
//             className="chosen-single form-select"
//             placeholder='Passport Available'
//             value={formData.passportAvailable}
//             onChange={(e) => handleChange('passportAvailable', e.target.value)}
//           >
//             <option value="">Passport Available ?</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>

//         {formData.passportAvailable === 'Yes' && (
//           <div className="form-group col-lg-6 col-md-12">
//             <input
//               type="date"
//               className="form-control"
//               placeholder='Passport Expiry Date'
//               min={new Date().toISOString().split('T')[0]}
//               value={formData.passportExpiryDate}
//               onChange={(e) => handleChange('passportExpiryDate', e.target.value)}
//             />
//           </div>
//         )}

//         {/* Work Permit */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Work Permit Details'
//             maxLength={40}
//             value={formData.workPermitDetails}
//             onChange={(e) => handleChange('workPermitDetails', e.target.value)}
//           />
//         </div>

//         {/* Criminal Charges */}
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             placeholder='Any Criminal Charges'
//             maxLength={40}
//             value={formData.criminalCharges}
//             onChange={(e) => handleChange('criminalCharges', e.target.value)}
//           />
//         </div>

//         {/* Additional Info */}
//         <div className="form-group col-lg-12 col-md-12">
//           <textarea
//             className="form-control"
//             placeholder='Anything more about yourself'
//             maxLength={200}
//             rows={4}
//             value={formData.additionalInfo}
//             onChange={(e) => handleChange('additionalInfo', e.target.value)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdditionalInfo;


import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const AdditionalInfo = () => {
  const skillOptions = [
    { value: "Basic knowledge", label: "Basic knowledge" },
    { value: "Word", label: "Word" },
    { value: "Excel", label: "Excel" },
    { value: "PPT", label: "PPT" },
    { value: "ERP", label: "ERP" },
    { value: "Tally", label: "Tally" },
  ];

  const [formData, setFormData] = useState({
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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate Aadhaar Number (12 digits)
    if (formData.aadhaarNo && formData.aadhaarNo.length !== 12) {
      alert('Please enter a valid Aadhaar number (12 digits).');
      return; // Prevent submission if Aadhaar number is invalid
    }

    // Prepare data for additional_information1
    const additionalInfo1Data = {
      computer_skills: JSON.stringify(formData.computerSkills), // Save as JSON string
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

    // Prepare data for additional_information2
    const additionalInfo2Data = {
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
      // Send data to both tables (additional_information1 and additional_information2)
      await axios.post('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/additional_info1', additionalInfo1Data);
      await axios.post('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/additional_info2', additionalInfo2Data);
      
      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form!');
    }
  };

  return (
    <div className="default-form">
      <div className="row">
        <h3>Additional Information</h3>

        {/* Computer Skills */}
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            name="computerSkills"
            options={skillOptions}
            placeholder="Computer Skills"
            className="basic-multi-select"
            classNamePrefix="select"
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
        </div>

        {/* Knowledge of Accounting */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.accountingKnowledge}
            onChange={(e) => handleChange('accountingKnowledge', e.target.value)}
          >
            <option value="">Knowledge of Accounting Process</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Projects */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Projects"
            maxLength={40}
            value={formData.projects}
            onChange={(e) => handleChange('projects', e.target.value)}
          />
        </div>

        {/* Accomplishments */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Accomplishments"
            maxLength={40}
            value={formData.accomplishments}
            onChange={(e) => handleChange('accomplishments', e.target.value)}
          />
        </div>

        {/* Certifications */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Certifications"
            maxLength={40}
            value={formData.certifications}
            onChange={(e) => handleChange('certifications', e.target.value)}
          />
        </div>

        {/* Research Publications */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Research Publications"
            maxLength={40}
            value={formData.researchPublications}
            onChange={(e) => handleChange('researchPublications', e.target.value)}
          />
        </div>

        {/* Patents */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Patents"
            maxLength={40}
            value={formData.patents}
            onChange={(e) => handleChange('patents', e.target.value)}
          />
        </div>

        {/* Marital Status */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.maritalStatus}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
          >
            <option value="">Select Marital Status</option>
            <option value="Married">Married</option>
            <option value="Unmarried">Unmarried</option>
          </select>
        </div>

        {/* Spouse Need Job */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.spouseNeedJob}
            onChange={(e) => handleChange('spouseNeedJob', e.target.value)}
          >
            <option value="">Spouse need job in same organization</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Conditional Spouse Fields */}
        {formData.spouseNeedJob === 'Yes' && (
          <>
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Name"
                maxLength={20}
                value={formData.spouseName}
                onChange={(e) => handleChange('spouseName', e.target.value)}
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Qualification"
                maxLength={20}
                value={formData.spouseQualification}
                onChange={(e) => handleChange('spouseQualification', e.target.value)}
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <select 
                className="chosen-single form-select"
                value={formData.spouseWorkExperience}
                onChange={(e) => handleChange('spouseWorkExperience', e.target.value)}
              >
                <option value="">Spouse Work Experience</option>
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
                <option value=">20">&gt;20</option>
              </select>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Spouse Expertise"
                maxLength={40}
                value={formData.spouseExpertise}
                onChange={(e) => handleChange('spouseExpertise', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Accommodation */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.accommodation}
            onChange={(e) => handleChange('accommodation', e.target.value)}
          >
            <option value="">Accommodation Required</option>
            <option value="Yes - Bachelor">Yes - Bachelor</option>
            <option value="Yes - Family">Yes - Family</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Religion */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.religion}
            onChange={(e) => handleChange('religion', e.target.value)}
          >
            <option value="">Religion</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Differently Abled */}
        <div className="form-group col-lg-6 col-md-12">
          <select 
            className="chosen-single form-select"
            value={formData.differentlyAbled}
            onChange={(e) => handleChange('differentlyAbled', e.target.value)}
          >
            <option value="">Differently Abled</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Health Issues */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Health Issues"
            maxLength={40}
            value={formData.healthIssues}
            onChange={(e) => handleChange('healthIssues', e.target.value)}
          />
        </div>

        {/* Aadhaar Number */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Aadhaar Number"
            value={formData.aadhaarNo}
            maxLength={12}
            onChange={(e) => handleChange('aadhaarNo', e.target.value)}
          />
        </div>

        {/* Citizenship */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Citizenship"
            maxLength={40}
            value={formData.citizenship}
            onChange={(e) => handleChange('citizenship', e.target.value)}
          />
        </div>

        {/* Preferable Timings */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Preferable Timings"
            maxLength={40}
            value={formData.preferableTimings}
            onChange={(e) => handleChange('preferableTimings', e.target.value)}
          />
        </div>

        {/* Passport Available */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            className="chosen-single form-select"
            value={formData.passportAvailable}
            onChange={(e) => handleChange('passportAvailable', e.target.value)}
          >
            <option value="">Passport Available</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
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
            <input
              type="text"
              className="form-control"
              placeholder="Work Permit Details"
              value={formData.workPermitDetails}
              onChange={(e) => handleChange('workPermitDetails', e.target.value)}
            />
          </div>
        )}

        {/* Criminal Charges */}
        <div className="form-group col-lg-6 col-md-12">
          <select
            className="chosen-single form-select"
            value={formData.criminalCharges}
            onChange={(e) => handleChange('criminalCharges', e.target.value)}
          >
            <option value="">Criminal Charges</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Additional Information */}
        <div className="form-group col-lg-12 col-md-12">
          <textarea
            className="form-control"
            placeholder="Additional Information"
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12">
          <button onClick={handleSubmit} className="btn btn-primary">Save additional information</button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;