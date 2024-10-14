import { createContext, useContext, useEffect, useState } from "react";
import App from "../App";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { message, notification } from "antd";
import { baseUrl } from "../config";
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs";
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
    const [clients, setClients] = useState([])
    const [searchText, setSearchText] = useState("")

    const orderedClients = clients
        .sort((a, b) => a.id - b.id)
        .filter((client) => {
            const searchClient = client?.nombre_completo.toLowerCase().includes(searchText.toLowerCase())
            const searchDni = client?.dni?.toString().includes(searchText.toLowerCase())
            return searchClient || searchDni
        })

    const capitaliceStrings = (text) => {
        if (!text) return text;
        const words = text.split(" ")
        const capitalicedWords = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })

        return capitalicedWords.join(" ")
    }
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
                setCurrentUser(data.currentUser)
                await getAllClients()
                api.success({
                    message: "Acceso autorizado",
                    description: "Se ha verificado el usuario correctamente",
                    placement: "topRight",
                    duration: 3
                })
            } else if (data.autorizado === true && data.administrador === false) {
                setAuthorized(true)
                setCurrentUser(data.currentUser)
                await getAllClients()
                notification.success({
                    message: "Acceso autorizado",
                    description: "Se ha verificado el usuario correctamente",
                    placement: "topRight",
                    duration: 3
                })
            } else {
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

    const getAllAllowUsers = async () => {
        const hiddenMessage = message.loading("Obteniendo roles", 0)
        try {
            const response = await fetch(`${baseUrl.api}/get-all-users`)
            if (response.status === 200) {
                const data = await response.json();
                setListaUsuarios(data.usuarios)

            } else {
                message.error("Error al obtener los roles")
            }
        } catch (error) {
            console.log(error)
            message.error("Error al obtener los roles")
        } finally {
            hiddenMessage()
        }
    }

    const deleteUser = async (id) => {
        const hiddenMessage = message.loading("Eliminando usuario", 0)
        try {
            const response = await fetch(`${baseUrl.api}/delete-user/${id}`, {
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
        } finally {
            hiddenMessage()
        }
    }

    const grantOrDenyAccess = async (id) => {
        const hiddenMessage = message.loading("Guardando...", 0)
        if (!id) {
            message.error("No se encontro el usuario")
            return;
        }
        try {
            const response = await fetch(`${baseUrl.api}/grant-access/${id}`, {
                method: "PUT"
            });

            if (response.status === 200) {
                const cloneUsers = [...listaUsuarios]
                const newUsers = cloneUsers.map(user => {
                    if (user.id === id) {
                        return {
                            ...user,
                            autorizado: !user.autorizado
                        }
                    }
                    return user
                })
                setListaUsuarios(newUsers)
                message.success(`Acceso actualizado`)
            } else {
                message.error("Error al actualizar el acceso")
            }
        } catch (error) {
            console.log(error)
            message.error("Error de conexion o de servidor al actualizar el acceso")
        } finally {
            hiddenMessage()
        }
    };

    const saveClient = async (data) => {
        const hiddenMessage = message.loading("Guardando...", 0);
        const formData = new FormData();
        try {
            if (!data.userDni || !data.userName) {
                throw new Error("No es posible crear el cliente, faltan datos!")
            }

            for (const key in data) {
                formData.append(key, data[key] ?? "");
            }
            const response = await fetch(`${baseUrl.api}/save-client`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Error al crear el cliente");
            }

            const responseData = await response.json();
            await getAllClients()
            notification.success({
                message: "Se guardó el nuevo cliente",
                description: responseData.message,
                placement: "topRight",
                duration: 5
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al crear el cliente",
                description: "Error de conexión o de servidor, verifique su conexión e intente nuevamente",
                placement: "topRight",
                duration: 5
            })
        } finally {
            hiddenMessage();
        }
    };

    const getAllClients = async () => {
        const hiddenMessage = message.loading("Cargando...", 0);
        try {
            const response = await fetch(`${baseUrl.api}/get-all-clients`);
            if (!response.ok) {
                throw new Error();
            }

            const responseData = await response.json();
            setClients(responseData.clientes)
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al obtener los nuevos clientes",
                description: "Error de conexión o de servidor, verifique su conexión e intente nuevamente",
                placement: "topRight",
                duration: 5
            })
        } finally {
            hiddenMessage()
        }
    }

    const editClient = async (clientValues, clientId) => {
        const hiddenMessage = message.loading("Actualizando cliente...", 0)
        const formData = new FormData();
        if (!clientId) {
            notification.error({
                message: "Error al actualizar el cliente",
                description: "Faltan datos obligatorios!",
                placement: "topRight",
                duration: 5
            })
            return;
        }
        for (const key of Object.keys(clientValues)) {
            formData.append(key, clientValues[key] ?? "")
        }

        try {
            const response = await fetch(`${baseUrl.api}/edit-client/${clientId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data)
                throw new Error(`${data.message}`);
            } else {
                await getAllClients()
                notification.success({
                    message: "Se actualizo el cliente",
                    description: "Se actualizo correctamente el cliente!",
                    placement: "topRight",
                    duration: 5
                })
            }
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al actualizar el cliente",
                description: error.message,
                placement: "topRight",
                duration: 5
            })
        } finally {
            hiddenMessage()
        }
    }

    const deleteClient = (clientId) => {
        const hiddenMessage = message.loading("Eliminando cliente...", 0)
        try {
            fetch(`${baseUrl.api}/delete-client/${clientId}`, {
                method: "DELETE"
            })
                .then((response) => response.json())
                .then((data) => {
                    notification.success({
                        message: "Se elimino el cliente",
                        description: data.message,
                        placement: "topRight",
                        duration: 3,
                        showProgress: true
                    })
                    getAllClients()
                })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al eliminar el cliente",
                description: error.message,
                placement: "topRight",
                duration: 5
            })
        } finally {
            hiddenMessage()
        }
    }

    const [client, setClient] = useState([]);
    const [processedDebts, setProcessedDebts] = useState([]);
    const getClientFile = async (clientId) => {
        setProcessedDebts([])
        setClient([])
        const hiddenMessage = message.loading("Un momento...", 0)
        setTimeout(async() => {
            try {
                const response = await fetch(`${baseUrl.api}/get-client-file/${clientId}`);
                if (!response.ok) {
                    throw new Error("Error obteniendo los datos del cliente");
                }
                const data = await response.json()
                setClient(data)
                
            } catch (error) {
                console.log(error)
                notification.error({
                    message: "Error al obtener el cliente",
                    description: error.message,
                    placement: "topRight",
                    duration: 3,
                    showProgress: true
                })
                navigate("/cuentas-corrientes")
            } finally {
                hiddenMessage()
            }
        }, 500);
    }

    const processDebts = (debts) => {
        if (debts && debts.length > 0) {
            const clientFile = debts.map((debt) => {
                const products = debt.detalles.map((prod) => {
                    const productArray = prod.split(" ");
                    const productQuantity = productArray[0]; 
                    const productPrice = parseFloat(productArray[productArray.length - 1]); 
    
                    const productName = productArray.slice(1, productArray.length - 1).join(" ");
    
                    return {
                        cantidad: productQuantity,
                        nombre: productName,
                        precio: productPrice
                    };
                });
    
                return {
                    id: debt.id,
                    debtUuid: debt.deuda_uuid,
                    clienteId: debt.cliente_id,
                    productos: products,
                    fechaCompra: debt.fecha_compra,
                    fechaVencimiento: debt.fecha_vencimiento,
                    estado: debt.estado ? "Al día" : "Pendiente" 
                };
            });
    
            setProcessedDebts(clientFile);
        }
        return [];
    };

    const processDelivers = () => {
        if (client && client?.entregas && client?.entregas?.length > 0) {
            const detallesEntregas = client.entregas.flatMap((deliv) => {
                const entregas = deliv.detalle_entrega;
    
                if (entregas && entregas.length > 0) {
                    return entregas.map((deliver) => ({
                        id: deliv.id,
                        id_cliente: deliv.id_entrega_cliente,
                        monto: deliver.deliverAmount,
                        fecha: deliver.deliverDate
                    }));
                } else {
                    return []; 
                }
            });
    
            return detallesEntregas; 
        } else {
            return [];
        }
    };

   
    

    useEffect(() => {
        if (client) {
            processDebts(client.deudas)
        }
    }, [client])
    const saveClientDebt = async (debts, buyDate, debtId, clientId) => {
        const hiddenMessage = message.loading("Guardando...", 0)
        const formData = new FormData();
        formData.append("productos", JSON.stringify(debts));
        formData.append("buyDate", buyDate);
        formData.append("expDate", dayjs(buyDate).add(1, "month").format("YYYY-MM-DD"));
        formData.append("clientDebtId", debtId)
        // depuracion de valores
        // for (const [key, value] of formData.entries()) {
        //     console.log("key: ", key, "value: ", value);
        // }

        try {
            const response = await fetch(`${baseUrl.api}/save-client-debt/${clientId}`, {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (!response.ok) {

                throw new Error(`${data.message}`);
            }
            await getClientFile(clientId)
            notification.success({
                message: "Deuda guardada exitosamente",
                description: data.message,
                placement: "topRight",
                duration: 7,
                showProgress: true
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al guardar el producto",
                description: error.message,
                placement: "topRight",
                duration: 5,
                showProgress: true
            })
        } finally {
            hiddenMessage()
        }
    }

    const saveClientDeliver = async(deliverData, clientId) => {
        const formData = new FormData()
        const hiddenMessage = message.loading("Guardando entrega...",0)
        formData.append("deliversData", JSON.stringify([deliverData]) ?? "")
        try {
            const response = await fetch(`${baseUrl.api}/save-client-deliver/${clientId}`,{
                method: "POST",
                
                body: formData
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "No fue posible guardar la entrega");
            }
            await getClientFile(clientId)
            notification.success({
                message: "Se guardó la entrega exitosamente",
                duration: 3,
                showProgress: true
            });
        } catch (error) {
            console.log("Error")
            notification.error({
                message: "Error al guardar la entrega",
                description: error.message,
                duration: 5,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    const editDeliver = async(deliverData, clientId, id) => {
        const formData = new FormData()
        const hiddenMessage = message.loading("Guardando entrega...",0)
        formData.append("deliversData", JSON.stringify([deliverData]) ?? "")
        try {
            const response = await fetch(`${baseUrl.api}/update-client-deliver/${id}`,{
                method: "PUT",
                
                body: formData
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "No fue posible guardar la entrega");
            }
            await getClientFile(clientId)
            notification.success({
                message: "Se guardó la entrega exitosamente",
                duration: 3,
                showProgress: true
            });
        } catch (error) {
            console.log("Error")
            notification.error({
                message: "Error al guardar la entrega",
                description: error.message,
                duration: 5,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    const deleteDeliver = async(deliverId, clientId) =>{
        const hiddenMessage = message.loading("Eliminando entrega...",0)
        try {
            const response = await fetch(`${baseUrl.api}/delete-client-deliver/${deliverId}`,{
                method: "DELETE"
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message)
            }
            await getClientFile(clientId)
            notification.success({
                message: "Entrega eliminada!",
                description: data.message,
                duration: 3,
                showProgress: true
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Entrega eliminada!",
                description: error.message,
                duration: 3,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    const editDebt = async(products, buyDate, debtUuid, clientId) => {
        const hiddenMessage = message.loading("Guardando...", 0)
        const formData = new FormData();
        formData.append("productos", JSON.stringify(products));
        formData.append("buyDate", buyDate);
        formData.append("expDate", dayjs(buyDate).add(1, "month").format("YYYY-MM-DD"));
        formData.append("clientDebtId", debtUuid)

        try {
            const response = await fetch(`${baseUrl.api}/update-client-debt/${clientId}`,{
                method: "PUT",
                body: formData
            });

            const data = await response.json()
            if(!response.ok) throw new Error(data.message || "No fue posible guardar el producto");
            await getClientFile(clientId)
            notification.success({
                message: "Deuda actualizada correctamente!",
                description: data.message,
                duration: 3,
                showProgress: true
            });

        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al actualizar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    const deleteDebt = async(debtId, clientId) => {
        const hiddenMessage = message.loading("Eliminando...", 0)
        try {
            const response = await fetch(`${baseUrl.api}/delete-client-debt/${debtId}`,{
                method: "DELETE",
                
            });
            
            const data = response.json()
            if(!response.ok) throw new Error(data.message || "No fue posible eliminar la deuda");
            await getClientFile(clientId)
            notification.success({
                message: "Deuda eliminada!",
                description: data.message,
                duration: 3,
                showProgress: true
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al eliminar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    const cancelDebts = async(clientId) => {
        const hiddenMessage = message.loading("Cancelando...", 0)
        try {
            const response = await fetch(`${baseUrl.api}/cancel-client-debts/${clientId}`,{
                method: "POST",
                
            });
            const data = await response.json()
            console.log(data)
            if(!response.ok) throw new Error(data.message ?? "No fue posible cancelar la deuda");
            await getClientFile(clientId)
            notification.success({
                message: "Deuda cancelada!",
                description: data.message,
                duration: 3,
                showProgress: true
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al cancelar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true
            })
        }finally{
            hiddenMessage()
        }
    }

    useEffect(() => {
        if (user) {
            (async () => {
                const hiddenMessage = message.loading("Verificando usuario...", 0);
                await verifyUser();
                hiddenMessage()
            })()
        }
    }, [user]);

    useEffect(() => {
        if (administrator) {
            getAllAllowUsers()
        }
    }, [administrator])

    useEffect(() => {
        if (listaUsuarios && listaUsuarios.length > 0) {
            setCurrentUser(listaUsuarios.find((us) =>
                us.userid === user.id
            ))
        }
    }, [listaUsuarios])
    return (
        <AppContext.Provider value={{
            administrator, authorized, listaUsuarios, nonAuthorized,
            deleteUser, currentUser, grantOrDenyAccess, saveClient,
            clients, editClient, deleteClient, setSearchText,
            orderedClients, capitaliceStrings, uuidv4, saveClientDebt,
            getClientFile, client, processDebts,processedDebts,
            saveClientDeliver, processDelivers, editDeliver,
            deleteDeliver, editDebt,deleteDebt, cancelDebts
        }}
        >
            {contextHolder}
            {children}
        </AppContext.Provider>
    )
}