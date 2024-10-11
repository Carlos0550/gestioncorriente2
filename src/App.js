import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './componentes/Dashboard/Dashboard';
import './App.css';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Login from './componentes/Inicio de sesion/Login';
import ClientsManager from './componentes/AdministrarClientes/ClientsManager';
import CurrentAccManager from './componentes/Cuentas Corrientes/CurrentAccManager';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/dashboard'
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />

      <Route
        path='/clientes'
        element={
          <SignedIn>
            <ClientsManager />
          </SignedIn>
        }
      />

      <Route
        path='/cuentas-corrientes/*'
        element={
          <SignedIn>
            <CurrentAccManager />
          </SignedIn>
        }
      />
      <Route
        path='*'
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
