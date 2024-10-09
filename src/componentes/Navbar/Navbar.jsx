import React, { useEffect } from 'react'
import "./navbar.css"
import { SignOutButton } from '@clerk/clerk-react'
import Link from 'antd/es/typography/Link'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Space } from 'antd'
function Navbar() {
    const navigate = useNavigate()
    const { currentUser } = useAppContext()

  return (
    <>
        <header className='navbar'>
            <nav className='nav-pc'>
                <div className="user__info">
                    <picture className="user__image">
                        <img src={currentUser.userimage} alt="" />
                    </picture>
                    <div className="user__name"><Space> {currentUser.username} <SignOutButton className="logout__button" /></Space></div>
                </div>
                <ul className='nav-pc__links'>
                    <li className='nav-pc__li'>Inicio</li>
                    <li className='nav-pc__li' onClick={()=> navigate("/clientes")}>Clientes</li>
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