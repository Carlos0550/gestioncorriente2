import { createContext, useContext, useEffect, useState } from "react";
import App from "../App";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { message, notification } from "antd";
import { baseUrl } from "../config";
const AppContext = createContext();

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return ctx
};

export const AppContextProvider = ({ children }) => {
    const { signOut, isLoaded } = useAuth()
    const { user } = useUser()
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const [administrator, setAdministrator] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [nonAuthorized, setNonAuthorized] = useState(false);
    const [currentUser, setCurrentUser] = useState([])
    const verifyUser = async () => {
        const formData = new FormData();
        const data = {
            userName: user.fullName || "",
            userEmail: user.emailAddresses[0]?.emailAddress || "",
            userId: user.id || "",
            userImage: user.imageUrl || ""
        };
        
        for (const key in data) {
            formData.append(key, data[key]);
        }
               
        try {
            const response = await fetch(`http://localhost:4000/save-new-user`, {
                method: "POST",
                body: formData
            });

            if (!response.status === 200) {
                const errorMessage = await response.text(); 
                throw new Error(`Error en la verificación del usuario: ${errorMessage}`);
            }

            const data = await response.json();
            if (data.administrador === true && data.autorizado === true) {
                setAdministrator(true)
                setAuthorized(true)  
                setCurrentUser(data)              
                api.success({
                    message: "Acceso autorizado",
                    description: "Se ha verificado el usuario correctamente",
                    placement: "topRight",
                    duration: 3
                })
            }else if(data.autorizado === true && data.administrador === false){
                setAuthorized(true)
                setCurrentUser(data)              
                notification.success({
                    message: "Acceso autorizado",
                    description: "Se ha verificado el usuario correctamente",
                    placement: "topRight",
                    duration: 3
                })
            }else{
                setNonAuthorized(true)
                notification.error({
                    message: "Acceso no autorizado",
                    description: "Contacte con su administrador para obtener acceso",
                    placement: "topRight",
                    duration: 3
                })
                setAuthorized(false)
                setAdministrator(false)
                setTimeout(() => {
                    signOut()
                }, 3000);
                
            }
        } catch (error) {
            message.error(`Error al verificar el usuario: ${error.message}`, 3);
        }
    }

    const getAllAllowUsers = async() => {
        const hiddenMessage = message.loading("Obteniendo roles",0)
        try {
            const response = await fetch(`${baseUrl.api}/get-all-users`)
            if (response.status === 200) {
                const data = await response.json();
                setListaUsuarios(data.usuarios)
                
            }else{
                message.error("Error al obtener los roles")
            }
        } catch (error) {
            console.log(error)
            message.error("Error al obtener los roles")
        }finally{
            hiddenMessage()
        }
    }
    
    const deleteUser = async(id) => {
        const hiddenMessage = message.loading("Eliminando usuario",0)
        try {
            const response = await fetch(`${baseUrl.api}/delete-user/${id}`,{
                method: "DELETE"
            })
            if (response.status === 200) {
                const cloneUsers = [...listaUsuarios]
                const newUsers = cloneUsers.filter(user => user.id !== id)
                setListaUsuarios(newUsers)
                message.success("Se elimino el usuario")
            }
        } catch (error) {
            console.log(error)
            message.error("Error al eliminar el usuario")
        }finally{
            hiddenMessage()
        }
    }

    useEffect(() => {
        if (user) {
            (async()=>{
                const hiddenMessage = message.loading("Verificando usuario...", 0);
                await verifyUser();
                hiddenMessage()
            })()
        }
    }, [user]);

    useEffect(()=>{
        if (administrator) {
            getAllAllowUsers()
        }
    },[administrator])

    useEffect(()=>{
        if (listaUsuarios && listaUsuarios.length > 0) {
            setCurrentUser(listaUsuarios.find((us) => 
                us.userid === user.id
            ))
        }
    },[listaUsuarios])
    return (
        <AppContext.Provider value={{
            administrator,authorized, listaUsuarios, nonAuthorized,
            deleteUser,currentUser
        }}
        >
            {contextHolder}
            {children}
        </AppContext.Provider>
    )
}