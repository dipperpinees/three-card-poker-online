import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from './context';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <Store>
            <App />
        </Store>
    </React.StrictMode>,
    document.getElementById('root')
);
