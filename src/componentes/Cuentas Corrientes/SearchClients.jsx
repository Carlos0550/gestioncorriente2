import { Button, Card, Table } from 'antd'
import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { IdcardOutlined } from '@ant-design/icons'
import Search from 'antd/es/transfer/search'
import { useNavigate } from 'react-router-dom'

function SearchClients() {
    const { orderedClients, setSearchText, capitaliceStrings } = useAppContext()
    const navigate = useNavigate()
    const tableColumns = [
        {
            key: 1,
            title: "Nombre Completo",
            render: (_, record) => (
                <>
                    <p>{capitaliceStrings(record.nombre_completo)}</p>
                </>
            )
        },
        {
            key: 2,
            title: "DNI",
            render: (_, record) => (
                <>
                    <p>{record.dni}</p>
                </>
            )
        },{
            key: 3,
            render: (_,record) => (
                <>
                    <Button onClick={()=> navigate(`/cuentas-corrientes/show-debts/?clientId=${record.id}`) } icon={<IdcardOutlined/>} type='primary'>Revisar fichero</Button>
                </>
            )
        }
    ]
  return (
    <>
        <Card title="Buscador de Clientes">
            <Search onChange={(value) => setSearchText(value.target.value)}/>
            <Table dataSource={orderedClients} columns={tableColumns} scroll={{x: 500}} />
        </Card>
    </>
  )
}

export default SearchClients