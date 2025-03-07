// const BASE_URL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/organization';

// export const createOrganization = async (payload) => {
//   try {
//     const response = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });
//     if (!response.ok) throw new Error("Failed to create organization");
//     return await response.json();
//   } catch (error) {
//     console.error("Error in createOrganization:", error);
//     return null;
//   }
// };

// export const getOrganization = async (id) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     if (!response.ok) throw new Error("Failed to get organization");
//     return await response.json();
//   } catch (error) {
//     console.error("Error in getOrganization:", error);
//     return null;
//   }
// };

// export const updateOrganization = async (id, payload) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });
//     if (!response.ok) throw new Error("Failed to update organization");
//     return await response.json();
//   } catch (error) {
//     console.error("Error in updateOrganization:", error);
//     return null;
//   }
// };

// export const deleteOrganization = async (id) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     if (!response.ok) throw new Error("Failed to delete organization");
//     return await response.json();
//   } catch (error) {
//     console.error("Error in deleteOrganization:", error);
//     return null;
//   }
// };

const BASE_URL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/organization';

// Helper function to retrieve the Firebase ID token (if stored in localStorage)
function getIdToken() {
  // Make sure your login flow stores the token under this key.
  return localStorage.getItem("idToken");
}

export const createOrganization = async (payload) => {
  try {
    const idToken = getIdToken();
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: "Bearer " + idToken }),
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Failed to create organization");
    return await response.json();
  } catch (error) {
    console.error("Error in createOrganization:", error);
    return null;
  }
};

export const getOrganization = async (id) => {
  try {
    const idToken = getIdToken();
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: "Bearer " + idToken }),
      }
    });
    if (!response.ok) throw new Error("Failed to get organization");
    return await response.json();
  } catch (error) {
    console.error("Error in getOrganization:", error);
    return null;
  }
};

export const updateOrganization = async (id, payload) => {
  try {
    const idToken = getIdToken();
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: "Bearer " + idToken }),
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Failed to update organization");
    return await response.json();
  } catch (error) {
    console.error("Error in updateOrganization:", error);
    return null;
  }
};

export const deleteOrganization = async (id) => {
  try {
    const idToken = getIdToken();
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: "Bearer " + idToken }),
      }
    });
    if (!response.ok) throw new Error("Failed to delete organization");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteOrganization:", error);
    return null;
  }
};
