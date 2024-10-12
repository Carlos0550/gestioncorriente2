import { Button, Card, Col, Collapse, notification, Row, Skeleton, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddDebt from './FormProductos/AddDebt';
import { useAppContext } from '../../../context/AppContext';
import dayjs from 'dayjs';

import "./css/clientFile.css"
import { SettingFilled } from '@ant-design/icons';
import AddDelivers from './FormEntregas/AddDelivers';
function ClientFile() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get("clientId");
    const { getClientFile, client, processedDebts, capitaliceStrings } = useAppContext()

    const alreadyVerified = useRef(false)
    const [findingFile, setFindingFile] = useState(true)
    const navigate = useNavigate();
    useEffect(() => {
        if (!clientId && !alreadyVerified.current) {
            alreadyVerified.current = true
            notification.error({
                message: "Error al obtener el cliente",
                duration: 3,
                showProgress: true
            })
            setTimeout(() => {
                navigate("/cuentas-corrientes")
            }, 1000);
        }
    }, [clientId])

    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (clientId && !alreadyFetch.current) {
            (async () => {
                alreadyFetch.current = true
                setFindingFile(true)
                await getClientFile(clientId)
                setTimeout(() => {
                    setFindingFile(false)
                }, 1000);
            })()
        }
    }, [clientId])

    const getTotal = () => {
        let total = 0
        processedDebts.forEach(debt => {
            debt.productos.forEach(prod => {
                total += prod.precio * prod.cantidad
            });
        });

        return parseFloat(total).toLocaleString("es-AR", { style: "currency", currency: "ARS" })
    }
    const tableColumns = [
        {
            key: 1,
            title: "Fecha de compra",
            render: (_, record) => (
                <>
                    {dayjs(record.fechaCompra).format("DD/MM/YYYY")}
                </>
            )
        },
        {
            key: 2,
            title: "Vencimiento",
            render: (_, record) => (
                <>
                    {dayjs(record.fechaVencimiento).format("DD/MM/YYYY")}
                </>
            )
        },
        {
            key: 3,
            title: "Estado del pago",
            render: (_, record) => (
                <>
                    <p style={{ color: record.estado === "Pendiente" ? "red" : "green" }}>{record.estado}</p>
                </>
            )
        },
        {
            key: 3,
            title: "Detalles",
            render: (_, record) => (
                <>
                    <ul>
                        {record.productos.map((prod) => (
                            <li>{prod.cantidad} {prod.nombre} ${prod.precio}</li>
                        ))}
                    </ul>
                </>
            )
        },
        {
            key: 4,
            title: (
                <>Saldo total: <span style={{ color: "green" }}>{getTotal()}</span></>
            )
        }
    ]
    return (
        <>
            <div className="file__wrapper">
                <h1 className='file__client-name'>{capitaliceStrings(client?.nombre_cliente) ?? ""} <Button icon={<SettingFilled />}></Button></h1>

                <Row gutter={[16, 16]} style={{
                    margin: ".5rem"
                }}>
                    <Col xs={24} md={14} lg={12}>


                        <Card title={`Fichero de: ${capitaliceStrings(client?.nombre_cliente)?.split(" ")[0] ?? ""}`} style={{ minWidth: "100%" }} hoverable bordered={false}>
                            {findingFile ? <Skeleton active /> : (
                                <>
                                    <Collapse
                                        items={[
                                            {
                                                key: 1,
                                                label: "Agregar productos",
                                                children: <AddDebt clientId={clientId} />
                                            }
                                        ]}
                                    />
                                    <Table
                                        columns={tableColumns}
                                        dataSource={processedDebts}
                                        pagination={false}
                                        scroll={{ x: 500 }}
                                        rowKey={record => record.id}
                                    />
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={10} lg={12}>
                        <Card title="Entregas de dinero" style={{ minWidth: "100%" }} hoverable bordered={false}>
                            {findingFile ? <Skeleton active /> : (
                                <>
                                    <Collapse
                                        items={[
                                            {
                                                key: 1,
                                                label: "Agregar entregas",
                                                children: <AddDelivers clientId={clientId} />
                                            }
                                        ]}
                                    />
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ClientFile