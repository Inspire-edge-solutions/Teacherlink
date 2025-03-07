import AWS from 'aws-sdk';

export const geocodeLocation = async (event) => {
  try {
    // Extract the 'text' query parameter from the event
    const { text } = event.queryStringParameters || {};
    if (!text) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: "Query parameter 'text' is required" }),
      };
    }

    // Create an AWS Location client.
    const location = new AWS.Location();

    // Replace 'TeacherlinkPlaceIndex' with your actual AWS Location place index name.
    const params = {
      IndexName: 'TeacherLinkPlaceIndex', 
      Text: text,
      MaxResults: 5,
    };

    // Call the AWS Location Service API
    const data = await location.searchPlaceIndexForText(params).promise();

    // Return successful response with geocoding data and CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error in geocoding:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
