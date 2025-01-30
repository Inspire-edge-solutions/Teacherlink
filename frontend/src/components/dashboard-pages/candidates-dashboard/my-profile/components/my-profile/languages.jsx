// import React, { useState } from 'react';

// const Languages = () => {
//   const [languages, setLanguages] = useState([{
//     language: '',
//     speak: false,
//     read: false,
//     write: false
//   }]);

//   // List of languages - you can expand this list as needed
//   const languageOptions = [
//     'English',
//     'Hindi',
//     'Bengali',
//     'Telugu',
//     'Marathi',
//     'Tamil',
//     'Urdu',
//     'Gujarati',
//     'Kannada',
//     'Malayalam',
//     'Manipuri',
//     'Konkani',
//     'Punjabi',
//     'Sikkimese',
//     'Assamese',
//     'Bhojpuri',
//     'Haryanvi',
//     'Maithili',
//     'Magahi',
//     'Nepali',
//     'Odia',
//     'Sindhi',
//     'Tulu',
//     'Kashmiri',
//     'Kurukh',
//     'Mizo',
//     'Nagamese',
//     // Add more languages as needed
//   ];

//   const handleLanguageChange = (index, field, value) => {
//     setLanguages(prev => {
//       const newLanguages = [...prev];
//       newLanguages[index] = {
//         ...newLanguages[index],
//         [field]: value
//       };
//       return newLanguages;
//     });
//   };

//   const addLanguage = () => {
//     setLanguages(prev => [...prev, {
//       language: '',
//       speak: false,
//       read: false,
//       write: false
//     }]);
//   };

//   const removeLanguage = (index) => {
//     setLanguages(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="form-group">
//       <h3>Languages Known</h3>
      
//       <div className="language-table">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Languages Known</th>
//               <th>Speak</th>
//               <th>Read</th>
//               <th>Write</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {languages.map((lang, index) => (
//               <tr key={index}>
//                 <td>
//                   <select
//                     className="form-control"
//                     value={lang.language}
//                     onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
//                   >
//                     <option value="">Select Language</option>
//                     {languageOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={lang.speak}
//                     onChange={(e) => handleLanguageChange(index, 'speak', e.target.checked)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={lang.read}
//                     onChange={(e) => handleLanguageChange(index, 'read', e.target.checked)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={lang.write}
//                     onChange={(e) => handleLanguageChange(index, 'write', e.target.checked)}
//                   />
//                 </td>
//                 <td>
//                   {languages.length > 1 && (
//                     <button
//                       type="button"
//                       className="remove-btn"
//                       onClick={() => removeLanguage(index)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         type="button"
//         className="theme-btn btn-style-three"
//         onClick={addLanguage}
//       >
//         Add Language
//       </button>
//     </div>
//   );
// };

// export default Languages;



import { useState } from 'react';
import axios from 'axios';

const Languages = () => {
  const [languages, setLanguages] = useState([{
    language: '',
    speak: false,
    read: false,
    write: false
  }]);

  // List of languages - you can expand this list as needed
  const languageOptions = [
    'English',
    'Hindi',
    'Bengali',
    'Telugu',
    'Marathi',
    'Tamil',
    'Urdu',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Manipuri',
    'Konkani',
    'Punjabi',
    'Sikkimese',
    'Assamese',
    'Bhojpuri',
    'Haryanvi',
    'Maithili',
    'Magahi',
    'Nepali',
    'Odia',
    'Sindhi',
    'Tulu',
    'Kashmiri',
    'Kurukh',
    'Mizo',
    'Nagamese',
    // Add more languages as needed
  ];

  const handleLanguageChange = (index, field, value) => {
    setLanguages(prev => {
      const newLanguages = [...prev];
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: value
      };
      return newLanguages;
    });
  };

  const addLanguage = () => {
    setLanguages(prev => [...prev, {
      language: '',
      speak: false,
      read: false,
      write: false
    }]);
  };

  const removeLanguage = (index) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload to be sent as a JSON object in a single column
    const languagesPayload = JSON.stringify(languages);

    try {
      // Send the languages data to the API
      const response = await axios.post(
        'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/languages',
        { languages: languagesPayload },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Languages saved successfully!');
      } else {
        throw new Error('Failed to save languages');
      }

    } catch (error) {
      console.error('Error details:', error.response?.data || error.message || 'Unknown error');
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to save languages'}`);
    }
  };

  return (
    <>
    <div className="form-group">
      <h3>Languages Known</h3>
      
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
                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  >
                    <option value="">Select Language</option>
                    {languageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    id={`speak-${index}`}
                    name={`speak-${index}`}
                    checked={lang.speak}
                    onChange={(e) => handleLanguageChange(index, 'speak', e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    id={`read-${index}`}
                    name={`read-${index}`}
                    checked={lang.read}
                    onChange={(e) => handleLanguageChange(index, 'read', e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    id={`write-${index}`}
                    name={`write-${index}`}
                    checked={lang.write}
                    onChange={(e) => handleLanguageChange(index, 'write', e.target.checked)}
                  />
                </td>
                <td>
                  {languages.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeLanguage(index)}
                    >
                      Remove
                    </button>
                  )}
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

      <button
        type="submit"
        className="theme-btn btn-style-three"
        onClick={handleSubmit}
      >
        Save Languages
      </button>
      </div>
      </div>
    </>
  );
};

export default Languages;
