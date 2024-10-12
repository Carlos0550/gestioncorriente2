import { Button, DatePicker, Form, Input } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'

function AddDelivers({clientId}) {
    const [form] = Form.useForm()
    const [deliverDate, setDeliverDate] = useState(dayjs())
    const onFinish = (values) => {
        console.log('Success:', values);
    }

    const handleDateChange = (date) =>{
        setDeliverDate(date)
    }
  return (
    <Form
    name='deliversForm'
    form={form}
    onFinish={onFinish}
    >
        <Form.Item
        name={"deliverAmount"}
        label="Monto a entregar"
        rules={[
            {validator:(_,value) => {
                const regex = /^[0-9]+$/
                if (value < 1 || isNaN(parseInt(value))) {
                    return Promise.reject("Por favor, ingrese un monto válido mayor a 0")
                }else if(!regex.test(value)){
                    return Promise.reject("Por favor, ingrese un monto válido")
                }
                return Promise.resolve()
            }}
        ]}
        >
            <Input/>
        </Form.Item>
        <Form.Item
        name={"deliverDate"}
        label="Fecha de entrega"
        rules={[
            {required: true, message: "Por favor, ingrese la fecha de entrega"}
        ]}
        >
            <DatePicker value={deliverDate} onChange={(date)=>handleDateChange(date)}/>
        </Form.Item>
        <Form.Item>
            <Button type='primary' htmlType='submit'>Guardar entrega</Button>
        </Form.Item>
    </Form>
  )
}

export default AddDelivers