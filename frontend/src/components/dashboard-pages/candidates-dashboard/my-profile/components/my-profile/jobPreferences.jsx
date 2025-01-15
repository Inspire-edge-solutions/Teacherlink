import React, { useState } from 'react';

const JobPreference = () => {
  const [preferences, setPreferences] = useState({
    jobShift: {
      fullTime: { offline: null, online: null },
      partTimeWeekdays: { offline: null, online: null },
      partTimeWeekends: { offline: null, online: null },
      partTimeVacations: { offline: null, online: null }
    },
    organizationType: {
      schoolCollegeUniversity: { offline: null, online: null },
      coachingCentersInstitutes: { offline: null, online: null },
      edTechCompanies: { offline: null, online: null }
    },
    parentGuardian: {
      homeTuitionsOffline: { offline: null, online: null },
      privateTuitionsOffline: { offline: null, online: null },
      groupTuitionsOffline: { offline: null, online: null },
      privateTuitionsOnline: { offline: null, online: null },
      groupTuitionsOnline: { offline: null, online: null },
      coachingClassesOffline: { offline: null, online: null }
    }
  });

  const handlePreferenceChange = (category, field, mode, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...prev[category][field],
          [mode]: value
        }
      }
    }));
  };

  return (
    <form className="default-form">
      <div className="row">
        {/* Job Shift & Job Category Section */}
        <div className="form-group col-md-6 col-lg-12">
          <div className="form-box">
            <h3 className="form-title">Job Shift & Job Category</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Full time</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.fullTime.offline === null ? '' : preferences.jobShift.fullTime.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'fullTime', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.fullTime.online === null ? '' : preferences.jobShift.fullTime.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'fullTime', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Part time (Weekdays)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekdays.offline === null ? '' : preferences.jobShift.partTimeWeekdays.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekdays', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekdays.online === null ? '' : preferences.jobShift.partTimeWeekdays.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekdays', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Part time (Weekends)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekends.offline === null ? '' : preferences.jobShift.partTimeWeekends.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekends', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekends.online === null ? '' : preferences.jobShift.partTimeWeekends.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekends', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Part time (vacations)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeVacations.offline === null ? '' : preferences.jobShift.partTimeVacations.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeVacations', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeVacations.online === null ? '' : preferences.jobShift.partTimeVacations.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeVacations', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {/* Similar rows for other job shifts */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Organization Type Section */}
        <div className="form-group col-lg-12">
          <div className="form-box">
            <h3 className="form-title">Organization Type</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>School / College / University</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.schoolCollegeUniversity.offline === null ? '' : preferences.organizationType.schoolCollegeUniversity.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'schoolCollegeUniversity', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.schoolCollegeUniversity.online === null ? '' : preferences.organizationType.schoolCollegeUniversity.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'schoolCollegeUniversity', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Coaching Centers / Institutes</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.coachingCentersInstitutes.offline === null ? '' : preferences.organizationType.coachingCentersInstitutes.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coachingCentersInstitutes', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.coachingCentersInstitutes.online === null ? '' : preferences.organizationType.coachingCentersInstitutes.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coachingCentersInstitutes', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>EdTech Companies</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.edTechCompanies.offline === null ? '' : preferences.organizationType.edTechCompanies.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'edTechCompanies', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.edTechCompanies.online === null ? '' : preferences.organizationType.edTechCompanies.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'edTechCompanies', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {/* Add similar rows for coachingCentersInstitutes and edTechCompanies */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Parent / Guardian Section */}
        <div className="form-group col-lg-12">
          <div className="form-box">
            <h3 className="form-title">Parent / Guardian looking for tuitions</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Home Tutor (One-to-One at Student's Home)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.homeTuitionsOffline.offline === null ? '' : preferences.parentGuardian.homeTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'homeTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Private Tutor (One-to-One at Tutor's Place)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.privateTuitionsOffline.offline === null ? '' : preferences.parentGuardian.privateTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'privateTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Group Tuitions Offline (at teachers home)
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.groupTuitionsOffline.offline === null ? '' : preferences.parentGuardian.groupTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'groupTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Private Tuitions Online (One-One)</td>
                    <td className="disabled">-</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.privateTuitionsOnline.online === null ? '' : preferences.parentGuardian.privateTuitionsOnline.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'privateTuitionsOnline', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Group Tuitions Online (from teacher as tutor)</td>
                    <td className="disabled">-</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.groupTuitionsOnline.online === null ? '' : preferences.parentGuardian.groupTuitionsOnline.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'groupTuitionsOnline', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default JobPreference; 