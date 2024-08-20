import React, { useState } from 'react';
import axios from 'axios';
import './CsvImportModal.css';
import ReactModal from "react-modal";

const CsvImportModal = ({ isOpen, onRequestClose }) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload_csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.errors.length > 0) {
        setErrors(response.data.errors);
        setSuccess(false);
      } else {
        setErrors([]);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Import failed', error);
      setErrors([{ error_message: 'Import failed' }]);
      setSuccess(false);
    }
  };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2>Импорт CSV файла</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImport}>Импортировать</button>
      <button onClick={onRequestClose}>Назад</button>

      {errors.length > 0 && (
        <div>
          <h3>Ошибки импорта:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                Строка {error.row_number}: {error.error_message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {success && <div>Импорт прошел успешно!</div>}
    </ReactModal>
  );
};

export default CsvImportModal;
