import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal"
            className="Modal"
            overlayClassName="Overlay"
        >
            {children}
            <button onClick={onClose}>Назад</button>
        </ReactModal>
    );
};

export default Modal;
