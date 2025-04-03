import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log("Event:", event);

  try {
    switch (httpMethod) {
      case "GET":
        return await getAddress(queryStringParameters);
      case "POST":
        return await upsertAddress(body);
      case "PUT":
        return await upsertAddress(body);
      case "DELETE":
        return await deleteAddress(body);
      default:
        return {
          statusCode: 405,
          headers: corsHeaders(),
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  };
}

/* ---------------------------------------
   UPSERT Address (POST/PUT /presentAddress)
   If firebase_uid is new => insert; if exists => update.
---------------------------------------*/
const upsertAddress = async (body) => {
  console.log("Upsert Address Body:", body);
  try {
    const connection = await pool.getConnection();
    let addresses = JSON.parse(body);
    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }
    const values = addresses.map(addr => {
      const {
        firebase_uid,
        country_name,
        state_name,
        city_name,
        house_no_and_street,
        pincode,
      } = addr;
      if (!firebase_uid) {
        throw new Error("Missing firebase_uid");
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
      INSERT INTO present_address 
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
      body: JSON.stringify({ message: "Present address upserted successfully" }),
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
   GET Address (GET /presentAddress)
---------------------------------------*/
const getAddress = async (queryStringParameters) => {
  console.log("getAddress queryStringParameters:", queryStringParameters);
  try {
    const connection = await pool.getConnection();
    let query = "SELECT * FROM present_address";
    const params = [];
    if (queryStringParameters) {
      const { id, firebase_uid } = queryStringParameters;
      if (firebase_uid) {
        query += " WHERE firebase_uid = ?";
        params.push(firebase_uid);
      } else if (id) {
        query += " WHERE id = ?";
        params.push(id);
      }
    }
    const [results] = await connection.query(query, params);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error in getAddress:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   DELETE Address (DELETE /presentAddress)
---------------------------------------*/
const deleteAddress = async (body) => {
  console.log("Delete Address Body:", body);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(body); // expecting an array of ids
    const query = "DELETE FROM present_address WHERE id IN (?)";
    await connection.query(query, [ids]);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Present address deleted successfully" }),
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
