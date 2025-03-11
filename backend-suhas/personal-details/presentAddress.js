import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getAddress(event);
      case 'POST':
        return await createAddress(body);
      case 'PUT':
        return await updateAddress(body);
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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };
}

// ================= CREATE (POST) =================
const createAddress = async (body) => {
  console.log('Create Address Body:', body);
  try {
    const connection = await pool.getConnection();
    let addresses = JSON.parse(body);
    console.log('Parsed Addresses:', addresses);

    // Ensure addresses is always an array
    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }

    // Map each address record to an array of values.
    // If firebase_uid is not provided, insert null.
    const values = addresses.map(address => {
      const { firebase_uid, country_name, state_name, city_name, house_no_and_street, pincode } = address;
      return [
        firebase_uid !== undefined ? firebase_uid : null,
        country_name,
        state_name,
        city_name,
        house_no_and_street,
        pincode
      ];
    });

    const query = `
      INSERT INTO present_address (firebase_uid, country_name, state_name, city_name, house_no_and_street, pincode)
      VALUES ?
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Address records created successfully' }),
    };
  } catch (error) {
    console.error('Error creating addresses:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= GET (GET) =================
const getAddress = async (event) => {
  console.log('Get Address Event:', event);
  try {
    const connection = await pool.getConnection();
    // Use "id" from query parameters if provided; otherwise, return all records.
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    const query = id ? 'SELECT * FROM present_address WHERE id = ?' : 'SELECT * FROM present_address';
    const params = id ? [id] : [];
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= UPDATE (PUT) =================
const updateAddress = async (body) => {
  console.log('Update Address Body:', body);
  try {
    const connection = await pool.getConnection();
    let addresses = JSON.parse(body);

    // Ensure addresses is an array
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    // For each address record, update the record by its id.
    const queries = addressArray.map(address => {
      const { id, country_name, state_name, city_name, house_no_and_street, pincode } = address;
      const query = `
        UPDATE present_address
        SET country_name = ?, state_name = ?, city_name = ?, house_no_and_street = ?, pincode = ?
        WHERE id = ?
      `;
      return connection.query(query, [country_name, state_name, city_name, house_no_and_street, pincode, id]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Address records updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating address records:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= DELETE (DELETE) =================
const deleteAddress = async (body) => {
  console.log('Delete Address Body:', body);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(body); // expecting an array of ids

    const query = 'DELETE FROM present_address WHERE id IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Address records deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting address records:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
