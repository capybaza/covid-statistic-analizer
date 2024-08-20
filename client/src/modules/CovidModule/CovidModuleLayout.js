import React from 'react';
import CsvImportModal from '../../components/CsvImportModal/CsvImportModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import UpdateRecordModal from "../../components/Modal/UpdateRecordModal";
import CreateRecordModal from "../../components/Modal/CreateRecordModal";

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

    return (
        <div className="covid-module">
            <div className="actions">
                <button onClick={() => {
                    setCurrentRecord(null);
                    setShowRecordModal(true);
                }}>
                    Создать
                </button>
                <button onClick={() => setShowModal(true)}>Импорт</button>
            </div>
            <CsvImportModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                onUpload={handleUploadCsv}
                errors={errors}
            />
            {currentRecord ? (
                <UpdateRecordModal
                    isOpen={showRecordModal}
                    onRequestClose={() => setShowRecordModal(false)}
                    onUpdate={handleUpdate}
                    record={currentRecord}
                />
            ) : (
                <CreateRecordModal
                    isOpen={showRecordModal}
                    onRequestClose={() => setShowRecordModal(false)}
                    onCreate={handleCreate}
                />
            )}
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
                                <td>{record.observationDate}</td>
                                <td>{record.state}</td>
                                <td>{record.country}</td>
                                <td>{record.lastUpdate}</td>
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
