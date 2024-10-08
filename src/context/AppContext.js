import { createContext, useContext, useEffect } from "react";
import App from "../App";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const useAppContext = () =>{
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return ctx
};

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth()
    useEffect(()=>{
        if (isSignedIn) {
            navigate("/dashboard")
        }
        console.log(isSignedIn)
    },[isSignedIn, navigate])
    return (
        <AppContext.Provider value={{

        }}
        >
            {children}
        </AppContext.Provider>
    )
}