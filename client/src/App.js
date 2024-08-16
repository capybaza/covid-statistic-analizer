import React, { useEffect, useState } from 'react';
import { fetchHello } from './api';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getMessage = async () => {
            const data = await fetchHello();
            setMessage(data.message);
        };

        getMessage();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>{message}</h1>
            </header>
        </div>
    );
}

export default App;
