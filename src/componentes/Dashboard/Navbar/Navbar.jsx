import React from 'react'
import "./navbar.css"
import { SignOutButton } from '@clerk/clerk-react'
function Navbar() {
  return (
    <>
        <header className='navbar'>
            <nav className='nav-pc'>
                <div className="user__info">
                    <picture className="user__image">
                        <img src="https://placehold.jp/100x100.png" alt="" />
                    </picture>
                    <div className="user__name"><SignOutButton/></div>
                </div>
                <ul className='nav-pc__links'>
                    <li className='nav-pc__li'>Inicio</li>
                    <li className='nav-pc__li'>Clientes</li>
                    <li className='nav-pc__li'>Cuentas C.</li>
                    <li className='nav-pc__li'>Pagos</li>
                    <li className='nav-pc__li'>Vencimientos</li>
                    <li className='nav-pc__li'>Reportes</li>
                    <li className='nav-pc__li'>Ajustes</li>
                    {/* <a href="#">{"Cerrar Sesión"}</a> */}
                </ul>
            </nav>
        </header>
    </>
  )
}

export default Navbar