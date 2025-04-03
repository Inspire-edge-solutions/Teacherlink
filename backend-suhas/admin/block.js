import { pool } from './db.js'; // Your MySQL pool/connection

export const handler = async (event) => {
  console.log("Incoming event:", event);
  const { httpMethod, path, body } = event;

  // Handle CORS preflight requests
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "CORS preflight" }),
    };
  }

  try {
    // ----- User Block/Unblock Routes -----
    if (path.endsWith("/block")) {
      if (httpMethod === "PUT") {
        return await toggleUserBlock(body);  // Use PUT method for block/unblock
      } else {
        return {
          statusCode: 405,
          headers: corsHeaders(),
          body: JSON.stringify({
            message: `Method ${httpMethod} not allowed on /block`,
          }),
        };
      }
    }

    // If the route doesn't match, return Method Not Allowed
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};

// Helper function to return CORS headers for every method
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,PUT",
  };
}

/* ---------------------------------------
   TOGGLE User Block Status (PUT /block)
---------------------------------------*/
const toggleUserBlock = async (body) => {
  console.log("toggleUserBlock body:", body);
  try {
    const { firebase_uid } = JSON.parse(body);  // Parse request body
    if (!firebase_uid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Missing firebase_uid" }),
      };
    }

    const connection = await pool.getConnection();

    // Query to get the current block status of the user
    const [user] = await connection.query(
      "SELECT isBlocked FROM UserDetails WHERE firebase_uid = ?",
      [firebase_uid]
    );

    // If user doesn't exist, return an error
    if (user.length === 0) {
      connection.release();
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Toggle the block status: if blocked (1), then unblock (0), and vice versa
    const newBlockStatus = user[0].isBlocked === 1 ? 0 : 1;

    // Update the isBlocked field in the UserDetails table
    const query = `
      UPDATE UserDetails
      SET isBlocked = ?
      WHERE firebase_uid = ?
    `;
    await connection.query(query, [newBlockStatus, firebase_uid]);

    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: `User block status updated successfully to ${newBlockStatus}`,
      }),
    };
  } catch (error) {
    console.error("Error in toggleUserBlock:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
