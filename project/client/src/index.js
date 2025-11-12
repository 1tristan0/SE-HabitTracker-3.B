import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// nur wenn du reportWebVitals weiter nutzen möchtest, diesen Import behalten
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// und nur dann verwenden:
// reportWebVitals(console.log);
