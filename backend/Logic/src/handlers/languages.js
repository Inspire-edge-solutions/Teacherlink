import { getDBConnection } from '../utils/db.js';
import { dynamoDb } from '../utils/dynamoDb.js';
import { s3Upload } from '../utils/s3.js';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event) => {
  let connection;
  try {
    connection = await getDBConnection();

    const { httpMethod, pathParameters, queryStringParameters, body } = event;
    let id = pathParameters ? pathParameters.id : (queryStringParameters ? queryStringParameters.id : null);

    // Decode URL-encoded ID
    if (id) {
      id = decodeURIComponent(id);
      // Remove braces if present
      id = id.replace(/^\{|\}$/g, '');
    }

    console.log(`Event: ${JSON.stringify(event)}`);
    console.log(`HTTP Method: ${httpMethod}, Path Parameters: ${JSON.stringify(pathParameters)}, Query String Parameters: ${JSON.stringify(queryStringParameters)}, ID: ${id}`);

    let response;

    switch (httpMethod) {
      case 'POST':
        response = await handleCreate(connection, JSON.parse(body));
        break;
      case 'GET':
        response = await handleRead(connection, id);
        break;
      case 'PUT':
        response = await handleUpdate(connection, id, JSON.parse(body));
        break;
      case 'DELETE':
        response = await handleDelete(connection, id);
        break;
      default:
        response = {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' })
        };
        break;
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Create a new profile
const handleCreate = async (connection, data) => {
  const dynamoId = uuidv4();

  // Upload photos and video to S3
  if (data.institutionPhotos) {
    for (let i = 0; i < data.institutionPhotos.length; i++) {
      data.institutionPhotos[i] = await s3Upload(data.institutionPhotos[i], `photos/${dynamoId}/photo${i + 1}.jpg`);
    }
  }
  if (data.institutionVideo) {
    data.institutionVideo = await s3Upload(data.institutionVideo, `videos/${dynamoId}/video.mp4`);
  }

  const query = `
    INSERT INTO profiles (facebook, twitter, linkedin, instagram, google_map, dynamo_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.facebook,
    data.twitter,
    data.linkedin,
    data.instagram,
    data.googleMap,
    dynamoId
  ];
  await connection.execute(query, values);

  // Prepare dynamic data for DynamoDB
  const dynamoItem = {
    id: dynamoId,
    organizationType: data.organizationType,
    name: data.name,
    websiteUrl: data.websiteUrl,
    institutionPhotos: data.institutionPhotos,
    institutionVideo: data.institutionVideo,
    panNumber: data.panNumber,
    nameOnPanCard: data.nameOnPanCard,
    address: data.address,
    laneArea: data.laneArea,
    city: data.city,
    state: data.state,
    pinCode: data.pinCode,
    country: data.country,
    gstin: data.gstin,
    contactPerson: data.contactPerson,
    gender: data.gender,
    designation: data.designation,
    contactNumber1: data.contactNumber1,
    contactNumber2: data.contactNumber2,
    email: data.email,
    owner: data.owner
  };

  // Include reportingAuthorityDetails only if owner is "No"
  if (data.owner === "No") {
    dynamoItem.reportingAuthorityDetails = data.reportingAuthorityDetails;
  }

  // Insert dynamic data into DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: dynamoItem
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Profile created successfully', id: dynamoId })
    };
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

// Read a profile
const handleRead = async (connection, id) => {
  if (!id) {
    console.error('ID is null or undefined');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID is required' })
    };
  }

  // Fetch constant data from MySQL
  let profile;
  try {
    const [rows] = await connection.execute('SELECT * FROM profiles WHERE id = ?', [id]);
    console.log(`SQL Query Result: ${JSON.stringify(rows)}`);
    profile = rows[0];
    if (!profile) {
      console.error(`Profile with id ${id} not found in MySQL`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Profile not found' })
      };
    }
  } catch (error) {
    console.error('MySQL Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }

  // Fetch dynamic data from DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: profile.dynamo_id }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      console.error(`Dynamic data with id ${profile.dynamo_id} not found in DynamoDB`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Profile not found' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ...profile, ...result.Item })
    };
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

// Update a profile
const handleUpdate = async (connection, id, data) => {
  if (!id) {
    console.error('ID is null or undefined');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID is required' })
    };
  }

  // Fetch existing profile to get dynamo_id
  let profile;
  try {
    const [rows] = await connection.execute('SELECT * FROM profiles WHERE id = ?', [id]);
    profile = rows[0];
    if (!profile) {
      console.error(`Profile with id ${id} not found in MySQL`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Profile not found' })
      };
    }
  } catch (error) {
    console.error('MySQL Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }

  const query = `
    UPDATE profiles
    SET facebook = ?, twitter = ?, linkedin = ?, instagram = ?, google_map = ?
    WHERE id = ?
  `;
  const values = [
    data.facebook,
    data.twitter,
    data.linkedin,
    data.instagram,
    data.googleMap,
    id
  ];
  await connection.execute(query, values);

  // Prepare dynamic data for DynamoDB
  const dynamoItem = {
    organizationType: data.organizationType,
    name: data.name,
    websiteUrl: data.websiteUrl,
    institutionPhotos: data.institutionPhotos,
    institutionVideo: data.institutionVideo,
    panNumber: data.panNumber,
    nameOnPanCard: data.nameOnPanCard,
    address: data.address,
    laneArea: data.laneArea,
    city: data.city,
    state: data.state,
    pinCode: data.pinCode,
    country: data.country,
    gstin: data.gstin,
    contactPerson: data.contactPerson,
    gender: data.gender,
    designation: data.designation,
    contactNumber1: data.contactNumber1,
    contactNumber2: data.contactNumber2,
    email: data.email,
    owner: data.owner
  };

  // Include reportingAuthorityDetails only if owner is "No"
  if (data.owner === "No") {
    dynamoItem.reportingAuthorityDetails = data.reportingAuthorityDetails;
  }

  // Update dynamic data in DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: profile.dynamo_id },
    UpdateExpression: 'set ' + Object.keys(dynamoItem).map(key => `${key} = :${key}`).join(', '),
    ExpressionAttributeValues: Object.fromEntries(Object.entries(dynamoItem).map(([key, value]) => [`:${key}`, value])),
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile updated successfully' })
    };
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

// Delete a profile
const handleDelete = async (connection, id) => {
  if (!id) {
    console.error('ID is null or undefined');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID is required' })
    };
  }

  // Fetch existing profile to get dynamo_id
  let profile;
  try {
    const [rows] = await connection.execute('SELECT * FROM profiles WHERE id = ?', [id]);
    profile = rows[0];
    if (!profile) {
      console.error(`Profile with id ${id} not found in MySQL`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Profile not found' })
      };
    }
  } catch (error) {
    console.error('MySQL Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }

  // Delete constant data from MySQL
  try {
    await connection.execute('DELETE FROM profiles WHERE id = ?', [id]);
  } catch (error) {
    console.error('MySQL Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }

  // Delete dynamic data from DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: profile.dynamo_id }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile deleted successfully' })
    };
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};