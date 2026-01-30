import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';

// nur wenn du reportWebVitals weiter nutzen möchtest, diesen Import behalten
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
<App />
</BrowserRouter>
);

// und nur dann verwenden:
// reportWebVitals(console.log);
