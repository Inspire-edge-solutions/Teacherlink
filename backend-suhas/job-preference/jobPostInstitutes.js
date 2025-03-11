import { pool } from "./db.js";

export const handler = async (event) => {
  const { httpMethod, body } = event;
  console.log("Event:", event);

  try {
    switch (httpMethod) {
      case "GET":
        return await getJobPosts();
      case "POST":
        return await createJobPosts(body);
      case "PUT":
        return await updateJobPosts(body);
      case "DELETE":
        return await deleteJobPosts(body);
      default:
        return {
          statusCode: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
          },
          body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

/**
 * Helper: toJson(value)
 * Safely converts arrays/objects to JSON strings for columns defined as JSON.
 * If the incoming value is nullish, default to an empty array (i.e., "[]").
 */
function toJson(value) {
  if (value == null) {
    return JSON.stringify([]); 
  }
  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value);
  }
  // If it's a string, wrap in an array or parse if needed.
  return JSON.stringify([value]);
}

/** CREATE (POST) */
const createJobPosts = async (body) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let jobPosts = JSON.parse(body);
    if (!Array.isArray(jobPosts)) {
      jobPosts = [jobPosts];
    }

    // EXACT 68 columns from your table definition
    const columns = `
      firebase_uid,
      job_title,
      job_type,
      no_of_opening,
      job_description,
      joining_date,
      min_salary,
      max_salary,
      qualification,
      core_subjects,
      optional_subject,

      total_experience_min_years,
      total_experience_min_months,
      total_experience_max_years,
      total_experience_max_months,

      teaching_experience_min_years,
      teaching_experience_min_months,
      teaching_experience_max_years,
      teaching_experience_max_months,

      education_teaching_full_min_years,
      education_teaching_full_min_months,
      education_teaching_full_max_years,
      education_teaching_full_max_months,

      education_teaching_part_min_years,
      education_teaching_part_min_months,
      education_teaching_part_max_years,
      education_teaching_part_max_months,

      education_admin_full_min_years,
      education_admin_full_min_months,
      education_admin_full_max_years,
      education_admin_full_max_months,

      education_admin_part_min_years,
      education_admin_part_min_months,
      education_admin_part_max_years,
      education_admin_part_max_months,

      non_education_full_min_years,
      non_education_full_min_months,
      non_education_full_max_years,
      non_education_full_max_months,

      non_education_part_min_years,
      non_education_part_min_months,
      non_education_part_max_years,
      non_education_part_max_months,

      designations,
      designated_grades,
      curriculum,
      subjects,
      core_expertise,
      job_shifts,
      job_process,
      job_sub_process,
      selection_process,
      tution_types,

      country,
      state_ut,
      city,
      domicile_country,
      domicile_state_ut,

      gender,
      minimum_age,
      maximum_age,
      knowledge_of_acc_process,
      notice_period,
      job_search_status,

      language_speak,
      language_read,
      language_write,
      computer_skills
    `.replace(/\s+/g, " ");

    // Build placeholders for 68 columns
    const placeholders = Array(68).fill("?").join(",");
    const insertSQL = `INSERT INTO job_posts (${columns}) VALUES (${placeholders})`;

    console.log("Insert SQL (createJobPosts):", insertSQL);

    for (const p of jobPosts) {
      // Convert "p" to an array of 68 corresponding values
      const values = [
        p.firebase_uid || null,
        p.job_title || "",
        p.job_type || "",
        parseInt(p.no_of_opening, 10) || 0,
        p.job_description || "",
        p.joining_date || null,
        p.min_salary ? parseFloat(p.min_salary) : null,
        p.max_salary ? parseFloat(p.max_salary) : null,

        // Qualifications
        p.qualification || "",
        toJson(p.core_subjects),
        p.optional_subject || "",

        // (1) All Experience
        p.total_experience_min_years || "",
        p.total_experience_min_months || "",
        p.total_experience_max_years || "",
        p.total_experience_max_months || "",

        // (2) Teaching Experience
        p.teaching_experience_min_years || "",
        p.teaching_experience_min_months || "",
        p.teaching_experience_max_years || "",
        p.teaching_experience_max_months || "",

        // (3) Education - Teaching (Full Time)
        p.education_teaching_full_min_years || "",
        p.education_teaching_full_min_months || "",
        p.education_teaching_full_max_years || "",
        p.education_teaching_full_max_months || "",

        // (4) Education - Teaching (Part Time)
        p.education_teaching_part_min_years || "",
        p.education_teaching_part_min_months || "",
        p.education_teaching_part_max_years || "",
        p.education_teaching_part_max_months || "",

        // (5) Education - Admin (Full Time)
        p.education_admin_full_min_years || "",
        p.education_admin_full_min_months || "",
        p.education_admin_full_max_years || "",
        p.education_admin_full_max_months || "",

        // (6) Education - Admin (Part Time)
        p.education_admin_part_min_years || "",
        p.education_admin_part_min_months || "",
        p.education_admin_part_max_years || "",
        p.education_admin_part_max_months || "",

        // (7) Non-Education - Any Role (Full Time)
        p.non_education_full_min_years || "",
        p.non_education_full_min_months || "",
        p.non_education_full_max_years || "",
        p.non_education_full_max_months || "",

        // (8) Non-Education - Any Role (Part Time)
        p.non_education_part_min_years || "",
        p.non_education_part_min_months || "",
        p.non_education_part_max_years || "",
        p.non_education_part_max_months || "",

        // Multi-Select JSON fields
        toJson(p.designations),
        toJson(p.designated_grades),
        toJson(p.curriculum),
        toJson(p.subjects),
        toJson(p.core_expertise),
        toJson(p.job_shifts),
        toJson(p.job_process),
        toJson(p.job_sub_process),
        toJson(p.selection_process),
        toJson(p.tution_types),

        // Location
        p.country || "",
        p.state_ut || "",
        p.city || "",
        p.domicile_country || "",
        p.domicile_state_ut || "",

        // Preferences / Additional
        p.gender || "",
        parseInt(p.minimum_age, 10) || 0,
        parseInt(p.maximum_age, 10) || 0,
        p.knowledge_of_acc_process || "",
        p.notice_period || "",
        p.job_search_status || "",

        // Languages
        toJson(p.language_speak),
        toJson(p.language_read),
        toJson(p.language_write),
        toJson(p.computer_skills)
      ];

      await connection.query(insertSQL, values);
    }

    await connection.commit();
    connection.release();
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Job posts created successfully" })
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error creating job posts:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

/** READ (GET) */
const getJobPosts = async () => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query("SELECT * FROM job_posts");
    connection.release();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify(results)
    };
  } catch (error) {
    connection.release();
    console.error("Error fetching job posts:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

/** UPDATE (PUT) */
const updateJobPosts = async (body) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let jobPosts = JSON.parse(body);
    if (!Array.isArray(jobPosts)) {
      jobPosts = [jobPosts];
    }

    // same 68 columns, plus "WHERE id = ?"
    const columns = `
      firebase_uid = ?,
      job_title = ?,
      job_type = ?,
      no_of_opening = ?,
      job_description = ?,
      joining_date = ?,
      min_salary = ?,
      max_salary = ?,
      qualification = ?,
      core_subjects = ?,
      optional_subject = ?,

      total_experience_min_years = ?,
      total_experience_min_months = ?,
      total_experience_max_years = ?,
      total_experience_max_months = ?,

      teaching_experience_min_years = ?,
      teaching_experience_min_months = ?,
      teaching_experience_max_years = ?,
      teaching_experience_max_months = ?,

      education_teaching_full_min_years = ?,
      education_teaching_full_min_months = ?,
      education_teaching_full_max_years = ?,
      education_teaching_full_max_months = ?,

      education_teaching_part_min_years = ?,
      education_teaching_part_min_months = ?,
      education_teaching_part_max_years = ?,
      education_teaching_part_max_months = ?,

      education_admin_full_min_years = ?,
      education_admin_full_min_months = ?,
      education_admin_full_max_years = ?,
      education_admin_full_max_months = ?,

      education_admin_part_min_years = ?,
      education_admin_part_min_months = ?,
      education_admin_part_max_years = ?,
      education_admin_part_max_months = ?,

      non_education_full_min_years = ?,
      non_education_full_min_months = ?,
      non_education_full_max_years = ?,
      non_education_full_max_months = ?,

      non_education_part_min_years = ?,
      non_education_part_min_months = ?,
      non_education_part_max_years = ?,
      non_education_part_max_months = ?,

      designations = ?,
      designated_grades = ?,
      curriculum = ?,
      subjects = ?,
      core_expertise = ?,
      job_shifts = ?,
      job_process = ?,
      job_sub_process = ?,
      selection_process = ?,
      tution_types = ?,

      country = ?,
      state_ut = ?,
      city = ?,
      domicile_country = ?,
      domicile_state_ut = ?,

      gender = ?,
      minimum_age = ?,
      maximum_age = ?,
      knowledge_of_acc_process = ?,
      notice_period = ?,
      job_search_status = ?,

      language_speak = ?,
      language_read = ?,
      language_write = ?,
      computer_skills = ?
    `.replace(/\s+/g, " ");

    const updateSQL = `UPDATE job_posts SET ${columns} WHERE id = ?`;
    console.log("Update SQL (updateJobPosts):", updateSQL);

    for (const p of jobPosts) {
      if (!p.id) {
        console.error("Skipping update: missing p.id", p);
        continue;
      }

      const values = [
        p.firebase_uid || null,
        p.job_title || "",
        p.job_type || "",
        parseInt(p.no_of_opening, 10) || 0,
        p.job_description || "",
        p.joining_date || null,
        p.min_salary ? parseFloat(p.min_salary) : null,
        p.max_salary ? parseFloat(p.max_salary) : null,

        p.qualification || "",
        toJson(p.core_subjects),
        p.optional_subject || "",

        p.total_experience_min_years || "",
        p.total_experience_min_months || "",
        p.total_experience_max_years || "",
        p.total_experience_max_months || "",

        p.teaching_experience_min_years || "",
        p.teaching_experience_min_months || "",
        p.teaching_experience_max_years || "",
        p.teaching_experience_max_months || "",

        p.education_teaching_full_min_years || "",
        p.education_teaching_full_min_months || "",
        p.education_teaching_full_max_years || "",
        p.education_teaching_full_max_months || "",

        p.education_teaching_part_min_years || "",
        p.education_teaching_part_min_months || "",
        p.education_teaching_part_max_years || "",
        p.education_teaching_part_max_months || "",

        p.education_admin_full_min_years || "",
        p.education_admin_full_min_months || "",
        p.education_admin_full_max_years || "",
        p.education_admin_full_max_months || "",

        p.education_admin_part_min_years || "",
        p.education_admin_part_min_months || "",
        p.education_admin_part_max_years || "",
        p.education_admin_part_max_months || "",

        p.non_education_full_min_years || "",
        p.non_education_full_min_months || "",
        p.non_education_full_max_years || "",
        p.non_education_full_max_months || "",

        p.non_education_part_min_years || "",
        p.non_education_part_min_months || "",
        p.non_education_part_max_years || "",
        p.non_education_part_max_months || "",

        toJson(p.designations),
        toJson(p.designated_grades),
        toJson(p.curriculum),
        toJson(p.subjects),
        toJson(p.core_expertise),
        toJson(p.job_shifts),
        toJson(p.job_process),
        toJson(p.job_sub_process),
        toJson(p.selection_process),
        toJson(p.tution_types),

        p.country || "",
        p.state_ut || "",
        p.city || "",
        p.domicile_country || "",
        p.domicile_state_ut || "",

        p.gender || "",
        parseInt(p.minimum_age, 10) || 0,
        parseInt(p.maximum_age, 10) || 0,
        p.knowledge_of_acc_process || "",
        p.notice_period || "",
        p.job_search_status || "",

        toJson(p.language_speak),
        toJson(p.language_read),
        toJson(p.language_write),
        toJson(p.computer_skills),

        // ID at the end
        p.id
      ];

      console.log("Values array + id:", values);
      await connection.query(updateSQL, values);
    }

    await connection.commit();
    connection.release();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Job posts updated successfully" })
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error updating job posts:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

/** DELETE (DELETE) */
const deleteJobPosts = async (body) => {
  const connection = await pool.getConnection();
  try {
    const ids = JSON.parse(body); // array of "id" values
    await connection.query(`DELETE FROM job_posts WHERE id IN (?)`, [ids]);
    connection.release();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Job posts deleted successfully" })
    };
  } catch (error) {
    connection.release();
    console.error("Error deleting job posts:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};
