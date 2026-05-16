import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import  UserProvider  from "./context/UserContext";
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

const Root = () => (
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy-client-id.apps.googleusercontent.com"}>
      <UserProvider>
        <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
