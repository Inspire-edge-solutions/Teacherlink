const API_URL = "https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/organization";

export const postData = async (payload) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to post data");
        return await response.json();
    } catch (error) {
        console.error("Error posting data:", error);
        return null;
    }
};
