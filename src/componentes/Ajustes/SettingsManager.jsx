import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Card, Form, Table, Input, Row, Col, Collapse, Button, message, notification, Space, Popconfirm } from 'antd'
import { useAppContext } from '../../context/AppContext';
import AddBranches from './Añadir Sucursales/AddBranches';
import { baseUrl } from '../../config';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

function SettingsManager() {
    const [activeKey, setActiveKey] = useState(null);
    const { getBranches, sucursales, deleteBranch } = useAppContext()

    const alreadyFetch = useRef(false)
    useEffect(() => {
        if (!alreadyFetch.current) {
            (async () => {
                alreadyFetch.current = true
                getBranches()
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

    const [deleting, setDeleting] = useState(false)
    const handleDeleteBranch = async(branchID) => {
        const branchName = sucursales.find(sucursal => sucursal.id === branchID).business_name;
        setDeleting(true)
        await deleteBranch(branchID, branchName);
        setDeleting(false)
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
                        <Popconfirm
                        title="¿Seguro que desea eliminar esta sucursal?"
                        okText="Si, eliminar"
                        cancelText= "No"
                        onConfirm={()=> handleDeleteBranch(record.id)}
                        okButtonProps={[
                            {loading: deleting}
                        ]}
                        >
                            <Button icon={<DeleteOutlined/>} type='primary' danger></Button>
                        </Popconfirm>
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
                                        pagination={{pageSize: 3}}
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
