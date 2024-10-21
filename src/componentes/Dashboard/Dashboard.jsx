import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Table, Card, Popconfirm } from "antd"
import "./dashboard.css"
import Navbar from '../Navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Button, Space, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { baseUrl } from '../../config'
import dayjs from "dayjs"
function Dashboard() {

    const navigate = useNavigate()
    const { listaUsuarios, deleteUser, grantOrDenyAccess, currentUser, clients, capitaliceStrings } = useAppContext()
    const orderedUsers = listaUsuarios
        .sort((a, b) => a.id - b.id)
    const [deletingUser, setDeletingUser] = useState(false)
    const handleDeleteUser = async (id) => {
        setDeletingUser(true)
        await deleteUser(id)
        setDeletingUser(false)
    }

    useEffect(() => {
        if (currentUser && !currentUser.administrador) {
            navigate("/clientes")
        }
    }, [navigate])

    const [expirations, setExpirations] = useState([])
    const [recentlyPays, setRecentlyPays] = useState([])

    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (!alreadyFetch.current) {
            (async () => {
                alreadyFetch.current = true
                try {
                    const response = await fetch(`${baseUrl.api}/get-dashboard-data`)
                    const data = await response.json()
                    if (response.status === 200) {
                        setExpirations(data.vencimientos)
                        setRecentlyPays(data.pagos)
                    }
                } catch (error) {
                    console.log(error)
                }
            })()
        }
    }, [])

    const alreadyProcessed = useRef(false)
    useEffect(() => {
        if (!alreadyProcessed.current) {
            if (expirations && expirations.length > 0) {
                alreadyProcessed.current = true
                const updatedExpirations = [...expirations];

                for (let i = 0; i < updatedExpirations.length; i++) {
                    const expi = updatedExpirations[i];
                    const client = clients.find(client => client.id === expi.cliente_id);
                    
                    if (client) {
                        updatedExpirations[i] = {
                            clientName: capitaliceStrings(client.nombre_completo),
                            vencimiento: expi.fecha_vencimiento
                        };
                    } else {
                        updatedExpirations[i] = {
                            clientName: "Cliente no existente",
                            vencimiento: expi.fecha_vencimiento
                        };
                    }
                }
                const updatedPays = [...recentlyPays]

                if (recentlyPays && recentlyPays.length > 0) {
                    for (let i = 0; i < updatedPays.length; i++) {
                        const pays = updatedPays[i];
                        console.log(pays)
                        const client = clients.find(client => client.id === pays.id_entrega_cliente)

                        if (client) {
                            updatedPays[i] = {
                                clientName: capitaliceStrings(client.nombre_completo),
                                deliverAmount: parseFloat(pays.detalle_entrega[0].deliverAmount)
                            }
                        }else{
                            updatedPays[i] = {
                                clientName: "Cliente no encontrado",
                                deliverAmount: parseFloat(pays.detalle_entrega[0].deliverAmount)
                            }
                        }

                        
                    }
                }
                setRecentlyPays(updatedPays)
                setExpirations(updatedExpirations);
            }
        }
    }, [expirations, recentlyPays]);

    const usersStructureTable = [

        {
            key: 1,
            title: "Usuario",
            render: (_, record) => (
                <p>{record.username}</p>
            )
        },
        {
            key: 2,
            title: "Permisos",
            render: (_, record) => (
                <>
                    {record.administrador ? <Space>
                        <ul>
                            <li>Agregar, editar, eliminar y contactar clientes</li>
                            <li>Ver reportes</li>
                            <li>Administrar usuarios</li>
                            <li>Administrar Ajustes</li>
                            <li>Administrar Cuentas Corrientes. </li>
                            <li>Administrar Pagos.</li>
                            <li>Ver deudas.</li>
                        </ul>
                    </Space> : null}
                    {record.administrador === false && record.autorizado ? <Space>
                        <ul>
                            <li>Listar, agregar, editar clientes</li>
                            <li>Añadir Deudas</li>
                            <li>Gestionar pagos</li>
                            <li>Revisar Historial</li>
                        </ul>
                    </Space> : null}
                    {record.administrador === false && record.autorizado === false ? <strong>Usuario no autorizado</strong> : null}
                </>
            )
        },
        {
            key: 3,
            title: "Avatar",
            render: (_, record) => (
                <picture className="user__image-container"><img src={record.userimage} alt="" /></picture>
            )
        }, {
            key: 4,
            title: "Acciones",
            render: (_, record) => (
                <>
                    {record.administrador === true ? null : (
                        <Space direction='vertical'>
                            <Space>
                                {record.autorizado ? "Quitar Acceso" : "Conceder Acceso"} <Switch checked={record.autorizado} onChange={() => grantOrDenyAccess(record.id)} />
                            </Space>
                            <Popconfirm
                                title="¿Estás seguro de eliminar este usuario?"
                                description="Si es administrador, perderá el acceso al sistema. asegurese de tener otro usuario como administrador."
                                onConfirm={() => handleDeleteUser(record.id)}
                                okText="Si, eliminar"
                                cancelText="Cancelar"
                                okButtonProps={{ loading: deletingUser }}
                            >
                                <Button type="primary" danger>Eliminar Usuario <DeleteOutlined /></Button>
                            </Popconfirm>
                        </Space>
                    )}
                </>
            )
        }
    ]

    const recentlyPaysTable = [
        {
            key: "1",
            title: "Cliente",
            render: (_,record) => (
                <>
                    <strong>{record.clientName}</strong>
                </>
            )
        },
        {
            key: "2",
            title: "Monto",
            render: (_,record) => (
                <>
                    {record.deliverAmount?.toLocaleString("es-AR",{style: "currency", currency: "ARS"})}
                </>
            )
        }

    ];

    const expirationsTable = [
        {
            key: "1",
            title: "Cliente",
            render:(_,record) => (
                <>
                    <strong>{record.clientName}</strong>
                </>
            )
        },{
            key: "2",
            title: "Vencimiento",
            render: (_,record) => (
                <>
                    {dayjs(record?.vencimiento).format("DD/MM/YYYY")}
                </>
            )
        }
    ]

    return (
        <>
            <Navbar />
            <div className='container-wrapper'>
                <h1 className='title'>Panel de Administración</h1>
                <div className="dashboard__wrapper">
                    <Row gutter={[16, 16]}>
                        <Col sx={24} sm={24} md={24} lg={24}>
                            <Card title="Usuarios con acceso">
                                <Table columns={usersStructureTable} dataSource={orderedUsers} style={{ minWidth: "100%" }} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
                            </Card>
                        </Col>
                        <Col sx={24} sm={24} md={12} lg={12}>
                            <Card title="Pagos recientes (de este mes)">
                                <Table columns={recentlyPaysTable} scroll={{ x: 800 }} style={{ minWidth: "100%" }} pagination={{ pageSize: 5 }} dataSource={recentlyPays} />
                            </Card>
                        </Col>
                        <Col sx={24} sm={24} md={12} lg={12}>
                            <Card title="Próximos vencimientos (de este mes)">
                                <Table columns={expirationsTable} scroll={{ x: 800 }} style={{ minWidth: "100%" }} pagination={{ pageSize: 4 }} dataSource={expirations}/>
                            </Card>
                        </Col>

                    </Row>
                </div>
            </div>
        </>
    )
}

export default Dashboard