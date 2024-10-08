import { SignInButton } from '@clerk/clerk-react'
import React from 'react'
import "./login.css"

function Login() {
    
  return (
    <div className='container-wrapper'>
        <div className="login__wrapper">
            <div className="login__form">
                <h1 className='title'>Bienvenido a Gestión Corriente</h1>
                <SignInButton className="login__button" />
            </div>
        </div>
    </div>
  )
}

export default Login