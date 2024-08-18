import React from 'react';
import CsvUpload from './components/CsvUpload';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Импорт данных о Covid-19</h1>
                <CsvUpload />
            </header>
        </div>
    );
}

export default App;
