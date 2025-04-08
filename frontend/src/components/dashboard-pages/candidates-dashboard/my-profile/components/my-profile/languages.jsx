import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const Languages = ({ updateFormData }) => {
  const { user } = useAuth();

  // State for user's language entries
  const [languages, setLanguages] = useState([
    { language: "", speak: false, read: false, write: false }
  ]);
  
  // State for available language options
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Fetch available languages (reference data)
  useEffect(() => {
    const fetchAvailableLanguages = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_DEV1_API + "/languages"
        );
        const filtered = response.data.filter(
          (lang) => lang.category === "languages in India"
        );
        setAvailableLanguages(filtered);
      } catch (error) {
        console.error("Error fetching available languages:", error);
      }
    };

    fetchAvailableLanguages();
  }, []);

  // Fetch user's stored languages from backend (if any)
  useEffect(() => {
    if (!user?.uid) return;
    const fetchUserLanguages = async () => {
      try {
        const response = await axios.get(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/languages",
          { params: { firebase_uid: user.uid } }
        );
        if (response.status === 200 && response.data.length > 0) {
          const record = response.data[0]; // assuming one row per user
          let stored = record.languages;
          if (typeof stored === "string") {
            stored = JSON.parse(stored);
          }
          const languageData = Array.isArray(stored) ? stored : [stored];
          setLanguages(languageData);
          // Update parent with initial data
          updateFormData({ languages: languageData }, true);
        }
      } catch (error) {
        console.error("Error fetching user's languages:", error);
      }
    };

    fetchUserLanguages();
  }, [user?.uid, updateFormData]);

  // Handle changes in the language rows
  const handleLanguageChange = (index, field, value) => {
    setLanguages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Update parent with new data
      updateFormData({ languages: updated }, true);
      return updated;
    });
  };

  const addLanguage = () => {
    setLanguages((prev) => {
      const updated = [
        ...prev,
        { language: "", speak: false, read: false, write: false }
      ];
      // Update parent with new data
      updateFormData({ languages: updated }, true);
      return updated;
    });
  };

  // Remove language row
  const removeLanguage = (index) => {
    setLanguages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Update parent with new data
      updateFormData({ languages: updated }, true);
      return updated;
    });
  };

  // Submit handler to upsert languages
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error("Please log in to save your languages.");
      return;
    }
    try {
      const payload = {
        firebase_uid: user.uid,
        languages: JSON.stringify(languages)
      };
      const response = await axios.post(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/languages",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Languages saved successfully!");
      } else {
        throw new Error("Failed to save languages");
      }
    } catch (error) {
      console.error(
        "Error details:",
        error.response?.data || error.message || "Unknown error"
      );
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Failed to save languages"
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="language-table">
          <table className="table">
            <thead>
              <tr>
                <th>Languages Known</th>
                <th>Speak</th>
                <th>Read</th>
                <th>Write</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang, index) => (
                <tr key={index}>
                  <td>
                    <select
                      className="form-control"
                      id={`language-${index}`}
                      name={`language-${index}`}
                      value={lang.language}
                      onChange={(e) =>
                        handleLanguageChange(index, "language", e.target.value)
                      }
                    >
                      <option value="">Select Language</option>
                      {availableLanguages
                        .filter((availableLang) =>
                          !languages.some(
                            (l, i) =>
                              i !== index && l.language === availableLang.value
                          )
                        )
                        .map((availableLang) => (
                          <option key={availableLang.id} value={availableLang.value}>
                            {availableLang.label}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={lang.speak}
                      onChange={(e) =>
                        handleLanguageChange(index, "speak", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={lang.read}
                      onChange={(e) =>
                        handleLanguageChange(index, "read", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={lang.write}
                      onChange={(e) =>
                        handleLanguageChange(index, "write", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeLanguage(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="theme-btn btn-style-three"
            onClick={addLanguage}
          >
            Add Language
          </button>
          <button type="submit" className="theme-btn btn-style-three">
            Save Languages
          </button>
        </div>
      </div>
    </form>
  );
};

Languages.propTypes = {
  updateFormData: PropTypes.func.isRequired
};

export default Languages;

