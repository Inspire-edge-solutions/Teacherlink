export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
};

export const response = (statusCode, body) => {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(body)
    };
};
