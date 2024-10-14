import { Button, Card, Col, Collapse, notification, Popconfirm, Row, Skeleton, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddDebt from './FormProductos/AddDebt';
import { useAppContext } from '../../../context/AppContext';
import dayjs from 'dayjs';

import "./css/clientFile.css"
import { DeleteOutlined, EditOutlined, RetweetOutlined, SettingFilled } from '@ant-design/icons';
import AddDelivers from './FormEntregas/AddDelivers';
import EditDeliverModal from './EditarEntregas/EditDeliverModal';
import EditDebtsModal from './EditarDeudas/EditDebtsModal';
function ClientFile() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get("clientId");
    const { getClientFile, client, processedDebts, processDelivers, capitaliceStrings, deleteDeliver, deleteDebt, cancelDebts } = useAppContext()
    const processedDelivers = processDelivers()
    const alreadyVerified = useRef(false)
    const [showEditDeliverModal, setShowEditDeliverModal] = useState(false)
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

    const orderedDebts = processedDebts.sort((a, b) => a.id - b.id)

    const getDeliversSum = () => 
        processedDelivers.reduce((acc, { monto }) => acc + parseFloat(monto) || 0,
    0);

    const getTotalDebts = () => {
        let total = 0
        processedDebts.forEach(debt => {
            debt.productos.forEach(prod => {
                total += parseFloat(prod.precio) * parseInt(prod.cantidad)
            });
        });

        return total
    }
    
    const totalDelivers = getDeliversSum();
    const totalDebts = getTotalDebts()
    const difference = totalDebts - totalDelivers

    const [deletingDebt, setDeletingDebt] = useState(false)
    const handleDeleteDebt = async(debtId) =>{
        setDeletingDebt(true)
        deleteDebt(debtId, clientId)
        setDeletingDebt(false)
    }

    const [selectedDebt, setSelectedDebt] = useState(null)
    const [showEditDebtModal, setShowEditDebtModal] = useState(false)
    const handleEditDebt = (debtId) => {
        setSelectedDebt(processedDebts.find(debt => debt.id === debtId))
        setShowEditDebtModal(true)
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
            key: 4,
            title: "Detalles",
            minWidth: 250,
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
                <>Saldo total: <span style={{ color: "green" }}>{parseFloat(difference).toLocaleString("es-AR",{style:"currency", currency: "ARS"})}</span></>
            )
        },
        {
            key: 5,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined/>} type='primary' onClick={() => handleEditDebt(record.id)}/>
                    <Popconfirm
                        title="¿Deseas eliminar esta deuda?"
                        description= "Es posible que el saldo quede en negativo!"
                        onConfirm={() => handleDeleteDebt(record.debtUuid)}
                        okText="Si, eliminar"
                        cancelText="No, no eliminar"
                        okButtonProps={{ loading: deletingDebt }}
                    >
                        <Button type='primary' danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            )
        }
        
    ]
    
    const [selectedDeliver, setSelectedDeliver] = useState(null)
    const handleEditDeliver = (deliverId) =>{
        setSelectedDeliver(processedDelivers.find(deliv => deliv.id === deliverId));
        setShowEditDeliverModal(true)
    }

    const [deletingDeliver, setDeletingDeliver] = useState(false)
    const handleDeleteDeliver = async(deliverId) => {
        setDeletingDeliver(true)
        await deleteDeliver(deliverId, clientId)
        setDeletingDeliver(false)
    }

    const deliverColumns = [
        {
            key:"1",
            title: "Fecha de entrega",
            render: (_, record) => (
                <>
                    <p>{dayjs(record.fecha).format("DD/MM/YYYY")}</p>   
                </>
            )
        },
        {
            key:"2",
            title: "Monto entregado",
            render: (_, record) => (
                <>
                    <p>{parseFloat(record.monto).toLocaleString("es-AR",{style:"currency", currency: "ARS"})}</p>   
                </>
            )
        },
        {
            key: "3",
            render: (_, record) =>(
                <>
                    <Space direction='vertical'>
                        <Button icon={<EditOutlined/>} type='primary' onClick={()=> handleEditDeliver(record.id)}/>
                        <Popconfirm 
                        title="¿Seguro que desea eliminar la entrega?"
                        description="Es posible que el saldo quede en negativo"
                        okText="Eliminar entrega!"
                        cancelText="Cancelar"
                        okButtonProps={[
                            {loading: deletingDeliver}
                        ]}
                        onConfirm={()=> handleDeleteDeliver(record.id)}
                        >
                            <Button icon={<DeleteOutlined/>} type='primary' danger/>
                        </Popconfirm>
                    </Space>
                </>
            ) 
        }
    ]
    return (
        <>
            <div className="file__wrapper">
                <h1 className='file__client-name'>{capitaliceStrings(client?.nombre_cliente) ?? ""} <Button icon={<SettingFilled />}/> <Button icon={<RetweetOutlined />} onClick={()=> getClientFile(clientId)}>Refrescar</Button></h1>
                <Popconfirm
                title="¿Está seguro de cancelar la deuda de este cliente?"
                description="Las deudas y entregas serán movidas al historial del cliente."
                okText="Si, cancelar deuda"
                cancelText="No, no cancelar"
                onConfirm={()=> cancelDebts(clientId)}
                >
                    <Button type='primary' danger>Cancelar deuda</Button>
                </Popconfirm>
                <Row gutter={[16, 16]} style={{
                    margin: ".5rem"
                }}>
                    <Col xs={24} md={14} lg={14}>


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
                                        className='custom__table-file'
                                        dataSource={orderedDebts}
                                        pagination={{pageSize: 5}}
                                        
                                        rowKey={record => record.id}
                                    />
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} md={10} lg={10}>
                        <Card title="Entregas de dinero" style={{ minWidth: "100%" }} hoverable bordered={false}>
                            {findingFile ? <Skeleton active /> : (
                                <>
                                    <Collapse
                                        items={[
                                            {
                                                key: 1,
                                                label: "Agregar entregas",
                                                children: <AddDelivers clientId={clientId} totalDebts = {difference}/>
                                            }
                                        ]}
                                    />
                                    <Table
                                        columns={deliverColumns}
                                        dataSource={processedDelivers}
                                        className='custom__table-file'
                                        pagination={{pageSize: 5}}
                                        
                                        rowHoverable={true}
                                        rowKey={record => record.id}
                                    />
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
            {showEditDeliverModal && <EditDeliverModal closeModal={()=> setShowEditDeliverModal(false)} clientId={clientId} selectedDeliver={selectedDeliver} />}
            {showEditDebtModal && <EditDebtsModal closeModal={()=> setShowEditDebtModal(false)} selectedDebt={selectedDebt}/>}
        </>
    )
}

export default ClientFile