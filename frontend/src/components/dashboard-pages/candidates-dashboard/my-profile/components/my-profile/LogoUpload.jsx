import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { BsCloudUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoUpload = () => {
  const { user } = useAuth();

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // This will store the row 'id' after inserting the image row
  const [profilePicId, setProfilePicId] = useState(null);

  // Handler for image file input
  const imageFileHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Handler for video file input
  const videoFileHandler = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  // Convert file to Base64 string (for image uploads).
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // API endpoints.
  const IMAGE_API_URL =
    "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-image";
  const VIDEO_API_URL =
    "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-video";

  // Upload image via POST.
  const uploadPhoto = async () => {
    if (!imageFile) {
      setMessage("Please select a photo file.");
      return;
    }
    try {
      setUploading(true);
      setMessage("");
      const base64Data = await fileToBase64(imageFile);
      const payload = {
        file: base64Data,
        fileType: imageFile.type,
        firebase_uid: user.uid, // Updated as per Address component reference
      };
      // Send POST to /upload-image
      const response = await axios.post(IMAGE_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Photo submitted successfully:", response.data);
      toast.success("Photo submitted successfully");
      setMessage("Photo uploaded successfully!");

      // Store the row 'id' for later usage when uploading the video
      if (response.data.id) {
        setProfilePicId(response.data.id);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Error uploading photo");
      setMessage("Photo upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Upload video using pre-signed URL.
  const uploadVideo = async () => {
    if (!videoFile) {
      setMessage("Please select a video file.");
      return;
    }
    try {
      setUploading(true);
      setMessage("");

      // Pass the existing row 'id' if we have it
      const params = { fileType: videoFile.type };
      if (profilePicId) {
        params.id = profilePicId;
      }

      // Request pre-signed URL from backend (GET /upload-video)
      const getUrlResponse = await axios.get(VIDEO_API_URL, { params });
      console.log("Pre-signed URL response:", getUrlResponse.data);

      const { url, key } = getUrlResponse.data;
      // Upload video directly to S3 using PUT.
      await axios.put(url, videoFile, {
        headers: { "Content-Type": videoFile.type },
      });
      console.log("Video uploaded successfully");
      toast.success("Video uploaded successfully");
      setMessage("Video uploaded successfully! Key: " + key);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
      setMessage("Video upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-sections-wrapper">
        {/* Image Upload Section */}
        <div className="upload-section">
          <div className="upload-box">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*"
                id="upload-image"
                required
                onChange={imageFileHandler}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload-image"
              >
                <span className="icon">
                  <BsCloudUpload />
                </span>
                <span className="upload-text">
                  {imageFile ? imageFile.name : "Upload your profile image"}
                </span>
              </label>
            </div>
            <div className="upload-info">
              Max file size is 1MB, Minimum dimension: 330x300 and suitable files are .jpg &amp; .png
            </div>
            <button
              className="theme-btn btn-style-three"
              onClick={uploadPhoto}
              disabled={uploading}
            >
              Save Photo
            </button>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="upload-section">
          <div className="upload-box">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="video/*"
                id="upload-video"
                required
                onChange={videoFileHandler}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload-video"
              >
                <span className="icon">
                  <BsCloudUpload />
                </span>
                <span className="upload-text">
                  {videoFile ? videoFile.name : "Upload your demo video (not more than 5 minutes)"}
                </span>
              </label>
            </div>
            <div className="upload-info">
              Max file size is 10MB, Suitable files are .mp4, .webm &amp; .mov
            </div>
            <button
              className="theme-btn btn-style-three"
              onClick={uploadVideo}
              disabled={uploading}
            >
              Save demo video
            </button>
          </div>
        </div>
      </div>

      {/* Message Section */}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default LogoUpload;