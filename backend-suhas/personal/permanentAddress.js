import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getAddress(event);
      case 'POST':
        return await upsertAddress(body);
      case 'PUT':
        return await upsertAddress(body);
      case 'DELETE':
        return await deleteAddress(body);
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
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };
}

/* ---------------------------------------
   UPSERT Address (POST/PUT /permanentAddress)
   Inserts a new record if firebase_uid does not exist;
   if firebase_uid exists (thanks to UNIQUE constraint), updates that row.
---------------------------------------*/
const upsertAddress = async (body) => {
  console.log('Upsert Address Body:', body);
  try {
    const connection = await pool.getConnection();
    let addresses = JSON.parse(body);
    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }

    const values = addresses.map(address => {
      const {
        firebase_uid,
        country_name,
        state_name,
        city_name,
        house_no_and_street,
        pincode
      } = address;
      if (!firebase_uid) {
        throw new Error("firebase_uid is required");
      }
      return [
        firebase_uid,
        country_name || "",
        state_name || "",
        city_name || "",
        house_no_and_street || "",
        pincode || ""
      ];
    });

    const query = `
      INSERT INTO permanent_address 
        (firebase_uid, country_name, state_name, city_name, house_no_and_street, pincode)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        country_name = VALUES(country_name),
        state_name = VALUES(state_name),
        city_name = VALUES(city_name),
        house_no_and_street = VALUES(house_no_and_street),
        pincode = VALUES(pincode)
    `;

    await connection.query(query, [values]);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Permanent address upserted successfully" }),
    };
  } catch (error) {
    console.error("Error in upsertAddress:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   GET Address (GET /permanentAddress)
---------------------------------------*/
const getAddress = async (event) => {
  console.log("Get Address Event:", event);
  try {
    const connection = await pool.getConnection();
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    const query = id ? 'SELECT * FROM permanent_address WHERE id = ?' : 'SELECT * FROM permanent_address';
    const params = id ? [id] : [];
    const [results] = await connection.query(query, params);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error fetching address records:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   DELETE Address (DELETE /permanentAddress)
---------------------------------------*/
const deleteAddress = async (body) => {
  console.log("Delete Address Body:", body);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(body); // expecting an array of ids
    const query = "DELETE FROM permanent_address WHERE id IN (?)";
    await connection.query(query, [ids]);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Permanent address deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting address records:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
