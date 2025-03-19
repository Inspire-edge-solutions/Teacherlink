const BASE_URL = import.meta.env.VITE_DEV1_API + '/organization';

// createOrganization API call without token-based authorization
export const createOrganization = async (payload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
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
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
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
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Failed to delete organization");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteOrganization:", error);
    return null;
  }
};