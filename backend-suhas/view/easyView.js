const axios = require('axios');

module.exports.getAllData = async (event) => {
  try {
    // Extract firebase_uid from the incoming event's query parameters
    const firebase_uid = event.queryStringParameters ? event.queryStringParameters.firebase_uid : null;

    // Append firebase_uid as a query parameter to the endpoints if it exists
    const personalURL = 'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal' + (firebase_uid ? `?firebase_uid=${firebase_uid}` : '');
    const presentAddressURL = 'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress' + (firebase_uid ? `?firebase_uid=${firebase_uid}` : '');
    const educationDetailsURL = 'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails' + (firebase_uid ? `?firebase_uid=${firebase_uid}` : '');
    const workExperienceURL = 'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience' + (firebase_uid ? `?firebase_uid=${firebase_uid}` : '');
    const jobPreferenceURL = 'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference' + (firebase_uid ? `?firebase_uid=${firebase_uid}` : '');

    // Execute all GET requests concurrently
    const [
      personalResponse,
      presentAddressResponse,
      educationDetailsResponse,
      workExperienceResponse,
      jobPreferenceResponse,
    ] = await Promise.all([
      axios.get(personalURL),
      axios.get(presentAddressURL),
      axios.get(educationDetailsURL),
      axios.get(workExperienceURL),
      axios.get(jobPreferenceURL)
    ]);

    // Aggregate responses into a single object
    const aggregatedData = {
      personal: personalResponse.data,
      presentAddress: presentAddressResponse.data,
      educationDetails: educationDetailsResponse.data,
      workExperience: workExperienceResponse.data,
      jobPreference: jobPreferenceResponse.data,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(aggregatedData),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching data',
        error: error.message,
      }),
    };
  }
};
