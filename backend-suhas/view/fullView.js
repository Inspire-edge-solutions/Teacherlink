const axios = require('axios');

module.exports.getAllData = async (event) => {
  try {
    // Extract firebase_uid from the query parameters, if provided
    const firebase_uid = event.queryStringParameters ? event.queryStringParameters.firebase_uid : null;

    // Helper function to append firebase_uid to a URL as a query parameter if it exists
    const appendQueryParam = (url, uid) => uid ? `${url}?firebase_uid=${uid}` : url;

    // Define external API endpoints with firebase_uid appended when available
    const personalURL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal', firebase_uid);
    const presentAddressURL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress', firebase_uid);
    const languagesURL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/languages', firebase_uid);
    const socialProfileURL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/socialProfile', firebase_uid);
    const additionalInfo1URL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/additional_info1', firebase_uid);
    const additionalInfo2URL = appendQueryParam('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/additional_info2', firebase_uid);
    const jobPreferenceURL = appendQueryParam('https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference', firebase_uid);
    const workExperienceURL = appendQueryParam('https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience', firebase_uid);
    const educationDetailsURL = appendQueryParam('https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails', firebase_uid);

    // Execute all GET requests concurrently
    const [
      personalResponse,
      presentAddressResponse,
      languagesResponse,
      socialProfileResponse,
      additionalInfo1Response,
      additionalInfo2Response,
      jobPreferenceResponse,
      workExperienceResponse,
      educationDetailsResponse
    ] = await Promise.all([
      axios.get(personalURL),
      axios.get(presentAddressURL),
      axios.get(languagesURL),
      axios.get(socialProfileURL),
      axios.get(additionalInfo1URL),
      axios.get(additionalInfo2URL),
      axios.get(jobPreferenceURL),
      axios.get(workExperienceURL),
      axios.get(educationDetailsURL)
    ]);

    // Aggregate responses into a single object
    const aggregatedData = {
      personal: personalResponse.data,
      presentAddress: presentAddressResponse.data,
      languages: languagesResponse.data,
      socialProfile: socialProfileResponse.data,
      additional_info1: additionalInfo1Response.data,
      additional_info2: additionalInfo2Response.data,
      jobPreference: jobPreferenceResponse.data,
      workExperience: workExperienceResponse.data,
      educationDetails: educationDetailsResponse.data,
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
