const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USER_TABLE;

exports.saveLocation = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const { latitude, longitude, label } = JSON.parse(event.body);

        // Validate input
        if (!latitude || !longitude) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Latitude and longitude are required' })
            };
        }

        // Update user's location in DynamoDB
        const params = {
            TableName: TABLE_NAME,
            Key: { id: userId },
            UpdateExpression: 'SET #location = :location',
            ExpressionAttributeNames: {
                '#location': 'location'
            },
            ExpressionAttributeValues: {
                ':location': {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    label: label || '',
                    updatedAt: new Date().toISOString()
                }
            }
        };

        await dynamoDB.update(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ 
                message: 'Location saved successfully',
                location: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    label: label || ''
                }
            })
        };

    } catch (error) {
        console.error('Error saving location:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Failed to save location' })
        };
    }
};

exports.geocode = async (event) => {
    try {
        const { text } = event.queryStringParameters;
        
        if (!text) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Search text is required' })
            };
        }

        const locationService = new AWS.Location();
        const params = {
            IndexName: 'TeacherLinkPlaceIndex',
            Text: text
        };

        const data = await locationService.searchPlaceIndexForText(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Error geocoding location:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Failed to geocode location' })
        };
    }
}; 