import { LocationClient, SearchPlaceIndexForTextCommand } from '@aws-sdk/client-location';

export const getAllData = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Extract the 'text' query parameter from the event
    const { text } = event.queryStringParameters || {};
    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Query parameter 'text' is required" }),
      };
    }

    // Create a new LocationClient for AWS Location Service
    const client = new LocationClient({ region: 'ap-south-1' });
    const command = new SearchPlaceIndexForTextCommand({
      IndexName: 'TeacherLinkPlaceIndex', // Ensure this index exists in your AWS account
      Text: text,
      MaxResults: 5,
    });

    // Send the command to search for the place index
    const data = await client.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error in geocoding:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
