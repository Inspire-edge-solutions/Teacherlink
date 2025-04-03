import { pool } from './db.js'; // Ensure db.js exports your MySQL connection pool

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
};

export const handler = async (event) => {
  const { httpMethod, body } = event;
  console.log('Event:', event);

  try {
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Preflight request successful' }),
      };
    }

    switch (httpMethod) {
      case 'GET':
        return await getJobPreferences(event);
      case 'POST':
      case 'PUT':
        return await upsertJobPreferences(body);
      case 'DELETE':
        return await deleteJobPreferences(body);
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const upsertJobPreferences = async (requestBody) => {
  console.log('Upsert Job Preferences Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let jobPreferences = JSON.parse(requestBody);
    console.log('Parsed Job Preferences:', jobPreferences);

    if (!Array.isArray(jobPreferences)) {
      jobPreferences = [jobPreferences];
    }

    // There are now 50 columns as per the updated mapping:
    // 1. firebase_uid,
    // 2. full_time_offline,
    // 3. full_time_online,
    // 4. part_time_weekdays_offline,
    // 5. part_time_weekdays_online,
    // 6. part_time_weekends_offline,
    // 7. part_time_weekends_online,
    // 8. part_time_vacations_offline,
    // 9. part_time_vacations_online,
    // 10. school_college_university_offline,
    // 11. school_college_university_online,
    // 12. coaching_institute_offline,
    // 13. coaching_institute_online,
    // 14. Ed_TechCompanies_offline,
    // 15. Ed_TechCompanies_online,
    // 16. Home_Tutor_offline,
    // 17. Home_Tutor_online,
    // 18. Private_Tutor_offline,
    // 19. Private_Tutor_online,
    // 20. Group_Tutor_offline,
    // 21. Group_Tutor_online,
    // 22. Private_Tutions_online_online,
    // 23. full_time_2_offline,
    // 24. full_time_2_online,
    // 25. part_time_weekdays_2_offline,
    // 26. part_time_weekdays_2_online,
    // 27. part_time_weekends_2_offline,
    // 28. part_time_weekends_2_online,
    // 29. part_time_vacations_2_offline,
    // 30. part_time_vacations_2_online,
    // 31. tuitions_2_offline,
    // 32. tuitions_2_online,
    // 33. Job_Type,
    // 34. expected_salary,
    // 35. teaching_designations,
    // 36. teaching_curriculum,
    // 37. teaching_subjects,
    // 38. teaching_grades,
    // 39. teaching_coreExpertise,
    // 40. administrative_designations,
    // 41. administrative_curriculum,
    // 42. teaching_administrative_designations,
    // 43. teaching_administrative_curriculum,
    // 44. teaching_administrative_subjects,
    // 45. teaching_administrative_grades,
    // 46. teaching_administrative_coreExpertise,
    // 47. preferred_country,
    // 48. preferred_state,
    // 49. preferred_city,
    // 50. notice_period
    const values = jobPreferences.map(pref => {
      const {
        firebase_uid,
        full_time_offline,
        full_time_online,
        part_time_weekdays_offline,
        part_time_weekdays_online,
        part_time_weekends_offline,
        part_time_weekends_online,
        part_time_vacations_offline,
        part_time_vacations_online,
        school_college_university_offline,
        school_college_university_online,
        coaching_institute_offline,
        coaching_institute_online,
        Ed_TechCompanies_offline,
        Ed_TechCompanies_online,
        Home_Tutor_offline,
        Home_Tutor_online,
        Private_Tutor_offline,
        Private_Tutor_online,
        Group_Tutor_offline,
        Group_Tutor_online,
        Private_Tutions_online_online,
        full_time_2_offline,
        full_time_2_online,
        part_time_weekdays_2_offline,
        part_time_weekdays_2_online,
        part_time_weekends_2_offline,
        part_time_weekends_2_online,
        part_time_vacations_2_offline,
        part_time_vacations_2_online,
        tuitions_2_offline,
        tuitions_2_online,
        Job_Type,
        expected_salary,
        teaching_designations,
        teaching_curriculum,
        teaching_subjects,
        teaching_grades,
        teaching_coreExpertise,
        administrative_designations,
        administrative_curriculum,
        teaching_administrative_designations,
        teaching_administrative_curriculum,
        teaching_administrative_subjects,
        teaching_administrative_grades,
        teaching_administrative_coreExpertise,
        preferred_country,
        preferred_state,
        preferred_city,
        notice_period
      } = pref;
      
      return [
        firebase_uid || "",
        full_time_offline || "",
        full_time_online || "",
        part_time_weekdays_offline || "",
        part_time_weekdays_online || "",
        part_time_weekends_offline || "",
        part_time_weekends_online || "",
        part_time_vacations_offline || "",
        part_time_vacations_online || "",
        school_college_university_offline || "",
        school_college_university_online || "",
        coaching_institute_offline || "",
        coaching_institute_online || "",
        Ed_TechCompanies_offline || "",
        Ed_TechCompanies_online || "",
        Home_Tutor_offline || "",
        Home_Tutor_online || "",
        Private_Tutor_offline || "",
        Private_Tutor_online || "",
        Group_Tutor_offline || "",
        Group_Tutor_online || "",
        Private_Tutions_online_online || "",
        full_time_2_offline || "",
        full_time_2_online || "",
        part_time_weekdays_2_offline || "",
        part_time_weekdays_2_online || "",
        part_time_weekends_2_offline || "",
        part_time_weekends_2_online || "",
        part_time_vacations_2_offline || "",
        part_time_vacations_2_online || "",
        tuitions_2_offline || "",
        tuitions_2_online || "",
        Job_Type || "",
        expected_salary || "",
        JSON.stringify(teaching_designations || []),
        JSON.stringify(teaching_curriculum || []),
        JSON.stringify(teaching_subjects || []),
        JSON.stringify(teaching_grades || []),
        JSON.stringify(teaching_coreExpertise || []),
        JSON.stringify(administrative_designations || []),
        JSON.stringify(administrative_curriculum || []),
        JSON.stringify(teaching_administrative_designations || []),
        JSON.stringify(teaching_administrative_curriculum || []),
        JSON.stringify(teaching_administrative_subjects || []),
        JSON.stringify(teaching_administrative_grades || []),
        JSON.stringify(teaching_administrative_coreExpertise || []),
        preferred_country || "",
        preferred_state || "",
        preferred_city || "",
        notice_period || ""
      ];
    });

    console.log("MySQL Values:", values, "Length per row:", values[0].length);

    const query = `
      INSERT INTO job_preferences (
        firebase_uid,
        full_time_offline,
        full_time_online,
        part_time_weekdays_offline,
        part_time_weekdays_online,
        part_time_weekends_offline,
        part_time_weekends_online,
        part_time_vacations_offline,
        part_time_vacations_online,
        school_college_university_offline,
        school_college_university_online,
        coaching_institute_offline,
        coaching_institute_online,
        Ed_TechCompanies_offline,
        Ed_TechCompanies_online,
        Home_Tutor_offline,
        Home_Tutor_online,
        Private_Tutor_offline,
        Private_Tutor_online,
        Group_Tutor_offline,
        Group_Tutor_online,
        Private_Tutions_online_online,
        full_time_2_offline,
        full_time_2_online,
        part_time_weekdays_2_offline,
        part_time_weekdays_2_online,
        part_time_weekends_2_offline,
        part_time_weekends_2_online,
        part_time_vacations_2_offline,
        part_time_vacations_2_online,
        tuitions_2_offline,
        tuitions_2_online,
        Job_Type,
        expected_salary,
        teaching_designations,
        teaching_curriculum,
        teaching_subjects,
        teaching_grades,
        teaching_coreExpertise,
        administrative_designations,
        administrative_curriculum,
        teaching_administrative_designations,
        teaching_administrative_curriculum,
        teaching_administrative_subjects,
        teaching_administrative_grades,
        teaching_administrative_coreExpertise,
        preferred_country,
        preferred_state,
        preferred_city,
        notice_period
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        full_time_offline = VALUES(full_time_offline),
        full_time_online = VALUES(full_time_online),
        part_time_weekdays_offline = VALUES(part_time_weekdays_offline),
        part_time_weekdays_online = VALUES(part_time_weekdays_online),
        part_time_weekends_offline = VALUES(part_time_weekends_offline),
        part_time_weekends_online = VALUES(part_time_weekends_online),
        part_time_vacations_offline = VALUES(part_time_vacations_offline),
        part_time_vacations_online = VALUES(part_time_vacations_online),
        school_college_university_offline = VALUES(school_college_university_offline),
        school_college_university_online = VALUES(school_college_university_online),
        coaching_institute_offline = VALUES(coaching_institute_offline),
        coaching_institute_online = VALUES(coaching_institute_online),
        Ed_TechCompanies_offline = VALUES(Ed_TechCompanies_offline),
        Ed_TechCompanies_online = VALUES(Ed_TechCompanies_online),
        Home_Tutor_offline = VALUES(Home_Tutor_offline),
        Home_Tutor_online = VALUES(Home_Tutor_online),
        Private_Tutor_offline = VALUES(Private_Tutor_offline),
        Private_Tutor_online = VALUES(Private_Tutor_online),
        Group_Tutor_offline = VALUES(Group_Tutor_offline),
        Group_Tutor_online = VALUES(Group_Tutor_online),
        Private_Tutions_online_online = VALUES(Private_Tutions_online_online),
        full_time_2_offline = VALUES(full_time_2_offline),
        full_time_2_online = VALUES(full_time_2_online),
        part_time_weekdays_2_offline = VALUES(part_time_weekdays_2_offline),
        part_time_weekdays_2_online = VALUES(part_time_weekdays_2_online),
        part_time_weekends_2_offline = VALUES(part_time_weekends_2_offline),
        part_time_weekends_2_online = VALUES(part_time_weekends_2_online),
        part_time_vacations_2_offline = VALUES(part_time_vacations_2_offline),
        part_time_vacations_2_online = VALUES(part_time_vacations_2_online),
        tuitions_2_offline = VALUES(tuitions_2_offline),
        tuitions_2_online = VALUES(tuitions_2_online),
        Job_Type = VALUES(Job_Type),
        expected_salary = VALUES(expected_salary),
        teaching_designations = VALUES(teaching_designations),
        teaching_curriculum = VALUES(teaching_curriculum),
        teaching_subjects = VALUES(teaching_subjects),
        teaching_grades = VALUES(teaching_grades),
        teaching_coreExpertise = VALUES(teaching_coreExpertise),
        administrative_designations = VALUES(administrative_designations),
        administrative_curriculum = VALUES(administrative_curriculum),
        teaching_administrative_designations = VALUES(teaching_administrative_designations),
        teaching_administrative_curriculum = VALUES(teaching_administrative_curriculum),
        teaching_administrative_subjects = VALUES(teaching_administrative_subjects),
        teaching_administrative_grades = VALUES(teaching_administrative_grades),
        teaching_administrative_coreExpertise = VALUES(teaching_administrative_coreExpertise),
        preferred_country = VALUES(preferred_country),
        preferred_state = VALUES(preferred_state),
        preferred_city = VALUES(preferred_city),
        notice_period = VALUES(notice_period)
    `;
    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Job preferences upserted successfully' }),
    };
  } catch (error) {
    console.error('Error upserting job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const getJobPreferences = async (event) => {
  console.log('Get Job Preferences Event:', event);
  try {
    const connection = await pool.getConnection();
    const firebase_uid = event.queryStringParameters 
      ? event.queryStringParameters.firebase_uid 
      : null;
    const query = firebase_uid
      ? 'SELECT * FROM job_preferences WHERE firebase_uid = ?'
      : 'SELECT * FROM job_preferences';
    const [results] = await connection.query(query, firebase_uid ? [firebase_uid] : []);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const deleteJobPreferences = async (body) => {
  console.log('Delete Job Preferences Body:', body);
  try {
    const connection = await pool.getConnection();
    // Expecting an array of firebase_uid values for deletion.
    const ids = JSON.parse(body);
    const query = 'DELETE FROM job_preferences WHERE firebase_uid IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Job preferences deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
