// import { useState } from "react";
// import { BsCloudUpload, BsPencil, BsTrash } from 'react-icons/bs';

// // validation chaching
// function checkFileTypes(files) {
//     const allowedTypes = [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     for (let i = 0; i < files.length; i++) {
//         if (!allowedTypes.includes(files[i].type)) {
//             return false;
//         }
//     }
//     return true;
// }

// const CvUploader = () => {
//     const [getManager, setManager] = useState([]);
//     const [getError, setError] = useState("");

//     const cvManagerHandler = (e) => {
//         const data = Array.from(e.target.files);

//         const isExist = getManager?.some((file1) =>
//             data.some((file2) => file1.name === file2.name)
//         );
//         if (!isExist) {
//             if (checkFileTypes(data)) {
//                 setManager(getManager.concat(data));
//                 setError("");
//             } else {
//                 setError("Only accept  (.doc, .docx, .pdf) file");
//             }
//         } else {
//             setError("File already exists");
//         }
//     };

//     // delete image
//     const deleteHandler = (name) => {
//         const deleted = getManager?.filter((file) => file.name !== name);
//         setManager(deleted);
//     };

//     return (
//         <>
//             {/* Start Upload resule */}
//             <div className="uploading-resume">
//                 <div className="uploadButton">
//                     <input
//                         className="uploadButton-input"
//                         type="file"
//                         name="attachments[]"
//                         accept=".doc,.docx,.xml,application/msword,application/pdf, image/*"
//                         id="upload"
//                         multiple
//                         onChange={cvManagerHandler}
//                     />
//                     <label className="cv-uploadButton" htmlFor="upload">
//                         <span className="icon"><BsCloudUpload /></span>
//                         <span className="title">Drop files here to upload</span>
//                         <span className="text">
//                             To upload file size is (Max 5Mb) and allowed file
//                             types are (.doc, .docx, .pdf)
//                         </span>
//                         <span className="theme-btn btn-style-one">
//                             Upload Resume
//                         </span>
//                         {getError !== "" ? (
//                             <p className="ui-danger mb-0">{getError}</p>
//                         ) : undefined}
//                     </label>
//                     <span className="uploadButton-file-name"></span>
//                 </div>
//             </div>
//             {/* End upload-resume */}

//             {/* Start resume Preview  */}
//             <div className="files-outer">
//                 {getManager?.map((file, i) => (
//                     <div key={i} className="file-edit-box">
//                         <span className="title">{file.name}</span>
//                         <div className="edit-btns">
//                             <button>
//                                 <span className="icon"><BsPencil /></span>
//                             </button>
//                             <button onClick={() => deleteHandler(file.name)}>
//                                 <span className="icon"><BsTrash /></span>
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//                 {/* <div className="file-edit-box">
//                     <span className="title">Sample CV</span>
//                     <div className="edit-btns">
//                         <button>
//                             <span className="la la-pencil"></span>
//                         </button>
//                         <button>
//                             <span className="la la-trash"></span>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="file-edit-box">
//                     <span className="title">Sample CV</span>
//                     <div className="edit-btns">
//                         <button>
//                             <span className="la la-pencil"></span>
//                         </button>
//                         <button>
//                             <span className="la la-trash"></span>
//                         </button>
//                     </div>
//                 </div>*/}
//             </div>
//             {/* End resume Preview  */}
//         </>
//     );
// };

// export default CvUploader;

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { BsCloudUpload, BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation function: only accept .doc, .docx and .pdf files.
function checkFileTypes(files) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  for (let i = 0; i < files.length; i++) {
    if (!allowedTypes.includes(files[i].type)) {
      return false;
    }
  }
  return true;
}

const RESUME_API_URL =
  "https://2mubkhrjf5.execute-api.ap-south-1.amazonaws.com/dev/upload-resume";

// Helper: Convert file to Base64.
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CvUploader = () => {
  // Use auth to track the current user.
  const { user } = useAuth();
  const currentUid = user?.uid;

  const [getManager, setManager] = useState([]);
  const [getError, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // When files are selected, check their validity, update preview,
  // and trigger automatic upload for each file.
  const cvManagerHandler = async (e) => {
    const data = Array.from(e.target.files);

    // Check if any file already exists in the preview list (by name)
    const isExist = getManager?.some((file1) =>
      data.some((file2) => file1.name === file2.name)
    );
    if (isExist) {
      setError("File already exists");
      toast.error("File already exists");
      return;
    }
    if (!checkFileTypes(data)) {
      setError("Only accept (.doc, .docx, .pdf) files");
      toast.error("Only accept (.doc, .docx, .pdf) files");
      return;
    }
    // Clear error and update preview list.
    setError("");
    for (const file of data) {
      setManager((prevFiles) => [...prevFiles, file]);
      await uploadResume(file);
    }
  };

  // Function to upload resume automatically.
  const uploadResume = async (file) => {
    try {
      setUploading(true);
      const base64Data = await fileToBase64(file);
      const payload = {
        file: base64Data,
        fileType: file.type,
        firebase_uid: currentUid,
      };
      const response = await axios.post(RESUME_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Resume uploaded successfully:", response.data);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Error uploading resume");
    } finally {
      setUploading(false);
    }
  };

  // Delete file from preview.
  const deleteHandler = (name) => {
    const deleted = getManager?.filter((file) => file.name !== name);
    setManager(deleted);
  };

  return (
    <>
      {/* Start Upload Resume */}
      <div className="uploading-resume">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept=".doc,.docx,.xml,application/msword,application/pdf"
            id="upload"
            multiple
            onChange={cvManagerHandler}
          />
          <label className="cv-uploadButton" htmlFor="upload">
            <span className="icon">
              <BsCloudUpload />
            </span>
            <span className="title">Drop files here to upload</span>
            <span className="text">
              To upload file size is (Max 5Mb) and allowed file types are (.doc,
              .docx, .pdf)
            </span>
            <span className="theme-btn btn-style-one">Upload Resume</span>
            {getError && <p className="ui-danger mb-0">{getError}</p>}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
      </div>
      {/* End Upload Resume */}

      {/* Start Resume Preview */}
      <div className="files-outer">
        {getManager?.map((file, i) => (
          <div key={i} className="file-edit-box">
            <span className="title">{file.name}</span>
            <div className="edit-btns">
              <button>
                <span className="icon">
                  <BsPencil />
                </span>
              </button>
              <button onClick={() => deleteHandler(file.name)}>
                <span className="icon">
                  <BsTrash />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* End Resume Preview */}
    </>
  );
};

export default CvUploader;