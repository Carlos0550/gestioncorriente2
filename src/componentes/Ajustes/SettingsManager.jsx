import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Card, Form, Table, Input, Row, Col, Collapse, Button } from 'antd'

const { Panel } = Collapse;

function SettingsManager() {
    const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState(null);

    const onFinish = (values) => {
        console.log(values);
    }

    const settingTable = [
        {
            key: "1",
            title: "Puntos de venta",
            render: (_, record) => (
                <></>
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
                        <Panel header="Sucursales" key="1">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Table
                                        columns={settingTable}
                                        pagination={false}
                                        scroll={{ x: '100%' }}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                <h3>Agregar sucursal</h3>
                                    <Form
                                        form={form}
                                        layout='vertical'
                                        onFinish={onFinish}
                                    >
                                        <Form.Item
                                            name={"businessName"}
                                            label="Nombre del local/negocio"
                                            rules={[
                                                { type: "string", required: true, message: "El nombre del local/negocio es obligatorio" }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        >
                                            <Button htmlType='submit' type='primary'>Guardar sucursal</Button>
                                        </Form.Item>
                                    </Form>
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
