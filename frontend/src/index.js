import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AllStates from './context/AppStates';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AllStates>
      <React.StrictMode>
        <App />
    </React.StrictMode>
  </AllStates>
  
);


reportWebVitals();
