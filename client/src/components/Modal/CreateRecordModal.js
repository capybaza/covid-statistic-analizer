import React from 'react';
import RecordModal from './RecordModal';

const CreateRecordModal = ({ isOpen, onRequestClose, onCreate }) => {
    return (
        <RecordModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            onSave={onCreate}
            title="Создать новую запись"
        />
    );
};

export default CreateRecordModal;
