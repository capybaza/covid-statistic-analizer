import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>Подтверждение удаления</h2>
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <button onClick={onConfirm}>Да</button>
            <button onClick={onRequestClose}>Нет</button>
        </Modal>
    );
};

export default ConfirmationModal;
