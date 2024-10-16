import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Card, Col, Row, Form, Input, Table, Button, Space, Flex, Popconfirm } from 'antd'
import { useAppContext } from '../../context/AppContext'
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons'
import Search from 'antd/es/transfer/search'
import { scroller } from "react-scroll"
import "./clientsManager.css"
function ClientsManager() {
  const { saveClient, clients,editClient,deleteClient, orderedClients, setSearchText,capitaliceStrings } = useAppContext()
  const [formClients] = Form.useForm()
  const [savingClient, setSavingClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [highlighted, setHighlighted] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null)
  const onFinishForm = async (values) => {
    setSavingClient(true)
    isEditing ? await editClient(values, selectedClient.id) : await saveClient(values)
    setSavingClient(false)
    formClients.resetFields()
    setIsEditing(false)
  }

  
  const handleEditClient = (clientId) => {
    setSelectedClient(clients.find((client) => client.id === clientId));
    setIsEditing(true);
    
    scroller.scrollTo("clientForm", {
      duration: 800,
      delay: 0,
      smooth: true,
    });
    setHighlighted(true);
    setTimeout(() => {
      setHighlighted(false);
    }, 1000);
  };

  const [deletingClient, setDeletingClient] = useState(false)
  const handleDeleteClient = async(clienId) => {
    setDeletingClient(true)
    deleteClient(clienId)
    setDeletingClient(false)
  }

  useEffect(() => {
    if (isEditing) {
      formClients.setFieldsValue({
        userName: selectedClient.nombre_completo,
        userEmail: selectedClient.email || "",
        userDni: selectedClient.dni,
        userPhone: selectedClient.telefono || ""
      })
    }else{
      formClients.resetFields()
    }
  }, [isEditing, selectedClient])

 
  const clientsColumns = [
    {
      key: 1,
      title: "Cliente",
      render: (_, record) => (
        <>
          <strong>{capitaliceStrings(record.nombre_completo)}</strong>
        </>
      )
    },
    {
      key: 2,
      title: "DNI",
      dataIndex: "dni"
    },
    {
      key: 3,
      title: "Teléfono",
      render: (_, record) => (
        <>
          <p>{record.telefono || "N/A"}</p>
        </>
      )
    },
    {
      key: 4,
      title: "Correo",
      render: (_, record) => (
        <>
          <p>{record.email || "N/A"}</p>
        </>
      )
    },
    {
      key: 5,
      title: "Acciones",
      render: (_, record) => (
        <>
          <Flex gap={2}>
            <Space>
              <Button type='primary' onClick={() => handleEditClient(record.id)}><EditOutlined /></Button>
              <Popconfirm
                title="Esté seguro que desea eliminar este cliente?"
                description="Esto eliminará permanentemente historial, entregas y deudas!"
                okText="Si, eliminar!"
                cancelText="Cancelar"
                onConfirm={() => handleDeleteClient(record.id)}
                okButtonProps={{ loading: deletingClient }}
              >
                <Button type='primary' danger><DeleteOutlined /></Button>
              </Popconfirm>
            </Space>
            {/* <Space direction='vertical'>
              <Button type='primary'><IdcardOutlined /></Button>
            </Space> */}
          </Flex>
        </>

      )
    }
  ]

  


  return (
    <>
      <Navbar />
      <div className='container-wrapper'>
        <h1 className='title'>Gestión de clientes</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <div id='clientForm' >
              <Card title={isEditing ?
                <Button
                  type='primary'
                  danger onClick={()=> setIsEditing(false)}>Cancelar</Button> :
                "Agregar un cliente"}
                
              >
                <Form
                  layout='vertical'

                  name='usersForm'
                  autoComplete='off'
                  onFinish={onFinishForm}
                  form={formClients}
                >
                  <Form.Item
                    name={"userName"}

                    label="Nombre del cliente"
                    rules={[
                      { required: true, message: "Por favor ingrese el nombre del cliente" },
                      {
                        validator: (_, value) => {
                          if (value?.trim()?.length < 3 || value?.trim()?.length > 50) {
                            return Promise.reject(new Error("El nombre debe tener entre 3 y 30 caracteres."))
                          }
                          return Promise.resolve()
                        }
                      }
                    ]}
                  >
                    <Input placeholder='Introduce el nombre completo' className={highlighted ? 'highlight' : ''} />
                  </Form.Item>
                  <Form.Item
                    name={"userDni"}
                    label="DNI"
                    rules={[
                      { required: true, message: "Por favor ingrese el DNI" },
                      {
                        validator: (_, value) => {
                          const regex = new RegExp("^[0-9A-Z]{6,9}$")
                          if (!regex.test(value)) {
                            return Promise.reject(new Error("El DNI solo puede contener letras MAYUSCULAS y/o y números."))
                          }
                          return Promise.resolve()
                        }
                      }
                    ]}
                  >
                    <Input placeholder='Introduce el DNI' className={highlighted ? 'highlight' : ''} />
                  </Form.Item>
                  <Form.Item
                    name={"userEmail"}
                    label="Email"
                    rules={[
                      { type: "email", message: "Por favor ingrese un email valido" }
                    ]}
                  >
                    <Input className={highlighted ? 'highlight' : ''} />
                  </Form.Item>
                  <Form.Item
                    name={"userPhone"}
                    label="Teléfono de contácto"
                   rules={[
                    {
                      validator: (_, value = "") => {
                        const regex = new RegExp("^[0-9]+$")
                        if (value.trim().length > 0 && !regex.test(value)) {
                          return Promise.reject(new Error("El teléfono solo puede contener números."))
                        }
                        return Promise.resolve()
                      }
                    }
                   ]}
                  >
                    <Input className={highlighted ? 'highlight' : ''} />
                  </Form.Item>
                  <Form.Item>
                    <Space direction='vertical'>
                      <Button type='primary' htmlType='submit' loading={savingClient} icon={<UserAddOutlined />}>Guardar cliente</Button>
                      {isEditing ? <Button type='primary' danger onClick={() => setIsEditing(false)}>Cancelar</Button> : null}
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}  >
            <Card title="Listado de clientes">
              <Search onChange={(val) => setSearchText(val.target.value)} handleClear={() => true} />
              <Table dataSource={orderedClients} columns={clientsColumns} pagination={{ pageSize: 5 }} scroll={{ x: 500 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ClientsManager