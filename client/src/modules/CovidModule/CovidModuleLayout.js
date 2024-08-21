import React from 'react';
import moment from 'moment';
import CsvImportModal from '../../components/Modal/CsvImportModal';
import RecordModal from '../../components/Modal/RecordModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';

const CovidModuleLayout = ({
    data,
    page,
    totalPages,
    totalCount,
    showModal,
    showRecordModal,
    showDeleteModal,
    errors,
    currentRecord,
    handleFilterChange,
    applyFilters,
    handlePageChange,
    handleUploadCsv,
    setShowModal,
    setShowRecordModal,
    setShowDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    setCurrentRecord
}) => {
    // Определение метода сохранения в зависимости от наличия текущей записи
    const handleSave = (formData) => {
        if (currentRecord) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
        setShowRecordModal(false);
    };

    // Функция для форматирования дат
    const formatDateTime = (date) => moment(date).format('DD.MM.YYYY HH:mm:ss');
    const formatDate = (date) => moment(date).format('DD.MM.YYYY');

    return (
        <div className="covid-module">
            <div className="actions">
                <button onClick={() => {
                    setCurrentRecord(null);  // Сбрасываем текущую запись для создания новой
                    setShowRecordModal(true);
                }}>Создать</button>
                <button onClick={() => setShowModal(true)}>Импорт</button>
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
                                    <button onClick={() => {
                                        setCurrentRecord(record);
                                        setShowRecordModal(true);
                                    }}>
                                        Обновить
                                    </button>
                                    <button onClick={() => {
                                        setCurrentRecord(record);
                                        setShowDeleteModal(true);
                                    }}>
                                        Удалить
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

export default CovidModuleLayout;
