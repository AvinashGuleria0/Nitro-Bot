import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import  UserProvider  from "./context/UserContext";
import './index.css';


const Root = () => (
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
