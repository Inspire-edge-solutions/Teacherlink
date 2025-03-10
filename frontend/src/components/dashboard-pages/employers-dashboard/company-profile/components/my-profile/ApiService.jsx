const BASE_URL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/organization';

// Now, each function accepts a token parameter from the calling component.
export const createOrganization = async (payload, token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
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

export const getOrganization = async (id, token) => {
  try {
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      }
    });
    if (!response.ok) throw new Error("Failed to get organization");
    return await response.json();
  } catch (error) {
    console.error("Error in getOrganization:", error);
    return null;
  }
};

export const updateOrganization = async (id, payload, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
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

export const deleteOrganization = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      }
    });
    if (!response.ok) throw new Error("Failed to delete organization");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteOrganization:", error);
    return null;
  }
};