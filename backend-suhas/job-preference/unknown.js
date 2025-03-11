import { pool } from './db.js'; // Import the pool from db.js (ES Module syntax)

const addFilter = (field, value, query, values) => {
    if (value) {
        query += ` AND LOWER(${field}) LIKE LOWER(?)`;  // Use '?' placeholder for MySQL
        values.push(`%${value}%`);
    }
    return { query, values };
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

    // 3. Destructure the query parameters or POST body (depending on method)
    const {
        qualification, core_subjects, optional_subjects, country, state_ut, city,
        job_type, designations, designated_grades, curriculum, subjects, core_expertise,
        job_shifts, job_process, job_sub_process, min_salary, max_salary
    } = body;

    // 4. Start building the SQL query dynamically based on the provided parameters
    let query = `SELECT * FROM job_posting WHERE 1=1`; // Initial query without filters
    let values = []; // Use 'let' instead of 'const' so we can modify this

    // 5. Add filters for each field using the addFilter function
    ({ query, values } = addFilter("core_subjects", core_subjects, query, values));
    ({ query, values } = addFilter("qualification", qualification, query, values));
    ({ query, values } = addFilter("optional_subjects", optional_subjects, query, values));
    ({ query, values } = addFilter("country", country, query, values));
    ({ query, values } = addFilter("state_ut", state_ut, query, values));
    ({ query, values } = addFilter("city", city, query, values));
    ({ query, values } = addFilter("job_type", job_type, query, values));
    ({ query, values } = addFilter("designations", designations, query, values));
    ({ query, values } = addFilter("designated_grades", designated_grades, query, values));
    ({ query, values } = addFilter("curriculum", curriculum, query, values));
    ({ query, values } = addFilter("subjects", subjects, query, values));
    ({ query, values } = addFilter("core_expertise", core_expertise, query, values));
    ({ query, values } = addFilter("job_shifts", job_shifts, query, values));
    ({ query, values } = addFilter("job_process", job_process, query, values));
    ({ query, values } = addFilter("job_sub_process", job_sub_process, query, values));

    // Salary range comparison (min_salary and max_salary)
    if (min_salary !== undefined && max_salary !== undefined) {
        query += ` AND min_salary >= ? AND max_salary <= ?`;
        values.push(min_salary, max_salary);
    } else if (min_salary !== undefined) {
        query += ` AND min_salary >= ?`;
        values.push(min_salary);
    } else if (max_salary !== undefined) {
        query += ` AND max_salary <= ?`;
        values.push(max_salary);
    }

    console.log('Final Query:', query);
    console.log('Values:', values);

    // Execute the query with the correct placeholders
    try {
        const [rows] = await pool.query(query, values);  // Query the database
        if (rows.length === 0) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                },
                body: JSON.stringify({ message: "No jobs match the given criteria." }), // If no records match
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            },
            body: JSON.stringify(rows),  // Returning the query results
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
            body: JSON.stringify({ error: 'Internal Server Error' }), // Error message
        };
    }
};
