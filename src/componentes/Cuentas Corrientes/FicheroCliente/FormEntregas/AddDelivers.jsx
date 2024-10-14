import { Button, DatePicker, Form, Input } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'

function AddDelivers({clientId, editingDeliver = false, selectedDeliver = {}, closeModal, totalDebts}) {

    const [form] = Form.useForm()
    const [deliverDate, setDeliverDate] = useState(dayjs().format("YYYY-MM-DD"))
    const { saveClientDeliver, editDeliver } = useAppContext()
    const [savingDeliver, setSavingDeliver] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(()=>{
        const resize = () => setWidth(window.innerWidth)
        setTimeout(() => {
            window.addEventListener("resize", resize)
        }, 500);
        return () => window.removeEventListener("resize", resize)
    },[width])

    useEffect(()=>{
        console.log(width)
    },[width])
    const onFinish = async(values) => {
        setSavingDeliver(true)
        const { deliverAmount, deliverDate } = values
        const deliver = {
            deliverAmount,
            deliverDate: dayjs(deliverDate).format("YYYY-MM-DD")
        }
        editingDeliver ? await editDeliver(deliver,clientId, selectedDeliver.id) : await saveClientDeliver(deliver,clientId)
        setSavingDeliver(false)
        form.resetFields()
        if (editingDeliver) {
            closeModal()
        }
    }

    const handleDateChange = (date) =>{
        setDeliverDate(date)
    }

    useEffect(()=>{
        if (editingDeliver && selectedDeliver) {
            form.setFieldsValue({
                deliverAmount: selectedDeliver.monto,
                deliverDate: dayjs(selectedDeliver.fecha)
            })

            setDeliverDate(dayjs(selectedDeliver.fecha))
        }
    },[editingDeliver, selectedDeliver])
  return (
    <Form
    name='deliversForm'
    form={form}
    onFinish={onFinish}
    layout={width < 1200 ? "vertical" : "horizontal"}
    >
        <Form.Item
        name={"deliverAmount"}
        label={editingDeliver ? "Ingrese una entrega" : `Ingrese una entrega no mayor a ${parseFloat(totalDebts).toLocaleString("es-AR",{style:"currency",currency:"ARS"})}`}
        rules={[
            {validator:(_,value) => {
                const regex = /^[0-9]+$/
                if (value < 1 || isNaN(parseInt(value))) {
                    return Promise.reject("Por favor, ingrese un monto válido mayor a 0")
                }else if(!regex.test(value)){
                    return Promise.reject("Por favor, ingrese un monto válido")
                }else if(!editingDeliver && value > totalDebts){
                    return Promise.reject(`Por favor, ingrese un monto menor a ${parseFloat(totalDebts).toLocaleString("es-AR",{style:"currency",currency:"ARS"})}`)
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
            <Button type='primary' htmlType='submit' loading={savingDeliver}>Guardar entrega</Button>
        </Form.Item>
    </Form>
  )
}

export default AddDelivers