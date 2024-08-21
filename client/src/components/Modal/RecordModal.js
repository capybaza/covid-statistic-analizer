import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

const RecordModal = ({ isOpen, onRequestClose, onSave, record }) => {
    const [formData, setFormData] = useState({
        observationDate: '',
        state: '',
        country: '',
        lastUpdate: '',
        Confirmed: 0,
        Recovered: 0,
        Deaths: 0
    });

    useEffect(() => {
        if (record) {
            setFormData(record);
        }
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onRequestClose}
            title={record ? 'Обновить запись' : 'Создать запись'}
        >
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="observationDate"
                    placeholder="Дата наблюдения"
                    value={formData.observationDate}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="Штат / Провинция"
                    value={formData.state}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Страна"
                    value={formData.country}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="lastUpdate"
                    placeholder="Дата и время последнего обновления"
                    value={formData.lastUpdate}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="Confirmed"
                    placeholder="Кол-во заразившихся"
                    value={formData.Confirmed}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="Recovered"
                    placeholder="Кол-во выздоровевших"
                    value={formData.Recovered}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="Deaths"
                    placeholder="Кол-во умерших"
                    value={formData.Deaths}
                    onChange={handleChange}
                />
                <button type="submit">{record ? 'Сохранить' : 'Создать'}</button>
            </form>
        </BaseModal>
    );
};

export default RecordModal;
