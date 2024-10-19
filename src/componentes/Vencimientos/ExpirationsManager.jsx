import { notification, Space, Table, Tag, Typography, Badge, Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../../config'
import Navbar from '../Navbar/Navbar'
import { IdcardOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

function ExpirationsManager() {
    const [expirations, setExpirations] = useState([])
    const alreadyGetted = useRef(false)
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            if (!alreadyGetted.current) {
                alreadyGetted.current = true
                try {
                    setExpirations([])
                    const response = await fetch(`${baseUrl.api}/get-all-expirations`)
                    const data = await response.json()
                    console.log(data)
                    if (!response.ok) throw new Error("Error al obtener los vencimientos")
                    setExpirations(data.vencimientos)
                    notification.success({
                        message: "Vencimientos obtenidos!",
                        description: data.message,
                        duration: 2,
                        showProgress: true
                    })

                } catch (error) {
                    console.log(error)
                    notification.error({
                        message: "Error al obtener los vencimientos",
                        description: error.message,
                        duration: 5,
                        showProgress: true
                    })
                }
            }
        })()
    }, [])

    const tableColumn = [
        {
            title: "Cliente",
            key: "1",
            render: (_, record) => (
                <>
                    <Text strong>{record.cliente}</Text>
                </>
            )
        },
        {
            title: "Deudas vencidas",
            key: "2",
            render: (_, record) => (
                <Space direction="vertical">
                    <Text strong style={{ fontSize: '16px' }}>
                        {record.deudasVencidas} deuda{record.deudasVencidas > 1 ? 's' : ''} vencida{record.deudasVencidas > 1 ? 's' : ''}
                    </Text>
                    <div>
                        {record.fechaVencimiento.map((fecha, index) => (
                            <Tag color="red" key={index}>
                                {fecha}
                            </Tag>
                        ))}
                    </div>
                </Space>
            )
        }, {
            render: (_, record) => (
                <>
                    <Button type='primary' icon={<IdcardOutlined />} onClick={()=> navigate(`/cuentas-corrientes/show-file/?clientId=${record.clientId}`)}>Revisar Fichero</Button>
                </>
            )
        }
    ]

    return (
        <>
            <Navbar />
            <div className="container-wrapper">
                <h1 className='title'>Vencimientos</h1>
                <Text style={{fontSize: "1rem"}}><QuestionCircleOutlined/> Aqui aparecerán todos los clientes con deudas vencidas</Text>
                <Table
                    columns={tableColumn}
                    dataSource={expirations}
                    scroll={{x:500}}
                    style={{ margin: "1rem" }}
                    pagination={{pageSize: 10}}
                    size="middle"
                />
            </div>
        </>
    )
}

export default ExpirationsManager
