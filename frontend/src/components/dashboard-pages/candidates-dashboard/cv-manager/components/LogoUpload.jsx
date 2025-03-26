// import { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../../../../contexts/AuthContext";
// import { BsCloudUpload, BsPencil, BsTrash } from "react-icons/bs";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // validation checking
// function checkFileTypes(file) {
//     const allowedTypes = [
//         "video/mp4",
//         "video/webm",
//         "video/quicktime"  // .mov files
//     ];
//     return allowedTypes.includes(file.type);
// }

// const LogoUpload = () => {
//     const { user } = useAuth();
//     const [getManager, setManager] = useState([]);
//     const [getError, setError] = useState("");
//     const [uploading, setUploading] = useState(false);

//     const videoManagerHandler = async (e) => {
//         const file = e.target.files[0];
        
//         const isExist = getManager?.some((existingFile) => existingFile.name === file.name);
        
//         if (!isExist) {
//             if (checkFileTypes(file)) {
//                 if (file.size > 10 * 1024 * 1024) { // 10MB limit
//                     setError("File size must be less than 10MB");
//                     toast.error("File size must be less than 10MB");
//                     return;
//                 }
//                 setManager([...getManager, file]);
//                 setError("");
//             } else {
//                 setError("Only accept (.mp4, .webm, .mov) files");
//                 toast.error("Only accept (.mp4, .webm, .mov) files");
//             }
//         } else {
//             setError("File already exists");
//             toast.error("File already exists");
//         }
//     };

//     const deleteHandler = (name) => {
//         const deleted = getManager?.filter((file) => file.name !== name);
//         setManager(deleted);
//     };

//     const uploadVideo = async (file) => {
//         try {
//             setUploading(true);
//             const params = { fileType: file.type };
//             const getUrlResponse = await axios.get(VIDEO_API_URL, { params });
//             const { url, key } = getUrlResponse.data;
            
//             await axios.put(url, file, {
//                 headers: { "Content-Type": file.type },
//             });
            
//             toast.success("Video uploaded successfully");
//         } catch (error) {
//             console.error("Error uploading video:", error);
//             toast.error("Error uploading video");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <>
//             {/* Start Upload video */}
//             <div className="uploading-resume">
//                 <div className="uploadButton">
//                     <input
//                         className="uploadButton-input"
//                         type="file"
//                         name="attachments[]"
//                         accept="video/mp4,video/webm,video/quicktime"
//                         id="upload-video"
//                         onChange={videoManagerHandler}
//                     />
//                     <label className="cv-uploadButton" htmlFor="upload-video">
//                         <span className="icon"><BsCloudUpload /></span>
//                         <span className="title">Drop your demo video here to upload</span>
//                         <span className="text">
//                             Max file size is 10MB, Suitable files are .mp4, .webm & .mov
//                         </span>
//                         <span className="theme-btn btn-style-one">
//                             Upload demo video
//                         </span>
//                         {getError !== "" ? (
//                             <p className="ui-danger mb-0">{getError}</p>
//                         ) : undefined}
//                     </label>
//                     <span className="uploadButton-file-name"></span>
//                 </div>
//             </div>
//             {/* End upload video */}

//             {/* Start video Preview */}
//             <div className="files-outer">
//                 {getManager?.map((file, i) => (
//                     <div key={i} className="file-edit-box">
//                         <span className="title">{file.name}</span>
//                         <div className="edit-btns">
//                             <button onClick={() => uploadVideo(file)} disabled={uploading}>
//                                 <span className="icon"><BsPencil /></span>
//                             </button>
//                             <button onClick={() => deleteHandler(file.name)}>
//                                 <span className="icon"><BsTrash /></span>
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {/* End video Preview */}
//         </>
//     );
// };

// export default LogoUpload;


import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { BsCloudUpload, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API endpoint for video upload
const VIDEO_API_URL =
  "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-video";

// Validation function for allowed video file types
function checkFileTypes(file) {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime" // .mov files
  ];
  return allowedTypes.includes(file.type);
}

const LogoUpload = () => {
  const { user } = useAuth();
  const [getManager, setManager] = useState([]);
  const [getError, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Triggered automatically when a file is selected
  const videoManagerHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file already exists (by name)
    const isExist = getManager.some((existingFile) => existingFile.name === file.name);
    if (isExist) {
      setError("File already exists");
      toast.error("File already exists");
      return;
    }
    
    // Check file type
    if (!checkFileTypes(file)) {
      setError("Only accept (.mp4, .webm, .mov) files");
      toast.error("Only accept (.mp4, .webm, .mov) files");
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      toast.error("File size must be less than 10MB");
      return;
    }
    
    // Clear error and add the file to the list (for preview)
    setError("");
    setManager((prevFiles) => [...prevFiles, file]);
    
    // Automatically trigger upload, including the current user's UID
    await uploadVideo(file);
  };

  // Delete file from the preview list
  const deleteHandler = (name) => {
    const deleted = getManager.filter((file) => file.name !== name);
    setManager(deleted);
  };

  // Function to upload video using a pre-signed URL.
  // The current user's UID (firebase_uid) is added to the query parameters.
  const uploadVideo = async (file) => {
    try {
      setUploading(true);
      // Set request parameters including the file type and firebase_uid.
      const params = { fileType: file.type, firebase_uid: user?.uid };
      const getUrlResponse = await axios.get(VIDEO_API_URL, { params });
      console.log("Pre-signed URL response:", getUrlResponse.data);

      const { url, key } = getUrlResponse.data;
      // Upload the video file directly to S3 via PUT using the pre-signed URL.
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });
      
      toast.success("Uploaded video successfully");
    //   alert("Uploaded video successfully! Key: " + key);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Upload Video Section */}
      <div className="uploading-resume">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept="video/mp4,video/webm,video/quicktime"
            id="upload-video"
            onChange={videoManagerHandler}
          />
          <label className="cv-uploadButton" htmlFor="upload-video">
            <span className="icon"><BsCloudUpload /></span>
            <span className="title">Drop your demo video here to upload</span>
            <span className="text">
              Max file size is 10MB, Suitable files are .mp4, .webm & .mov
            </span>
            <span className="theme-btn btn-style-one">
              Upload demo video
            </span>
            {getError !== "" && <p className="ui-danger mb-0">{getError}</p>}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
      </div>
      
      {/* Video Preview Section (with delete option) */}
      <div className="files-outer">
        {getManager.map((file, i) => (
          <div key={i} className="file-edit-box">
            <span className="title">{file.name}</span>
            <div className="edit-btns">
              <button onClick={() => deleteHandler(file.name)}>
                <span className="icon"><BsTrash /></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LogoUpload;