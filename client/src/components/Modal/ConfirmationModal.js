import React from 'react';
import BaseModal from './BaseModal';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onRequestClose} title="Подтверждение удаления">
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <button onClick={onConfirm}>Да</button>
            <button onClick={onRequestClose}>Нет</button>
        </BaseModal>
    );
};

export default ConfirmationModal;
