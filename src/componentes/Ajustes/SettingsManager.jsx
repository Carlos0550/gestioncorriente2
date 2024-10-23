import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Card, Form, Table, Input, Row, Col, Collapse, Button, message, notification, Space } from 'antd'
import { useAppContext } from '../../context/AppContext';
import AddBranches from './Añadir Sucursales/AddBranches';
import { baseUrl } from '../../config';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

function SettingsManager() {
    const [activeKey, setActiveKey] = useState(null);
    const [sucursales, setSucursales] = useState([])

    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (!alreadyFetch.current) {
            (async () => {
                alreadyFetch.current = true

                try {
                    const response = await fetch(`${baseUrl.api}/get-branches`)
                    const data = await response.json()
                    console.log(data)
                    if(response.status !== 200) throw new Error("Error al obtener las sucursales")
                    setSucursales(data.sucursales)
                } catch (error) {
                    console.log(error)
                    notification.error({
                        message: error.message,
                        duration: 3,
                        showProgress: true
                    })
                }
            })()
        }
    }, [])

    const [selectedBranch, setSelectedBranch] = useState({})
    const [isEditingBranch, setIsEditingBranch] = useState(false)
    const handleEditBranch = (branchId) => {
        setSelectedBranch(sucursales.find(sucursal => sucursal.id === branchId))
        setIsEditingBranch(true)
    }

    const handleCancelEditBranch = () =>{
        setIsEditingBranch(false)
        setSelectedBranch({})
    }

    const settingTable = [
        {
            key: "1",
            title: "Puntos de venta",
            render: (_, record) => (
                <>{record.business_name}</>
            )
        },
        {
            key: "2",
            render: (_, record) => (
                <>
                    <Space direction='vertical'>
                        <Button icon={<EditOutlined/>} type='primary' onClick={()=> handleEditBranch(record.id)}></Button>
                        <Button icon={<DeleteOutlined/>} type='primary' danger></Button>
                    </Space>
                </>
            )
        }
    ];

    return (
        <>
            <Navbar />
            <div className='container-wrapper'>
                <h1 className='title'>Ajustes</h1>
                <Card title="Configuración de la página">
                    <Collapse
                        activeKey={activeKey}
                        onChange={(key) => setActiveKey(key.length > 0 ? key : null)}
                    >
                        <Panel header="Sucursales" key="1" >
                            <Row gutter={[16, 16]} >
                                <Col xs={24} sm={24} md={12} lg={12} style={{ padding: 0 }}>
                                    <Table
                                        columns={settingTable}
                                        dataSource={sucursales}
                                        pagination={{pageSize: 5}}
                                        scroll={{ x: '100%' }}
                                        
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} style={{ padding: 0 }}>
                                    <h3>Agregar sucursal</h3> {isEditingBranch ? <Button onClick={()=> handleCancelEditBranch()} type='primary' danger>Cancelar</Button> : null}
                                    <AddBranches cancelEdit={()=> handleCancelEditBranch()} selectedBranch={selectedBranch} isEditing={isEditingBranch}/>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Card>
            </div>
        </>
    )
}

export default SettingsManager;
