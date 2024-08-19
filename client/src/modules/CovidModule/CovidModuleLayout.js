import React from 'react';
import CsvImportModal from '../../components/CsvImportModal/CsvImportModal';

const CovidModuleLayout = ({
    data,
    page,
    totalPages,
    totalCount,
    showModal,
    errors,
    handleFilterChange,
    applyFilters,
    handlePageChange,
    handleUploadCsv,
    setShowModal
}) => {
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
                        <th>Дата наблюдения</th>
                        <th>Штат / Провинция</th>
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

export default CovidModuleLayout;
