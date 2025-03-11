import { pool } from './db.js';

export const handler = async (event) => {
  const { httpMethod, body } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getEducationDetails(event);
      case 'POST':
        return await createEducationDetails(body);
      case 'PUT':
        return await updateEducationDetails(body);
      case 'DELETE':
        return await deleteEducationDetails(body);
      default:
        return {
          statusCode: 405,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
          },
          body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

const createEducationDetails = async (body) => {
  console.log('Create Education Details Body:', body);
  try {
    const educationData = JSON.parse(body);
    const detailsArray = [];
    
    // Extract firebase_uid from the top-level payload.
    const firebase_uid = educationData.firebase_uid || null;

    // Process Grade 10 record if any field is provided.
    const grade10 = educationData.grade10 || {};
    const hasGrade10Data =
      grade10.syllabus ||
      grade10.schoolName ||
      grade10.yearOfPassing ||
      grade10.percentage ||
      grade10.mode;
    if (hasGrade10Data) {
      detailsArray.push({
        firebase_uid, // add firebase_uid
        education_type: "grade10",
        syllabus: grade10.syllabus || null,
        schoolName: grade10.schoolName || null,
        yearOfPassing: grade10.yearOfPassing || null,
        percentage: grade10.percentage || null,
        mode: grade10.mode || null,
        // Not applicable for Grade 10
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

    // Process additional education records.
    if (Array.isArray(educationData.additionalEducation)) {
      educationData.additionalEducation.forEach((edu) => {
        detailsArray.push({
          firebase_uid, // add firebase_uid to each record
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
          // For coreSubjects, if it is an array, store as JSON.
          coreSubjects: Array.isArray(edu.coreSubjects)
            ? JSON.stringify(edu.coreSubjects)
            : edu.coreSubjects || null,
          otherSubjects: edu.otherSubjects || null,
        });
      });
    }

    // Map detailsArray into rows for bulk insert.
    const values = detailsArray.map((detail) => [
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
      new Date().toISOString()
    ]);

    const query = `INSERT INTO education_details (
      firebase_uid, education_type, syllabus, schoolName, yearOfPassing, percentage, mode, courseStatus,
      courseName, collegeName, placeOfStudy, universityName, yearOfCompletion, instituteName,
      affiliatedTo, courseDuration, specialization, coreSubjects, otherSubjects, created_at
    ) VALUES ?`;

    const connection = await pool.getConnection();
    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Education details created successfully" }),
    };
  } catch (error) {
    console.error("Error creating education details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Internal Server Error", error })
    };
  }
};

const getEducationDetails = async (event) => {
  console.log("Get Education Details Event:", event);
  try {
    const connection = await pool.getConnection();
    
    // Extract firebase_uid from query parameters if provided.
    const firebase_uid = event.queryStringParameters ? event.queryStringParameters.firebase_uid : null;
    
    let query;
    let params = [];
    if (firebase_uid) {
      query = "SELECT * FROM education_details WHERE firebase_uid = ?";
      params = [firebase_uid];
    } else {
      query = "SELECT * FROM education_details";
    }
    
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error fetching education details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Internal Server Error", error })
    };
  }
};

const updateEducationDetails = async (body) => {
  console.log("Update Education Details Body:", body);
  try {
    const connection = await pool.getConnection();
    const educationDetails = JSON.parse(body);

    const queries = educationDetails.map((detail) => {
      const {
        id, // Each record must include its id for updates.
        firebase_uid, // add firebase_uid for filtering
        education_type,
        syllabus,
        schoolName,
        yearOfPassing,
        percentage,
        mode,
        courseStatus,
        courseName,
        collegeName,
        placeOfStudy,
        universityName,
        yearOfCompletion,
        instituteName,
        affiliatedTo,
        courseDuration,
        specialization,
        coreSubjects,
        otherSubjects,
      } = detail;

      const query = `UPDATE education_details SET 
        education_type = ?, syllabus = ?, schoolName = ?, yearOfPassing = ?, percentage = ?, mode = ?, 
        courseStatus = ?, courseName = ?, collegeName = ?, placeOfStudy = ?, universityName = ?, yearOfCompletion = ?,
        instituteName = ?, affiliatedTo = ?, courseDuration = ?, specialization = ?, coreSubjects = ?, otherSubjects = ?
        WHERE id = ? AND firebase_uid = ?`;

      return connection.query(query, [
        education_type || null,
        syllabus || null,
        schoolName || null,
        yearOfPassing || null,
        percentage || null,
        mode || null,
        courseStatus || null,
        courseName || null,
        collegeName || null,
        placeOfStudy || null,
        universityName || null,
        yearOfCompletion || null,
        instituteName || null,
        affiliatedTo || null,
        courseDuration || null,
        specialization || null,
        coreSubjects ? (Array.isArray(coreSubjects) ? JSON.stringify(coreSubjects) : coreSubjects) : null,
        otherSubjects || null,
        id,
        firebase_uid
      ]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Education details updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating education details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Internal Server Error", error })
    };
  }
};

const deleteEducationDetails = async (body) => {
  console.log("Delete Education Details Body:", body);
  try {
    const connection = await pool.getConnection();
    // Expect an object with the record id and firebase_uid for deletion.
    const { id, firebase_uid } = JSON.parse(body);
    const query = "DELETE FROM education_details WHERE id = ? AND firebase_uid = ?";
    await connection.query(query, [id, firebase_uid]);
    connection.release();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Education details deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting education details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Internal Server Error", error })
    };
  }
};
