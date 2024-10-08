import React from 'react'
import { Row,Col, Table, Card } from "antd"
import "./dashboard.css"
import Navbar from './Navbar/Navbar'
import { structureTable } from '../Estructuras de ejemplo/UsuariosConAcceso'
import { totalAccountsToPay } from '../Estructuras de ejemplo/TotalCuentasCobrar'
import { pagosRecientesEstructura } from '../Estructuras de ejemplo/PagosRecientes'
function Dashboard() {
    const dataAccesUsers = [
        {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }
    ]

    const dataUsersToPay = [
        {
            key: 1,
            nombre: 'John Brown',
            adeuda: "15000", 
        },
        {
            key: 1,
            nombre: 'John Brown',
            adeuda: "15000", 
        },{
            key: 1,
            nombre: 'John Brown',
            adeuda: "15000", 
        },{
            key: 1,
            nombre: 'John Brown',
            adeuda: "15000", 
        },{
            key: 1,
            nombre: 'John Brown',
            adeuda: "15000", 
        }
    ]

    const recentlyPays = [
        {
            key: 1,
            nombre: 'John Brown',
            monto: "15000", 
            fecha: "2022-01-01",
        },
        {
            key: 1,
            nombre: 'John Brown',
            monto: "15000", 
            fecha: "2022-01-01",
        },
        {
            key: 1,
            nombre: 'John Brown',
            monto: "15000", 
            fecha: "2022-01-01",
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
                        <Table columns={structureTable} dataSource={dataAccesUsers} style={{minWidth: "100%"}} pagination={{pageSize: 5}}/>
                    </Card>
                </Col>
                <Col sx={24} md={12} lg={10}>
                    <Card title="Pagos recientes">
                        <Table columns={pagosRecientesEstructura} dataSource={recentlyPays} style={{minWidth: "100%"}} pagination={{pageSize: 5}}/>
                    </Card>
                </Col>
                <Col sx={24} sm={24} md={12} lg={14}>
                    <Card title="Vencimientos del mes">
                        <Table columns={totalAccountsToPay} dataSource={dataUsersToPay} style={{minWidth: "100%"}} pagination={{pageSize: 4}}/>
                    </Card>
                </Col>
                
            </Row>
            </div>
        </div>
    </>
  )
}

export default Dashboard