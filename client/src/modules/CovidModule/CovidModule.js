import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CovidModuleLayout from './CovidModuleLayout';
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
        <CovidModuleLayout
            data={data}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            showModal={showModal}
            errors={errors}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            handlePageChange={handlePageChange}
            handleUploadCsv={handleUploadCsv}
            setShowModal={setShowModal}
        />
    );
};

export default CovidModule;
