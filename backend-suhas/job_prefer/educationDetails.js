import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getEducationDetails(event);
      case 'POST':
        return await upsertEducationDetails(body); // Using upsert for POST
      case 'PUT':
        return await upsertEducationDetails(body); // Using upsert for PUT
      case 'DELETE':
        return await deleteEducationDetails(body);
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
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };
}

// ================== UPSERT LOGIC for POST/PUT ==================
// This function will insert a new row if firebase_uid is new,
// or update the existing row if firebase_uid and education_type already exist.
// It uses the ON DUPLICATE KEY UPDATE clause to update the current row.
const upsertEducationDetails = async (requestBody) => {
  console.log('Upsert Education Details Body:', requestBody);
  try {
    const connection = await pool.getConnection();

    let educationData = JSON.parse(requestBody);
    const { firebase_uid, grade10, additionalEducation } = educationData;

    if (!firebase_uid) {
      throw new Error('Missing firebase_uid');
    }

    const detailsArray = [];

    // Process Grade 10 data if provided
    if (grade10 && (grade10.syllabus || grade10.schoolName || grade10.yearOfPassing || grade10.percentage || grade10.mode)) {
      detailsArray.push({
        firebase_uid,
        education_type: 'grade10',
        syllabus: grade10.syllabus || null,
        schoolName: grade10.schoolName || null,
        yearOfPassing: grade10.yearOfPassing || null,
        percentage: grade10.percentage || null,
        mode: grade10.mode || null,
        courseStatus: null,
        courseName: null,
        collegeName: null,
        placeOfStudy: null,
        universityName: null,
        yearOfCompletion: null,
        instituteName: null,
        affiliatedTo: null,
        courseDuration: null,
        specialization: null,
        coreSubjects: null,
        otherSubjects: null,
      });
    }

    // Process additional education records
    if (Array.isArray(additionalEducation)) {
      additionalEducation.forEach((edu) => {
        detailsArray.push({
          firebase_uid,
          education_type: edu.education_type || null,
          syllabus: edu.syllabus || null,
          schoolName: edu.schoolName || null,
          yearOfPassing: edu.yearOfPassing || null,
          percentage: edu.percentage || null,
          mode: edu.mode || null,
          courseStatus: edu.courseStatus || null,
          courseName: edu.courseName || null,
          collegeName: edu.collegeName || null,
          placeOfStudy: edu.placeOfStudy || null,
          universityName: edu.universityName || null,
          yearOfCompletion: edu.yearOfCompletion || null,
          instituteName: edu.instituteName || null,
          affiliatedTo: edu.affiliatedTo || null,
          courseDuration: edu.courseDuration || null,
          specialization: edu.specialization || null,
          coreSubjects: Array.isArray(edu.coreSubjects)
            ? JSON.stringify(edu.coreSubjects)
            : edu.coreSubjects || null,
          otherSubjects: edu.otherSubjects || null,
        });
      });
    }

    // For each education detail record, execute an INSERT ... ON DUPLICATE KEY UPDATE query.
    for (let detail of detailsArray) {
      const query = `
        INSERT INTO education_details (
          firebase_uid, education_type, syllabus, schoolName, yearOfPassing, percentage, mode, courseStatus,
          courseName, collegeName, placeOfStudy, universityName, yearOfCompletion, instituteName,
          affiliatedTo, courseDuration, specialization, coreSubjects, otherSubjects, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
          syllabus = VALUES(syllabus),
          schoolName = VALUES(schoolName),
          yearOfPassing = VALUES(yearOfPassing),
          percentage = VALUES(percentage),
          mode = VALUES(mode),
          courseStatus = VALUES(courseStatus),
          courseName = VALUES(courseName),
          collegeName = VALUES(collegeName),
          placeOfStudy = VALUES(placeOfStudy),
          universityName = VALUES(universityName),
          yearOfCompletion = VALUES(yearOfCompletion),
          instituteName = VALUES(instituteName),
          affiliatedTo = VALUES(affiliatedTo),
          courseDuration = VALUES(courseDuration),
          specialization = VALUES(specialization),
          coreSubjects = VALUES(coreSubjects),
          otherSubjects = VALUES(otherSubjects),
          updated_at = CURRENT_TIMESTAMP
      `;
      await connection.query(query, [
        detail.firebase_uid,
        detail.education_type,
        detail.syllabus,
        detail.schoolName,
        detail.yearOfPassing,
        detail.percentage,
        detail.mode,
        detail.courseStatus,
        detail.courseName,
        detail.collegeName,
        detail.placeOfStudy,
        detail.universityName,
        detail.yearOfCompletion,
        detail.instituteName,
        detail.affiliatedTo,
        detail.courseDuration,
        detail.specialization,
        detail.coreSubjects,
        detail.otherSubjects,
      ]);
    }

    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Education details upserted successfully' }),
    };
  } catch (error) {
    console.error('Error upserting education details:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};

// ================== GET (GET /education) ==================
const getEducationDetails = async (event) => {
  console.log('Get Education Details Event:', event);
  try {
    const connection = await pool.getConnection();
    const firebase_uid = event.queryStringParameters ? event.queryStringParameters.firebase_uid : null;

    let query;
    let params = [];
    if (firebase_uid) {
      query = 'SELECT * FROM education_details WHERE firebase_uid = ?';
      params = [firebase_uid];
    } else {
      query = 'SELECT * FROM education_details';
    }

    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching education details:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};

// ================== DELETE (DELETE /education) ==================
const deleteEducationDetails = async (body) => {
  console.log('Delete Education Details Body:', body);
  try {
    const connection = await pool.getConnection();
    const { id, firebase_uid } = JSON.parse(body);
    const query = 'DELETE FROM education_details WHERE id = ? AND firebase_uid = ?';
    await connection.query(query, [id, firebase_uid]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Education details deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting education details:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};
