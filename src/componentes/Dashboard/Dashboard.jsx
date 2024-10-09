import React, { useState } from 'react'
import { Row,Col, Table, Card, Popconfirm } from "antd"
import "./dashboard.css"
import Navbar from '../Navbar/Navbar'
import { totalAccountsToPay } from '../Estructuras de ejemplo/TotalCuentasCobrar'
import { pagosRecientesEstructura } from '../Estructuras de ejemplo/PagosRecientes'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Button, Space, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function Dashboard() {

    const navigate = useNavigate()
    const { listaUsuarios, deleteUser } = useAppContext()
    
    const orderedUsers = listaUsuarios
    .sort((a,b)=> a.id - b.id)
    const [deletingUser, setDeletingUser] = useState(false)
    const handleDeleteUser = async(id) => {
        setDeletingUser(true)
        await deleteUser(id)
        setDeletingUser(false)
    }
 
    const usersStructureTable = [
        
        {
            key: 1,
            title: "Usuario",
            render: (_,record) => (
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
        },{
            key: 4,
            title: "Acciones",
            render: (_, record) => (
                <>
                    <Space direction='vertical'>
                        <Space >
                            {record.administrador ? "Quitar Administrador" : "Hacer administrador"} <Switch checked={record.administrador}/>
                        </Space>
                        <Space>
                            {record.autorizado ? "Quitar Acceso" : "Conceder Acceso"} <Switch checked={record.autorizado}/>
                        </Space>
                        <Popconfirm
                        title="¿Estás seguro de eliminar este usuario?"
                        description="Si es administrador, perderá el acceso al sistema. asegurese de tener otro usuario como administrador."
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Si, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ loading: deletingUser }}
                        >
                            <Button type="primary" danger>Eliminar Usuario <DeleteOutlined/></Button>
                        </Popconfirm>
                    </Space>
                </>
            )
        }
    ]
    
  return (
    <>
        <Navbar/>        
        <div className='container-wrapper'>
            <h1 className='title'>Panel de Administración</h1>
            <div className="dashboard__wrapper">
            <Row gutter={[16, 16]}>
                <Col sx={24} sm={24} md={12} lg={14}>
                    <Card title="Usuarios con acceso">
                        <Table columns={usersStructureTable} dataSource={orderedUsers} style={{minWidth: "100%"}} pagination={{pageSize: 5}} scroll={{x: 800}}/>
                    </Card>
                </Col>
                <Col sx={24} md={12} lg={10}>
                    <Card title="Pagos recientes">
                        <Table columns={pagosRecientesEstructura}  style={{minWidth: "100%"}} pagination={{pageSize: 5}}/>
                    </Card>
                </Col>
                <Col sx={24} sm={24} md={12} lg={14}>
                    <Card title="Vencimientos del mes">
                        <Table columns={totalAccountsToPay}  style={{minWidth: "100%"}} pagination={{pageSize: 4}}/>
                    </Card>
                </Col>
                
            </Row>
            </div>
        </div>
    </>
  )
}

export default Dashboard