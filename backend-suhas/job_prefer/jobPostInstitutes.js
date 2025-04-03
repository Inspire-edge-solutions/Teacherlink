import { pool } from "./db.js";

// Helper: Ensure value is an array.
const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim() !== "") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return val.split(",").map(item => item.trim()).filter(item => item);
    }
  }
  return [];
};

// Helper: Convert date from dd/mm/yyyy to yyyy-mm-dd.
const convertDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes("-")) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const dd = parts[0].padStart(2, "0");
    const mm = parts[1].padStart(2, "0");
    const yyyy = parts[2];
    return `${yyyy}-${mm}-${dd}`;
  }
  return dateStr;
};

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

/** CREATE (POST) */
const createJobPosts = async (body) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    let jobPosts = JSON.parse(body);
    if (!Array.isArray(jobPosts)) {
      jobPosts = [jobPosts];
    }

    // 71 columns (order must match your table exactly)
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
      computer_skills,
      
      location,
      latitude,
      longitude
    `.replace(/\s+/g, " ");
    
    const placeholders = Array(71).fill("?").join(",");
    const insertSQL = `INSERT INTO job_posts (${columns}) VALUES (${placeholders})`;
    console.log("Insert SQL (createJobPosts):", insertSQL);
    
    for (const p of jobPosts) {
      const values = [
        p.firebase_uid || null,
        p.job_title || "",
        p.job_type || "",
        parseInt(p.no_of_opening, 10) || 0,
        p.job_description || "",
        p.joining_date ? convertDate(p.joining_date) : null,
        p.min_salary ? parseInt(p.min_salary, 10) : null, // updated for BIGINT
        p.max_salary ? parseInt(p.max_salary, 10) : null, // updated for BIGINT
        
        // qualification and optional_subject stored as JSON
        p.qualification ? JSON.stringify(p.qualification) : null,
        JSON.stringify(ensureArray(p.core_subjects)),
        p.optional_subject ? JSON.stringify(p.optional_subject) : null,
        
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
        
        // Multi‑select fields (convert to JSON string)
        JSON.stringify(ensureArray(p.designations).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.designated_grades).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.curriculum).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.subjects).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.core_expertise).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_shifts).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_sub_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.selection_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.tution_types).map(item => item.value || item)),
        
        // Location fields
        p.country || "",
        p.state_ut || "",
        p.city || "",
        p.domicile_country || "",
        p.domicile_state_ut || "",
        
        // Preferences / Additional fields
        p.gender || "",
        parseInt(p.minimum_age, 10) || 0,
        parseInt(p.maximum_age, 10) || 0,
        p.knowledge_of_acc_process || "",
        p.notice_period || "",
        p.job_search_status || "",
        
        // Languages and Computer Skills (JSON)
        JSON.stringify(ensureArray(p.language_speak).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.language_read).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.language_write).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.computer_skills).map(item => item.value || item)),

        // New fields: location, latitude, longitude
        p.location || "",
        p.latitude ? parseInt(p.latitude, 10) : null,
        p.longitude ? parseInt(p.longitude, 10) : null
      ];
      
      console.log("Values array:", values);
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
    if (!Array.isArray(jobPosts)) jobPosts = [jobPosts];
    
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
      computer_skills = ?,
      
      location = ?,
      latitude = ?,
      longitude = ?
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
        p.joining_date ? convertDate(p.joining_date) : null,
        p.min_salary ? parseInt(p.min_salary, 10) : null, // updated for BIGINT
        p.max_salary ? parseInt(p.max_salary, 10) : null, // updated for BIGINT
        
        // qualification and optional_subject stored as JSON
        p.qualification ? JSON.stringify(p.qualification) : null,
        JSON.stringify(ensureArray(p.core_subjects)),
        p.optional_subject ? JSON.stringify(p.optional_subject) : null,
        
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
        
        JSON.stringify(ensureArray(p.designations).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.designated_grades).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.curriculum).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.subjects).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.core_expertise).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_shifts).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.job_sub_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.selection_process).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.tution_types).map(item => item.value || item)),
        
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
        
        JSON.stringify(ensureArray(p.language_speak).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.language_read).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.language_write).map(item => item.value || item)),
        JSON.stringify(ensureArray(p.computer_skills).map(item => item.value || item)),

        p.location || "",
        p.latitude ? parseInt(p.latitude, 10) : null,
        p.longitude ? parseInt(p.longitude, 10) : null,
        
        p.id
      ];
      
      console.log("Values array:", values);
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
    const ids = JSON.parse(body);
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
