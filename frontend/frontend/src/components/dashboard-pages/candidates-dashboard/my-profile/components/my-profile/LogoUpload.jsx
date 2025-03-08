// import { useState } from "react";
// import "./profile-styles.css";

// const LogoUpload = () => {
//     const [imageFile, setImageFile] = useState("");
//     const [videoFile, setVideoFile] = useState("");

//     const imageFileHandler = (e) => {
//         setImageFile(e.target.files[0]);
//     };

//     const videoFileHandler = (e) => {
//         setVideoFile(e.target.files[0]);
//     };

//     return (
//         <>
//             <div className="uploading-outer">
//                 {/* Image Upload Section */}
//                 <div className="uploadButton">
//                     <input
//                         className="uploadButton-input"
//                         type="file"
//                         name="attachments[]"
//                         accept="image/*"
//                         id="upload-image"
//                         required
//                         onChange={imageFileHandler}
//                     />
                    
//                     <label
//                         className="uploadButton-button ripple-effect"
//                         htmlFor="upload-image"
//                     >
//                         {imageFile !== "" ? imageFile.name : "Upload your profile image"}
//                     </label>
//                     <span className="uploadButton-file-name"></span>
//                 </div>
                
//                 <div className="text">
//                     Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png
//                 </div>
                

//                 {/* Video Upload Section */}
//                 <div className="uploadButton mt-4">
//                     <input
//                         className="uploadButton-input"
//                         type="file"
//                         name="attachments[]"
//                         accept="video/*"
//                         id="upload-video"
//                         required
//                         onChange={videoFileHandler}
//                     />
//                     <label
//                         className="uploadButton-button ripple-effect"
//                         htmlFor="upload-video"
//                     >
//                         {videoFile !== "" ? videoFile.name : "Upload your demo video (not more than 5 minutes)"}
//                     </label>
//                     <span className="uploadButton-file-name"></span>
//                 </div>
//                 <div className="text">
//                     Max file size is 10MB, Suitable files are .mp4, .webm & .mov
//                 </div>
//             </div>
//             <div className="photoVideo">
//             <button className="theme-btn btn-style-three">Save Photo</button>
//             <button className="theme-btn btn-style-three">Save demo video</button>
//             </div>
            
//         </>
//     );
// };

// export default LogoUpload;


import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
const LogoUpload = () => {

    const { user } = useAuth();

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const imageFileHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

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
    "https://fihszarida.execute-api.ap-south-1.amazonaws.com/dev/upload-image";
  // Use your provided video API URL.
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
        firebase_id: user.uid,
      };
      const response = await axios.post(IMAGE_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Photo submitted successfully:", response.data);
      alert("Photo submitted successfully");
      setMessage("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo");
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
      // Request pre-signed URL from backend.
      const getUrlResponse = await axios.get(VIDEO_API_URL, {
        params: { fileType: videoFile.type },
      });
      console.log("Pre-signed URL response:", getUrlResponse.data);
      const { url, key } = getUrlResponse.data;
      // Upload video directly to S3 using PUT.
      await axios.put(url, videoFile, {
        headers: { "Content-Type": videoFile.type },
      });
      console.log("Video uploaded successfully");
      alert("Video uploaded successfully");
      setMessage("Video uploaded successfully! Key: " + key);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
      setMessage("Video upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="uploading-outer">
        {/* Image Upload Section */}
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
          <label className="uploadButton-button ripple-effect" htmlFor="upload-image">
            {imageFile ? imageFile.name : "Upload your profile image"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        <div className="text">
          Max file size is 1MB, Minimum dimension: 330x300 and suitable files are .jpg &amp; .png
        </div>
        {/* Video Upload Section */}
        <div className="uploadButton mt-4">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept="video/*"
            id="upload-video"
            required
            onChange={videoFileHandler}
          />
          <label className="uploadButton-button ripple-effect" htmlFor="upload-video">
            {videoFile ? videoFile.name : "Upload your demo video (not more than 5 minutes)"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        <div className="text">
          Max file size is 10MB, Suitable files are .mp4, .webm &amp; .mov
        </div>
      </div>
      <div className="photoVideo">
        <button className="theme-btn btn-style-three" onClick={uploadPhoto} disabled={uploading}>
          Save Photo
        </button>
        <button className="theme-btn btn-style-three" onClick={uploadVideo} disabled={uploading}>
          Save demo video
        </button>
      </div>
      {message && <div className="message">{message}</div>}
    </>
  );
};

export default LogoUpload;