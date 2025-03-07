// import { useState } from "react";

// const LogoCoverUploader = () => {
//     const [logoImg, setLogoImg] = useState("");
//     const [converImg, setCoverImg] = useState("");

//     // logo image
//     const logoHandler = (file) => {
//         setLogoImg(file);
//     };

//     // cover image
//     const coverHandler = (file) => {
//         setCoverImg(file);
//     };

//     return (
//         <>
//             <div className="uploading-outer">
//                 <div className="uploadButton">
//                     <input
//                         className="uploadButton-input"
//                         type="file"
//                         name="attachments[]"
//                         accept="image/*"
//                         id="upload"
//                         required
//                         onChange={(e) => logoHandler(e.target.files[0])}
//                     />
//                     <label
//                         className="uploadButton-button ripple-effect"
//                         htmlFor="upload"
//                     >
//                         {logoImg !== "" ? logoImg?.name : " Upload your Institution photo"}
//                     </label>
//                     <span className="uploadButton-file-name"></span>
//                 </div>
//                 <div className="text">
//                     Max file size is 1MB, Minimum dimension: 330x300 And
//                     Suitable files are .jpg & .png
//                 </div>
//             </div>

           
//         </>
//     );
// };

// export default LogoCoverUploader;

// LogoCoverUploader.jsx
import React, { useState } from "react";

const LogoCoverUploader = ({ onChange }) => {
  const [logoImg, setLogoImg] = useState(null);

  // Handler to convert the selected file into a base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a FileReader to read the file as a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is a string like "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
        // We remove the prefix ("data:image/png;base64,") to get only the base64 data.
        const base64Data = reader.result.split(",")[1];
        setLogoImg(file);
        // Call the onChange callback to update the parent component's state
        if (onChange) {
          onChange([{ base64: base64Data, fileName: file.name }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="uploading-outer">
      <div className="uploadButton">
        <input
          className="uploadButton-input"
          type="file"
          name="attachments[]"
          accept="image/*"
          id="upload"
          required
          onChange={handleFileChange}
        />
        <label
          className="uploadButton-button ripple-effect"
          htmlFor="upload"
        >
          {logoImg ? logoImg.name : "Upload your Institution photo"}
        </label>
      </div>
      <div className="text">
        Max file size is 1MB, Minimum dimension: 330x300. Suitable files are .jpg &amp; .png.
      </div>
    </div>
  );
};

export default LogoCoverUploader;
