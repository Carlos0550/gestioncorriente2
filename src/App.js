import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './componentes/Dashboard/Dashboard';
import './App.css';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Login from './componentes/Inicio de sesion/Login';

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
        path='*'
        element={<Navigate to="/" replace />} // Redirige cualquier ruta no encontrada a Login
      />
    </Routes>
  );
}

export default App;
