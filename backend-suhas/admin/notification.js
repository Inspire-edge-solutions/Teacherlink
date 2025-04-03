// filterCandidates.js
import { pool } from './db.js'; // Import your MySQL connection pool

// Helper function to build filter conditions for text fields using a case-insensitive LIKE
const buildFilterCondition = (field, value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  if (Array.isArray(value)) {
    const conds = value.map(() => `LOWER(${field}) LIKE LOWER(?)`);
    const condition = `(${conds.join(' OR ')})`;
    const params = value.map(val => `%${val}%`);
    return { condition, params };
  } else {
    return { condition: `LOWER(${field}) LIKE LOWER(?)`, params: [`%${value}%`] };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
  };
}

export const filterCandidates = async (event) => {
  let body;
  // Support both GET (via query parameters) and POST (via JSON body)
  if (event.httpMethod === 'GET') {
    body = event.queryStringParameters || {};
  } else if (event.httpMethod === 'POST') {
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (error) {
      console.error("Invalid JSON input:", event.body);
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Invalid JSON input' })
      };
    }
  }

  // Destructure filtering fields from the request body.
  // The expected fields are:
  // - min_age, max_age (numeric; used to compute candidate age from dateOfBirth)
  // - languages (array; from the languages table)
  // - full_time_offline, full_time_online, Home_Tutor_offline, Home_Tutor_online, 
  //   Private_Tutor_offline, Private_Tutor_online, expected_salary (numeric; from job_preferences)
  // - courseName (array; from education_details)
  // - total_experience_years (numeric; from workExperience)
  const {
    min_age,
    max_age,
    languages,
    full_time_offline,
    full_time_online,
    Home_Tutor_offline,
    Home_Tutor_online,
    Private_Tutor_offline,
    Private_Tutor_online,
    expected_salary,
    courseName,
    total_experience_years
  } = body;

  // Build the base query.
  // Here, the main candidate details are stored in UserDetails (which includes dateOfBirth)
  let query = `
    SELECT j.*, 
           l.language, 
           jp.full_time_offline, jp.full_time_online, jp.Home_Tutor_offline, jp.Home_Tutor_online, 
           jp.Private_Tutor_offline, jp.Private_Tutor_online, jp.expected_salary,
           ed.courseName,
           we.total_experience_years
    FROM UserDetails j
    LEFT JOIN languages l ON j.firebase_uid = l.firebase_uid
    LEFT JOIN job_preferences jp ON j.firebase_uid = jp.firebase_uid
    LEFT JOIN education_details ed ON j.firebase_uid = ed.firebase_uid
    LEFT JOIN workExperience we ON j.firebase_uid = we.firebase_uid
    WHERE 1=1
  `;
  let params = [];

  // Age Filtering: Calculate candidate's age from j.dateOfBirth using TIMESTAMPDIFF
  if (min_age !== undefined && min_age !== null) {
    query += ` AND TIMESTAMPDIFF(YEAR, j.dateOfBirth, CURDATE()) >= ? `;
    params.push(min_age);
  }
  if (max_age !== undefined && max_age !== null) {
    query += ` AND TIMESTAMPDIFF(YEAR, j.dateOfBirth, CURDATE()) <= ? `;
    params.push(max_age);
  }

  // Languages Filtering (from languages table)
  const langCond = buildFilterCondition("l.language", languages);
  if (langCond) {
    query += ` AND ${langCond.condition} `;
    params = params.concat(langCond.params);
  }

  // Job Preferences Filtering
  if (full_time_offline !== undefined) {
    query += ` AND jp.full_time_offline >= ? `;
    params.push(full_time_offline);
  }
  if (full_time_online !== undefined) {
    query += ` AND jp.full_time_online >= ? `;
    params.push(full_time_online);
  }
  if (Home_Tutor_offline !== undefined) {
    query += ` AND jp.Home_Tutor_offline >= ? `;
    params.push(Home_Tutor_offline);
  }
  if (Home_Tutor_online !== undefined) {
    query += ` AND jp.Home_Tutor_online >= ? `;
    params.push(Home_Tutor_online);
  }
  if (Private_Tutor_offline !== undefined) {
    query += ` AND jp.Private_Tutor_offline >= ? `;
    params.push(Private_Tutor_offline);
  }
  if (Private_Tutor_online !== undefined) {
    query += ` AND jp.Private_Tutor_online >= ? `;
    params.push(Private_Tutor_online);
  }
  if (expected_salary !== undefined) {
    // For salary, we assume the candidate's expected salary should be below or equal to the provided value.
    query += ` AND jp.expected_salary <= ? `;
    params.push(expected_salary);
  }

  // Education Details Filtering (courseName)
  const courseCond = buildFilterCondition("ed.courseName", courseName);
  if (courseCond) {
    query += ` AND ${courseCond.condition} `;
    params = params.concat(courseCond.params);
  }

  // Work Experience Filtering (overall experience)
  if (total_experience_years !== undefined) {
    query += ` AND we.total_experience_years >= ? `;
    params.push(total_experience_years);
  }

  console.log("Final Query:", query);
  console.log("Parameters:", params);

  try {
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "No candidates match the given criteria." })
      };
    }
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(rows)
    };
  } catch (error) {
    console.error("Error executing query", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
