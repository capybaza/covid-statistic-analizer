import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import CovidModule from './modules/CovidModule/CovidModule';
import './styles/App.css';

function App() {
    const [selectedModule, setSelectedModule] = useState('covid');

    const renderModule = () => {
        switch (selectedModule) {
            case 'covid':
                return <CovidModule />;
            // Сюда пихаем модули
            default:
                return <div>Select a module</div>;
        }
    };

    return (
        <div className="app">
            <Sidebar onSelectModule={setSelectedModule} />
            <div className="main-content">
                {renderModule()}
            </div>
        </div>
    );
}

export default App;
