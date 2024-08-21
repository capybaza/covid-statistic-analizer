import React from 'react';
import RecordModal from './RecordModal';

const UpdateRecordModal = ({ isOpen, onRequestClose, onUpdate, record }) => {
    return (
        <RecordModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            onSave={onUpdate}
            record={record}
            title="Обновить запись"
        />
    );
};

export default UpdateRecordModal;
