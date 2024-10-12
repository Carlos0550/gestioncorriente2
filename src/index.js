import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppContextProvider } from './context/AppContext';
import {BrowserRouter} from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import { ConfigProvider } from 'antd';
import es_ES from "antd/locale/es_ES"

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <BrowserRouter>
        <AppContextProvider>
        <ConfigProvider locale={es_ES}>
          <App />
          </ConfigProvider>
        </AppContextProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

