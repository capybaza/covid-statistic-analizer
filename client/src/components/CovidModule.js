import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CsvImportModal from './CsvImportModal';
import './CovidModule.css';

const CovidModule = () => {
    console.log("Rendering CovidModule");

    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState([]);

    // Параметры для пагинации
    const pageSize = 10;

    const fetchCovidData = useCallback(async () => {
        try {
            console.log("Fetching COVID data with filters:", filters, "and page:", page);
            const skip = (page - 1) * pageSize; // Смещение для пагинации
            const response = await axios.get('/api/covid', {
                params: {
                    ...filters,
                    skip,
                    limit: pageSize
                }
            });
            console.log('Response data:', response.data);

            // Обработка ответа
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

    return (
        <div className="covid-module">
            <div className="actions">
                <button onClick={() => setShowModal(true)}>Импорт</button>
                <button disabled>Создать</button> {/* Кнопка "Создать" неактивная */}
            </div>
            <CsvImportModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                onUpload={handleUploadCsv}
                errors={errors}
            />
            <div className="filters">
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
                <button onClick={applyFilters}>Применить</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Observation Date</th>
                        <th>Штат</th>
                        <th>Страна</th>
                        <th>Дата и время последнего обновления</th>
                        <th>Кол-во заразившихся</th>
                        <th>Кол-во выздоровевших</th>
                        <th>Кол-во умерших</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.id}>
                                <td>{record.observationDate}</td>
                                <td>{record.state}</td>
                                <td>{record.country}</td>
                                <td>{record.lastUpdate}</td>
                                <td>{record.Confirmed}</td>
                                <td>{record.Recovered}</td>
                                <td>{record.Deaths}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Нет данных</td>
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
