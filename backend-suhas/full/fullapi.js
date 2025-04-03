import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getJoinedData();
      default:
        return {
          statusCode: 405,
          headers: corsHeaders(),
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };
}

// ================= GET (JOINED DATA) =================
const getJoinedData = async () => {
  console.log('Fetching All Joined Data');
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT 
        ud.*, 
        pa.country_name AS permanent_country_name,
        pa.state_name AS permanent_state_name,
        pa.city_name AS permanent_city_name,
        pa.house_no_and_street,
        pa.pincode,
        pra.country_name AS present_country_name,
        pra.state_name AS present_state_name,
        pra.city_name AS present_city_name,
        lang.languages,
        ai1.computer_skills,
        ai1.accounting_knowledge,
        ai1.projects,
        ai1.accomplishments,
        ai1.certifications,
        ai1.research_publications,
        ai1.patents,
        ai1.marital_status,
        ai1.spouse_need_job,
        ai1.spouse_name,
        ai1.spouse_qualification,
        ai1.spouse_work_experience,
        ai1.spouse_expertise,
        ai1.accommodation_required,
        ai2.religion,
        ai2.differently_abled,
        ai2.health_issues,
        ai2.aadhaar_number,
        ai2.citizenship,
        ai2.preferable_timings,
        ai2.passport_available,
        ai2.passport_expiry_date,
        ai2.work_permit_details,
        ai2.criminal_charges,
        ai2.additional_info,
        sp.facebook,
        sp.linkedin,
        pp.profile_image_id,
        pp.profile_video_id,
        pp.resume_id,
        jp.full_time_offline,
        jp.full_time_online,
        jp.part_time_weekdays_offline,
        jp.part_time_weekdays_online,
        jp.part_time_weekends_offline,
        jp.part_time_weekends_online,
        jp.part_time_vacations_offline,
        jp.part_time_vacations_online,
        jp.school_college_university_offline,
        jp.school_college_university_online,
        jp.coaching_institute_offline,
        jp.coaching_institute_online,
        jp.Ed_TechCompanies_offline,
        jp.Ed_TechCompanies_online,
        jp.Home_Tutor_offline,
        jp.Home_Tutor_online,
        jp.Private_Tutor_offline,
        jp.Private_Tutor_online,
        jp.Group_Tutor_offline,
        jp.Group_Tutor_online,
        jp.Private_Tutions_online_online,
        jp.full_time_2_offline,
        jp.full_time_2_online,
        jp.part_time_weekdays_2_offline,
        jp.part_time_weekdays_2_online,
        jp.part_time_weekends_2_offline,
        jp.part_time_weekends_2_online,
        jp.part_time_vacations_2_offline,
        jp.part_time_vacations_2_online,
        jp.tuitions_2_offline,
        jp.tuitions_2_online,
        jp.Job_Type,
        jp.expected_salary,
        jp.teaching_designations,
        jp.teaching_curriculum,
        jp.teaching_subjects,
        jp.teaching_grades,
        jp.teaching_coreExpertise,
        jp.administrative_designations,
        jp.administrative_curriculum,
        jp.teaching_administrative_designations,
        jp.teaching_administrative_curriculum,
        jp.teaching_administrative_subjects,
        jp.teaching_administrative_grades,
        jp.teaching_administrative_coreExpertise,
        jp.preferred_country,
        jp.preferred_state,
        jp.preferred_city,
        jp.notice_period,
        jp.created_at AS job_preferences_created_at,
        GROUP_CONCAT(
          CONCAT(
            '{',
              '"education_type":"', IFNULL(ed.education_type, ''), '",',
              '"syllabus":"', IFNULL(ed.syllabus, ''), '",',
              '"schoolName":"', IFNULL(ed.schoolName, ''), '",',
              '"yearOfPassing":"', IFNULL(ed.yearOfPassing, ''), '",',
              '"percentage":"', IFNULL(ed.percentage, ''), '",',
              '"mode":"', IFNULL(ed.mode, ''), '",',
              '"courseStatus":"', IFNULL(ed.courseStatus, ''), '",',
              '"courseName":"', IFNULL(ed.courseName, ''), '",',
              '"collegeName":"', IFNULL(ed.collegeName, ''), '",',
              '"placeOfStudy":"', IFNULL(ed.placeOfStudy, ''), '",',
              '"universityName":"', IFNULL(ed.universityName, ''), '",',
              '"yearOfCompletion":"', IFNULL(ed.yearOfCompletion, ''), '",',
              '"instituteName":"', IFNULL(ed.instituteName, ''), '",',
              '"affiliatedTo":"', IFNULL(ed.affiliatedTo, ''), '",',
              '"courseDuration":"', IFNULL(ed.courseDuration, ''), '",',
              '"specialization":"', IFNULL(ed.specialization, ''), '",',
              '"coreSubjects":"', IFNULL(ed.coreSubjects, ''), '",',
              '"otherSubjects":"', IFNULL(ed.otherSubjects, ''), '",',
              '"created_at":"', IFNULL(ed.created_at, ''), '",',
              '"updated_at":"', IFNULL(ed.updated_at, ''), '"',
            '}'
          )
          SEPARATOR ','
        ) AS education_details_json,
        we.total_experience_years,
        we.total_experience_months,
        we.teaching_experience_years,
        we.teaching_experience_months,
        we.teaching_exp_fulltime_years,
        we.teaching_exp_fulltime_months,
        we.teaching_exp_partime_years,
        we.teaching_exp_partime_months,
        we.administration_fulltime_years,
        we.administration_fulltime_months,
        we.administration_partime_years,
        we.administration_parttime_months,
        we.anyrole_fulltime_years,
        we.anyrole_fulltime_months,
        we.anyrole_partime_years,
        we.anyrole_parttime_months,
        we.Ed_Tech_Company,
        we.on_line,
        we.coaching_tuitions_center,
        we.group_tuitions,
        we.private_tuitions,
        we.home_tuitions
      FROM UserDetails ud
      LEFT JOIN permanent_address pa ON ud.firebase_uid = pa.firebase_uid
      LEFT JOIN present_address pra ON ud.firebase_uid = pra.firebase_uid
      LEFT JOIN languages lang ON ud.firebase_uid = lang.firebase_uid
      LEFT JOIN additional_information1 ai1 ON ud.firebase_uid = ai1.firebase_uid
      LEFT JOIN additional_information2 ai2 ON ud.firebase_uid = ai2.firebase_uid
      LEFT JOIN SocialProfiles sp ON ud.firebase_uid = sp.firebase_uid
      LEFT JOIN profilePic pp ON ud.firebase_uid = pp.firebase_uid
      LEFT JOIN job_preferences jp ON ud.firebase_uid = jp.firebase_uid
      LEFT JOIN education_details ed ON ud.firebase_uid = ed.firebase_uid
      LEFT JOIN workExperience we ON ud.firebase_uid = we.firebase_uid
      GROUP BY ud.firebase_uid
    `;

    const [results] = await connection.query(query);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching joined data:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
