import { pool } from './db.js'; // Ensure db.js is in the same directory

// Define CORS headers to include in every response.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
};

export const handler = async (event) => {
  const { httpMethod, body } = event;
  console.log('Event:', event);

  try {
    // Handle preflight OPTIONS request immediately.
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
        return await createJobPreferences(body);
      case 'PUT':
        return await updateJobPreferences(body);
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

const createJobPreferences = async (body) => {
  console.log('Create Job Preferences Body:', body);
  try {
    const connection = await pool.getConnection();
    let jobPreferences = JSON.parse(body);
    console.log('Parsed Job Preferences:', jobPreferences);

    // Ensure jobPreferences is always an array.
    if (!Array.isArray(jobPreferences)) {
      jobPreferences = [jobPreferences];
    }

    // Map each preference object to an array of values in the order below:
    // 1.  firebase_uid,
    // 2.  full_time_offline,
    // 3.  full_time_online,
    // 4.  part_time_weekdays_offline,
    // 5.  part_time_weekdays_online,
    // 6.  part_time_weekends_offline,
    // 7.  part_time_weekends_online,
    // 8.  part_time_vacations_offline,
    // 9.  part_time_vacations_online,
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
    // 22. Private_Tutions_online_offline,
    // 23. Private_Tutions_online_online,
    // 24. parent_coaching_institute_offline,
    // 25. parent_coaching_institute_online,
    // 26. full_time_2_offline,
    // 27. full_time_2_online,
    // 28. part_time_weekdays_2_offline,
    // 29. part_time_weekdays_2_online,
    // 30. Job_Type,
    // 31. expected_salary,
    // 32. teaching_designations,
    // 33. teaching_curriculum,
    // 34. teaching_subjects,
    // 35. teaching_grades,
    // 36. teaching_coreExpertise,
    // 37. administrative_designations,
    // 38. administrative_curriculum,
    // 39. teaching_administrative_designations,
    // 40. teaching_administrative_curriculum,
    // 41. teaching_administrative_subjects,
    // 42. teaching_administrative_grades,
    // 43. teaching_administrative_coreExpertise,
    // 44. preferred_country,
    // 45. preferred_state,
    // 46. preferred_city,
    // 47. notice_period
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
        Private_Tutions_online_offline,
        Private_Tutions_online_online,
        parent_coaching_institute_offline,
        parent_coaching_institute_online,
        full_time_2_offline,
        full_time_2_online,
        part_time_weekdays_2_offline,
        part_time_weekdays_2_online,
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
        Private_Tutions_online_offline || "",
        Private_Tutions_online_online || "",
        parent_coaching_institute_offline || "",
        parent_coaching_institute_online || "",
        full_time_2_offline || "",
        full_time_2_online || "",
        part_time_weekdays_2_offline || "",
        part_time_weekdays_2_online || "",
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

    // Debug: Log values and expected length (should be 47 per row)
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
        Private_Tutions_online_offline,
        Private_Tutions_online_online,
        parent_coaching_institute_offline,
        parent_coaching_institute_online,
        full_time_2_offline,
        full_time_2_online,
        part_time_weekdays_2_offline,
        part_time_weekdays_2_online,
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
      ) VALUES ?`;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Job preferences created successfully' })
    };
  } catch (error) {
    console.error('Error creating job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};

const getJobPreferences = async (event) => {
  console.log('Get Job Preferences Event:', event);
  try {
    const connection = await pool.getConnection();
    const firebase_uid = event.queryStringParameters ? event.queryStringParameters.firebase_uid : null;
    const query = firebase_uid
      ? 'SELECT * FROM job_preferences WHERE firebase_uid = ?'
      : 'SELECT * FROM job_preferences';
    const [results] = await connection.query(query, firebase_uid ? [firebase_uid] : []);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error fetching job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};

const updateJobPreferences = async (body) => {
  console.log('Update Job Preferences Body:', body);
  try {
    const connection = await pool.getConnection();
    const jobPreferences = JSON.parse(body);

    // For each record, update using firebase_uid as the key.
    // Note: We do not update firebase_uid itself.
    const queries = jobPreferences.map(pref => {
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
        Private_Tutions_online_offline,
        Private_Tutions_online_online,
        parent_coaching_institute_offline,
        parent_coaching_institute_online,
        full_time_2_offline,
        full_time_2_online,
        part_time_weekdays_2_offline,
        part_time_weekdays_2_online,
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

      const query = `
        UPDATE job_preferences SET 
          full_time_offline = ?,
          full_time_online = ?,
          part_time_weekdays_offline = ?,
          part_time_weekdays_online = ?,
          part_time_weekends_offline = ?,
          part_time_weekends_online = ?,
          part_time_vacations_offline = ?,
          part_time_vacations_online = ?,
          school_college_university_offline = ?,
          school_college_university_online = ?,
          coaching_institute_offline = ?,
          coaching_institute_online = ?,
          Ed_TechCompanies_offline = ?,
          Ed_TechCompanies_online = ?,
          Home_Tutor_offline = ?,
          Home_Tutor_online = ?,
          Private_Tutor_offline = ?,
          Private_Tutor_online = ?,
          Group_Tutor_offline = ?,
          Group_Tutor_online = ?,
          Private_Tutions_online_offline = ?,
          Private_Tutions_online_online = ?,
          parent_coaching_institute_offline = ?,
          parent_coaching_institute_online = ?,
          full_time_2_offline = ?,
          full_time_2_online = ?,
          part_time_weekdays_2_offline = ?,
          part_time_weekdays_2_online = ?,
          Job_Type = ?,
          expected_salary = ?,
          teaching_designations = ?,
          teaching_curriculum = ?,
          teaching_subjects = ?,
          teaching_grades = ?,
          teaching_coreExpertise = ?,
          administrative_designations = ?,
          administrative_curriculum = ?,
          teaching_administrative_designations = ?,
          teaching_administrative_curriculum = ?,
          teaching_administrative_subjects = ?,
          teaching_administrative_grades = ?,
          teaching_administrative_coreExpertise = ?,
          preferred_country = ?,
          preferred_state = ?,
          preferred_city = ?,
          notice_period = ?
        WHERE firebase_uid = ?`;
      
      return connection.query(query, [
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
        Private_Tutions_online_offline || "",
        Private_Tutions_online_online || "",
        parent_coaching_institute_offline || "",
        parent_coaching_institute_online || "",
        full_time_2_offline || "",
        full_time_2_online || "",
        part_time_weekdays_2_offline || "",
        part_time_weekdays_2_online || "",
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
        notice_period || "",
        firebase_uid
      ]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Job preferences updated successfully' })
    };
  } catch (error) {
    console.error('Error updating job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
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
      body: JSON.stringify({ message: 'Job preferences deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting job preferences:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};
