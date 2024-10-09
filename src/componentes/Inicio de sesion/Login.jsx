import { SignInButton, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import "./login.css"
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { message, notification } from 'antd';

function Login() {
  const navigate = useNavigate();
  const { administrator,authorized, listaUsuarios, nonAuthorized } = useAppContext()
  const { isSignedIn } = useAuth()
  const { isLoaded } = useAuth()

   
  useEffect(()=>{
      if (isSignedIn && authorized && administrator) {
          navigate("/dashboard")
      }else if(isSignedIn && authorized && !administrator){
          navigate("/dashboard")
      }
      console.log(isSignedIn)
  },[isSignedIn, administrator, authorized, navigate])
  return (
    <div className='container-wrapper'>
        <div className="login__wrapper">
            <div className="login__form">
                <h1 className='title'>Bienvenido a Gestión Corriente</h1>
                {nonAuthorized ? <p>Redirigiendote en 3...</p> : !isLoaded ? "Aguarde..." : <SignInButton className="login__button" />}
            </div>
        </div>
    </div>
  )
}

export default Login