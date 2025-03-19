import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";

const ViewProfile = () => {
  const { user } = useAuth();
  const firebase_uid = user?.uid;
  
  // States for organization data
  const [orgData, setOrgData] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(false);
  const [errorOrg, setErrorOrg] = useState(null);

  const fetchOrganization = async () => {
    if (!firebase_uid) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoadingOrg(true);
    setErrorOrg(null);

    try {
      // Optional: If you're not using token-based auth anymore, remove idToken references
      const idToken = localStorage.getItem("idToken");
      const response = await fetch(
        `${import.meta.env.VITE_DEV1_API}/organization/${firebase_uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(idToken && { Authorization: "Bearer " + idToken }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch organization details");
      }
      const data = await response.json();
      setOrgData(data);
    } catch (err) {
      setErrorOrg(err.message);
    } finally {
      setLoadingOrg(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [firebase_uid]);

  return (
    <div>
      {loadingOrg && <p>Loading organization details...</p>}
      {errorOrg && <p style={{ color: "red" }}>Error: {errorOrg}</p>}
      {orgData && (
        <div
          className="org-data-display"
          style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}
        >
          <h3>Organization Profile</h3>
          <p>
            <strong>Firebase UID:</strong> {orgData.firebase_uid}
          </p>
          <p>
            <strong>Type:</strong> {orgData.type}
          </p>

          {/* Organization Details (for non-parent types) */}
          {orgData.organization_details && (
            <>
              <h4>Organization Details</h4>
              <p>
                <strong>Name:</strong> {orgData.organization_details.name}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={orgData.organization_details.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {orgData.organization_details.websiteUrl}
                </a>
              </p>
              <p>
                <strong>PAN Number:</strong> {orgData.organization_details.panNumber}
              </p>
              <p>
                <strong>PAN Name:</strong> {orgData.organization_details.panName}
              </p>
              <p>
                <strong>GSTIN:</strong> {orgData.organization_details.gstin}
              </p>
              <p>
                <strong>Address:</strong> {orgData.organization_details.address}
              </p>
              <p>
                <strong>City:</strong> {orgData.organization_details.city}
              </p>
              <p>
                <strong>State:</strong> {orgData.organization_details.state}
              </p>
              <p>
                <strong>Pin Code:</strong> {orgData.organization_details.pincode}
              </p>
              <p>
                <strong>Country:</strong> {orgData.organization_details.country}
              </p>
              {orgData.organization_details.institution_photos &&
                orgData.organization_details.institution_photos.length > 0 && (
                  <div>
                    <h5>Photos:</h5>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {orgData.organization_details.institution_photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          style={{ width: "150px", margin: "8px" }}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}

          {/* Parent/Guardian Details (for parent types) */}
          {orgData.parent_details && (
            <>
              <h4>Parent/Guardian Details</h4>
              <p>
                <strong>Address:</strong> {orgData.parent_details.address}
              </p>
              <p>
                <strong>City:</strong> {orgData.parent_details.city}
              </p>
              <p>
                <strong>State:</strong> {orgData.parent_details.state}
              </p>
              <p>
                <strong>Pin Code:</strong> {orgData.parent_details.pincode}
              </p>
              <p>
                <strong>Country:</strong> {orgData.parent_details.country}
              </p>
            </>
          )}

          {/* Contact Person (if user is owner) */}
          {orgData.account_operated_by && (
            <>
              <h4>Contact Person</h4>
              <p>
                <strong>Name:</strong> {orgData.account_operated_by.name}
              </p>
              <p>
                <strong>Gender:</strong> {orgData.account_operated_by.gender}
              </p>
              <p>
                <strong>Designation:</strong>{" "}
                {orgData.account_operated_by.designation?.join(", ")}
              </p>
              <p>
                <strong>Phone 1:</strong> {orgData.account_operated_by.phone1}
              </p>
              <p>
                <strong>Phone 2:</strong> {orgData.account_operated_by.phone2}
              </p>
              <p>
                <strong>Email:</strong> {orgData.account_operated_by.email}
              </p>
            </>
          )}

          {/* Reporting Authority (if user is not owner) */}
          {orgData.reporting_authority && (
            <>
              <h4>Reporting Authority</h4>
              <p>
                <strong>Name:</strong> {orgData.reporting_authority.name}
              </p>
              <p>
                <strong>Gender:</strong> {orgData.reporting_authority.gender}
              </p>
              <p>
                <strong>Designation:</strong>{" "}
                {orgData.reporting_authority.designation?.join(", ")}
              </p>
              <p>
                <strong>Phone 1:</strong> {orgData.reporting_authority.phone1}
              </p>
              <p>
                <strong>Phone 2:</strong> {orgData.reporting_authority.phone2}
              </p>
              <p>
                <strong>Email:</strong> {orgData.reporting_authority.email}
              </p>
            </>
          )}

          {/* Social Networks at the TOP LEVEL */}
          <h4>Social Networks</h4>
          <p>
            <strong>Facebook:</strong> {orgData.facebook}
          </p>
          <p>
            <strong>Twitter:</strong> {orgData.twitter}
          </p>
          <p>
            <strong>LinkedIn:</strong> {orgData.linkedin}
          </p>
          <p>
            <strong>Instagram:</strong> {orgData.instagram}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;