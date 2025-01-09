import { useState } from "react";
import "./profile-styles.css";

const LogoUpload = () => {
    const [imageFile, setImageFile] = useState("");
    const [videoFile, setVideoFile] = useState("");

    const imageFileHandler = (e) => {
        setImageFile(e.target.files[0]);
    };

    const videoFileHandler = (e) => {
        setVideoFile(e.target.files[0]);
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
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload-image"
                    >
                        {imageFile !== "" ? imageFile.name : "Upload your profile image"}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png
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
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload-video"
                    >
                        {videoFile !== "" ? videoFile.name : "Upload your demo video (not more than 5 minutes)"}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                    Max file size is 10MB, Suitable files are .mp4, .webm & .mov
                </div>
            </div>
        </>
    );
};

export default LogoUpload;
