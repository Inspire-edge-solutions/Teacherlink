// import { handler as usersHandler } from './handlers/users.js';
// import { handler as institutionsHandler } from './handlers/Institution.js';
// import { handler as loginHandler } from './handlers/login.js';
// import { handler as personalHandler } from './handlers/personal.js';
// import { handler as organizationHandler } from './handlers/organization.js';
// export const mainHandler = async (event) => {
//   const routeKey = event.routeKey;

//   try {
//     switch (routeKey) {
//       // User routes
//       case 'GET /users':
//       case 'POST /users':
//       case 'PUT /users':
//       case 'DELETE /users':
//         return await usersHandler(event);

//       // Institution routes
//       case 'GET /institutions':
//       case 'POST /institutions':
//       case 'PUT /institutions':
//       case 'DELETE /institutions':
//         return await institutionsHandler(event);

//       // Login routes
//       case 'POST /login':
//         return await loginHandler(event);

//       // Register routes
//       case 'POST /register':
//         return await registerHandler(event);
  
//       case 'POST /personal':
//       case 'GET /personal':
//       case 'PUT /personal':
//       case 'DELETE /personal':
//         return await personalHandler(event);

//       // Organization routes  
//       case 'POST /organization':
//       case 'GET /organization': 
//       case 'PUT /organization':
//       case 'DELETE /organization':
//         return await organizationHandler(event);

        
//       // Default for invalid routes
//       default:
//         return {
//           statusCode: 400,
//           body: JSON.stringify({ message: 'Invalid route' }),
//         };
//     }
//   } catch (error) {
//     console.error('❌ Error occurred:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: error.message }),
//     };
//   }
// };

import { handler as usersHandler } from './handlers/users.js';
import { handler as organizationHandler } from './handlers/organization.js';

/**
 * Returns the standard headers used in every response.
 */
function standardHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
}

export const mainHandler = async (event) => {
  console.log("🔹 Event received:", JSON.stringify(event));

  // Determine the route from various parts of the event
  let route = event.route || (event.body && JSON.parse(event.body).route);
  if (!route && event.queryStringParameters) {
    route = event.queryStringParameters.route;
  }
  console.log("🔹 Resolved route:", route);

  if (!route) {
    console.error("❌ Route not specified in the request.");
    return {
      statusCode: 400,
      headers: standardHeaders(),
      body: JSON.stringify({ message: 'Route not specified in request' }),
    };
  }

  // Merge queryStringParameters into event for GET requests
  if (event.httpMethod === 'GET' && event.queryStringParameters) {
    Object.assign(event, event.queryStringParameters);
  }

  try {
    switch (route) {
      // User routes
      case 'GET /users':
      case 'POST /users':
      case 'PUT /users':
      case 'DELETE /users':
        return await usersHandler(event);

      // Organization routes
      case 'POST /organization':
      case 'GET /organization':
      case 'PUT /organization':
      case 'DELETE /organization':
        return await organizationHandler(event);

      // Default: Invalid route
      default:
        console.error("❌ Invalid route specified:", route);
        return {
          statusCode: 400,
          headers: standardHeaders(),
          body: JSON.stringify({ message: 'Invalid Route' }),
        };
    }
  } catch (error) {
    console.error("❌ Error occurred:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: error.message }),
    };
  }
};
