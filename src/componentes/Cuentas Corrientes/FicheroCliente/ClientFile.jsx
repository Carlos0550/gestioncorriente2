import { Card, Col, Collapse, message, notification, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { baseUrl } from '../../../config';
import AddDebt from './AddDebt';

function ClientFile() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get("clientId");

    const [client, setClient] = useState([]);
    const [errorFetching, setErrorFetching] = useState(false)
    const navigate = useNavigate();
    if (!clientId) {
        notification.error({
            message: "Error al obtener el cliente",
            duration: 3,
            showProgress: true
        })
        setTimeout(() => {
            navigate("/cuentas-corrientes")
        }, 1000 * 3);
    }


    const alreadyFetch = useRef(false)
    useEffect(()=>{
        if (clientId && !alreadyFetch.current) {
            (async()=>{
                alreadyFetch.current = true

                const hiddenMessage = message.loading("Un momento...",0)
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
                }finally{
                    hiddenMessage()
                }
            })()
        }
    },[clientId])
    // useEffect(()=>{
    //     console.log(client)
    // },[client])

    return (
        <>
            <Row gutter={[16, 16]} style={{
                margin: ".5rem"
            }}>
                <Col xs={24} md={14} lg={12}>
                    <Card title="Fichero del cliente" style={{ minWidth: "100%" }}>
                        <Collapse
                        items={[
                            {
                                key: 1,
                                label: "Agregar productos",
                                children: <AddDebt clientId={clientId}/>
                            }
                        ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={10} lg={12}>
                    <Card title="Entregas de dinero" style={{ minWidth: "100%" }}>

                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ClientFile