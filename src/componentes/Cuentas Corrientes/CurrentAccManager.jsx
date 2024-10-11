import React from 'react'
import "./currentAccManager.css"
import Navbar from '../Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import SearchClients from './SearchClients'
import ClientFile from './FicheroCliente/ClientFile'
import { SignedIn } from '@clerk/clerk-react'
function CurrentAccManager() {
    return (
        <>
            <Navbar />
            <div className='container-wrapper'>
                <h1 className='title'>Cuentas corrientes</h1>
                
                    <Routes>
                        <Route path='/' element={<SignedIn>
                            <SearchClients />
                        </SignedIn>} />
                        <Route path='/show-debts' element={<SignedIn>
                            <ClientFile />
                        </SignedIn>} />
                        <Route path='/show-history/:clientId' element={<h1>Muestra el historial del usuario</h1>} />
                    </Routes>
                

            </div>
        </>
    )
}

export default CurrentAccManager