import React from 'react';
import ReactModal from 'react-modal';
import '../../styles/BaseModal.css';

ReactModal.setAppElement('#root');

const BaseModal = ({ isOpen, onClose, title, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title || 'Modal'}
            className="modal"
            overlayClassName="overlay"
        >
            {title && <h2>{title}</h2>}
            {children}
            <button onClick={onClose}>Назад</button>
        </ReactModal>
    );
};

export default BaseModal;
