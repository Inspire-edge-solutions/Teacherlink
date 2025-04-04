import { pool } from './db.js'; // Import the pool from db.js (ES Module syntax)

/**
 * Build a condition for a given field.
 * Returns an object with { condition, params } or null if no value.
 * For arrays, creates a condition like:
 *    (LOWER(field) LIKE LOWER(?) OR LOWER(field) LIKE LOWER(?))
 */
const buildFilterCondition = (field, value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    if (Array.isArray(value)) {
        const conds = value.map(() => `LOWER(${field}) LIKE LOWER(?)`);
        const condition = `(${conds.join(' OR ')})`;
        const params = value.map(val => `%${val}%`);
        return { condition, params };
    } else {
        return { condition: `LOWER(${field}) LIKE LOWER(?)`, params: [`%${value}%`] };
    }
};

export const filterJobs = async (event) => {
    let body;

    // 1. Handle GET method
    if (event.httpMethod === 'GET') {
        body = event.queryStringParameters ? event.queryStringParameters : null;
        if (!body) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                },
                body: JSON.stringify({ error: 'Request parameters are missing' }),
            };
        }
    }
    // 2. Handle POST method
    else if (event.httpMethod === 'POST') {
        try {
            body = event.body ? JSON.parse(event.body) : null;
        } catch (error) {
            console.error("Invalid JSON input:", event.body);
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                },
                body: JSON.stringify({ error: 'Invalid JSON input' }),
            };
        }

        if (!body) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                },
                body: JSON.stringify({ error: 'Request body is missing' }),
            };
        }
    }

    // 3. Destructure the filtering fields from the request body.
    //    The following fields are expected from the front end:
    //    (All text fields may be arrays, as multi-value input)
    const {
        qualification,
        core_subjects,
        optional_subject, // Note: singular as in your schema
        country,
        state_ut,
        city,
        job_type,
        designations,
        designated_grades,
        curriculum,
        subjects,
        core_expertise,
        job_shifts,
        job_process,
        job_sub_process,
        min_salary,
        max_salary
    } = body;

    // 4. Build filter conditions for text fields (excluding salary).
    //    Use OR logic across fields.
    const filterFields = [
        { field: "qualification", value: qualification },
        { field: "core_subjects", value: core_subjects },
        { field: "optional_subject", value: optional_subject },
        { field: "country", value: country },
        { field: "state_ut", value: state_ut },
        { field: "city", value: city },
        { field: "job_type", value: job_type },
        { field: "designations", value: designations },
        { field: "designated_grades", value: designated_grades },
        { field: "curriculum", value: curriculum },
        { field: "subjects", value: subjects },
        { field: "core_expertise", value: core_expertise },
        { field: "job_shifts", value: job_shifts },
        { field: "job_process", value: job_process },
        { field: "job_sub_process", value: job_sub_process },
    ];

    const conditions = [];
    let params = [];
    filterFields.forEach(item => {
        const result = buildFilterCondition(item.field, item.value);
        if (result) {
            conditions.push(result.condition);
            params = params.concat(result.params);
        }
    });

    // 5. Build the base query.
    //    If at least one filter condition exists, use OR to combine them.
    let query = `SELECT * FROM job_posts`;
    if (conditions.length > 0) {
        query += ` WHERE (${conditions.join(' OR ')})`;
    } else {
        // If no filter conditions are provided, return all records.
        query += ` WHERE 1=1`;
    }

    // 6. Add salary range comparison as additional conditions with AND.
    //    Salary fields are expected to be single numeric values.
    if (min_salary !== undefined && max_salary !== undefined) {
        query += ` AND min_salary >= ? AND max_salary <= ?`;
        params.push(min_salary, max_salary);
    } else if (min_salary !== undefined) {
        query += ` AND min_salary >= ?`;
        params.push(min_salary);
    } else if (max_salary !== undefined) {
        query += ` AND max_salary <= ?`;
        params.push(max_salary);
    }

    console.log('Final Query:', query);
    console.log('Values:', params);

    // 7. Execute the query
    try {
        const [rows] = await pool.query(query, params);
        if (rows.length === 0) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                },
                body: JSON.stringify({ message: "No jobs match the given criteria." }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            },
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error('Error executing query', error.stack);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
