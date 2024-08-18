import React, { useState } from 'react';
import { uploadCsv } from '../api';
import Modal from './Modal';

const CsvUpload = () => {
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setModalContent(<p>Пожалуйста, выберите файл для загрузки.</p>);
            setIsModalOpen(true);
            return;
        }

        try {
            const result = await uploadCsv(file);
            if (result.errors && result.errors.length > 0) {
                setModalContent(
                    <div>
                        <h2>Ошибки импорта:</h2>
                        <ul>
                            {result.errors.map((error, index) => (
                                <li key={index}>
                                    Строка {error.row_number}: {error.error_message}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else {
                setModalContent(<p>CSV файл успешно обработан.</p>);
            }
        } catch (error) {
            setModalContent(<p>Произошла ошибка: {error.detail}</p>);
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Загрузить CSV</button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div>
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Импортировать</button>
                </div>
                {modalContent}
            </Modal>
        </div>
    );
};

export default CsvUpload;
