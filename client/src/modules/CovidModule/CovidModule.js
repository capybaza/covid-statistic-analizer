import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import CsvImportModal from '../../components/Modal/CsvImportModal';
import RecordModal from '../../components/Modal/RecordModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import '../../styles/App.css';
import importIcon from '../../assets/import.svg';
import deleteIcon from '../../assets/delete.svg';
import createIcon from '../../assets/create.svg';
import editIcon from '../../assets/edit.svg';

const CovidModule = () => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [currentRecord, setCurrentRecord] = useState(null);

    const pageSize = 10;

    const fetchCovidData = useCallback(async () => {
        try {
            const skip = (page - 1) * pageSize;
            const response = await axios.get('/api/covid', {
                params: {
                    ...filters,
                    skip,
                    limit: pageSize
                }
            });

            if (response.data.records) {
                setData(response.data.records);
                setTotalCount(response.data.total_count);
                setTotalPages(Math.ceil(response.data.total_count / pageSize));
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchCovidData();
    }, [fetchCovidData]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({ ...filters, [name]: value });
    };

    const applyFilters = () => {
        setPage(1);
        fetchCovidData();
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleUploadCsv = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('/api/upload_csv', formData);
            if (response.data.errors && response.data.errors.length > 0) {
                setErrors(response.data.errors);
                setShowModal(true);
            } else {
                alert('Import successful');
            }
        } catch (error) {
            console.error("Error uploading CSV:", error);
        }
    };

    const createRecord = async (record) => {
        try {
            await axios.post('/api/covid/create', record);
            setShowRecordModal(false);
            await fetchCovidData();
        } catch (error) {
            console.error("Error creating record:", error);
        }
    };

    const updateRecord = async (record) => {
        try {
            await axios.put(`/api/covid/update/${record.id}`, record);
            setShowRecordModal(false);
            await fetchCovidData();
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/covid/delete/${currentRecord.id}`);
            setShowDeleteModal(false);
            await fetchCovidData();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    const handleSave = (formData) => {
        if (currentRecord) {
            updateRecord(formData);
        } else {
            createRecord(formData);
        }
        setShowRecordModal(false);
    };

    const formatDateTime = (date) => moment(date).format('DD.MM.YYYY HH:mm:ss');
    const formatDate = (date) => moment(date).format('DD.MM.YYYY');

    return (
        <div className="covid-module">
            <div className="actions">
                <button className="icon-button" onClick={() => {
                    setCurrentRecord(null);  // Сбрасываем текущую запись для создания новой
                    setShowRecordModal(true);
                }}>
                    <img src={createIcon} alt="Создать"/>
                </button>
                <button className="icon-button" onClick={() => setShowModal(true)}>
                    <img src={importIcon} alt="Импорт"/>
                </button>
            </div>
            <CsvImportModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                onUpload={handleUploadCsv}
                errors={errors}
            />
            <RecordModal
                isOpen={showRecordModal}
                onClose={() => setShowRecordModal(false)}
                onSave={handleSave}
                record={currentRecord}
            />
            <ConfirmationModal
                isOpen={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
            <div className="filters">
                {/* Поля фильтрации по штату и стране */}
                <input
                    type="text"
                    name="state"
                    placeholder="Штат"
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Страна"
                    onChange={handleFilterChange}
                />

                {/* Поля фильтрации по количеству подтвержденных случаев */}
                <input
                    type="number"
                    name="min_confirmed"
                    placeholder="Подтвержденные случаи От"
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="max_confirmed"
                    placeholder="Подтвержденные случаи До"
                    onChange={handleFilterChange}
                />

                {/* Поля фильтрации по количеству выздоровлений */}
                <input
                    type="number"
                    name="min_recovered"
                    placeholder="Выздоровления От"
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="max_recovered"
                    placeholder="Выздоровления До"
                    onChange={handleFilterChange}
                />

                {/* Поля фильтрации по количеству смертей */}
                <input
                    type="number"
                    name="min_deaths"
                    placeholder="Смерти От"
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="max_deaths"
                    placeholder="Смерти До"
                    onChange={handleFilterChange}
                />

                {/* Поля фильтрации по дате наблюдения */}
                <input
                    type="date"
                    name="start_observation_date"
                    placeholder="Дата наблюдения От"
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="end_observation_date"
                    placeholder="Дата наблюдения До"
                    onChange={handleFilterChange}
                />

                {/* Поля фильтрации по дате последнего обновления */}
                <input
                    type="date"
                    name="start_last_update"
                    placeholder="Дата последнего обновления От"
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="end_last_update"
                    placeholder="Дата последнего обновления До"
                    onChange={handleFilterChange}
                />
                <button onClick={applyFilters}>Применить</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Дата наблюдения</th>
                    <th>Штат / Провинция</th>
                    <th>Страна</th>
                    <th>Дата и время последнего обновления</th>
                    <th>Кол-во заразившихся</th>
                    <th>Кол-во выздоровевших</th>
                    <th>Кол-во умерших</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((record) => (
                        <tr key={record.id}>
                            <td>{formatDate(record.observationDate)}</td>
                            <td>{record.state}</td>
                            <td>{record.country}</td>
                            <td>{formatDateTime(record.lastUpdate)}</td>
                            <td>{record.Confirmed}</td>
                            <td>{record.Recovered}</td>
                            <td>{record.Deaths}</td>
                            <td>
                                <button className="icon-button" onClick={() => {
                                    setCurrentRecord(record);
                                    setShowRecordModal(true);
                                }}>
                                    <img src={editIcon} alt="Обновить"/>
                                </button>
                                <button className="icon-button" onClick={() => {
                                    setCurrentRecord(record);
                                    setShowDeleteModal(true);
                                }}>
                                    <img src={deleteIcon} alt="Удалить"/>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">Нет данных</td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                >
                    Первая
                </button>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Предыдущая
                </button>
                <span>Страница {page} из {totalPages} ({totalCount} записей)</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Следующая
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                >
                    Последняя
                </button>
            </div>
        </div>
    );
};

export default CovidModule;
