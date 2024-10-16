import React from 'react';
import "./navbar.css";
import { SignOutButton } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Space } from 'antd';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAppContext();

    return (
        <header className='navbar'>
            <nav className='nav-pc'>
                <div className="user__info">
                    <picture className="user__image">
                        <img src={currentUser.userimage} alt="" />
                    </picture>
                    <div className="user__name">
                        <Space> 
                            {currentUser.username} 
                            <SignOutButton className="logout__button" />
                        </Space>
                    </div>
                </div>
                <ul className='nav-pc__links'>
                    {currentUser?.administrador && (
                        <li 
                            className={location.pathname === "/dashboard" ? "nav-pc__li active" : "nav-pc__li"} 
                            onClick={() => navigate("/dashboard")}
                        >
                            Inicio
                        </li>
                    )}
                    <li 
                        className={location.pathname === "/clientes" ? 'nav-pc__li active' : 'nav-pc__li'} 
                        onClick={() => navigate("/clientes")}
                    >
                        Clientes
                    </li>
                    <li onClick={()=> navigate("/cuentas-corrientes")} className={location.pathname==="/cuentas-corrientes/*" ? 'nav-pc__li active' : 'nav-pc__li'}>Cuentas C.</li>

                    <li className={location.pathname === "/expirations" ? 'nav-pc__li active' : 'nav-pc__li'} onClick={()=> navigate("/expirations")}>Vencimientos</li>
                    {currentUser?.administrador && (
                        <li className={location.pathname === "/reports" ? 'nav-pc__li active' : 'nav-pc__li'} onClick={()=> navigate("/reports")}>Reportes</li>
                    )}
                    {currentUser?.administrador && (
                        <li className='nav-pc__li'>Ajustes</li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
