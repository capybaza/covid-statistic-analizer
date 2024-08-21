import React from 'react';
import '../../styles/Sidebar.css';

function Sidebar({ onSelectModule }) {
    return (
        <div className="sidebar">
            <button onClick={() => onSelectModule('covid')}>Covid Module</button>
            {/* Добавьте другие кнопки для навигации */}
        </div>
    );
}

export default Sidebar;
