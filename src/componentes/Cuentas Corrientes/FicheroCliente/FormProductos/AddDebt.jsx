import { Button, DatePicker, Form, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import HowInsertDebts from '../../../Modales/HowInsertDebts'
import { QuestionCircleFilled } from '@ant-design/icons'
function AddDebt({ clientId, editingDebt = false, selectedDebt = {}, closeModal }) {
    const [debtsForm] = Form.useForm()
    const [showHelpDebtModal, setShowHelpDebtModal] = useState(false)
    const { uuidv4, saveClientDebt, getClientFile, editDebt } = useAppContext()
    const [dates, setDates] = useState({
        buyDate: dayjs()
    })

    const onChangeDate = (value) => {
        setDates({
            buyDate: value
        })
    }

    useEffect(()=>{
        if (editingDebt) {
            const products = selectedDebt.productos?.map((prod)=> {
                return `${prod.cantidad} ${prod.nombre} ${prod.precio}`
            }).join("\n")
            debtsForm.setFieldsValue({
                productName: products,
                buyDate: dayjs(selectedDebt?.fechaCompra)
            })
            setDates(dates.buyDate = dayjs(selectedDebt?.fechaCompra))
        }
    },[editingDebt])

    const [savingDebt, setSavingDebt] = useState(false)
    const onFinish = async (values) => {
        const { productName } = values

        const products = productName.trim().split("\n")
        const regex = /^\d+ [a-zA-Z0-9\s]+ \d+(\.\d{2})?$/

        for (let product of products) {
            if (!regex.test(product.trim())) {
                notification.error({
                    message: "Uno/s de los productos no es válido",
                    description: `Verifique el formato de: ${product}`,
                    duration: 5,
                    showProgress: true
                })
                return
            }
        }
        setSavingDebt(true)
        editingDebt ? await editDebt(products, dayjs(dates.buyDate).format("YYYY-MM-DD"), selectedDebt.debtUuid, selectedDebt.clienteId) : await saveClientDebt(products, dayjs(dates.buyDate).format("YYYY-MM-DD"), uuidv4(), clientId)
        setSavingDebt(false)
        debtsForm.resetFields()
        if (editingDebt) {
            closeModal()
        }
    }
    return (
        <>
            <Button type='primary' icon={<QuestionCircleFilled />} onClick={() => setShowHelpDebtModal(true)}>Ayuda</Button>
            <Form
                name='debtsForm'
                layout='vertical'
                onFinish={onFinish}
                form={debtsForm}
            >
                <Form.Item
                    name={"productName"}
                    label={"Nombre del producto"}

                    rules={[
                        {
                            required: true,
                            message: "Por favor, ingrese al menos 1 producto"
                        }
                    ]}
                >
                    <TextArea rows={10} placeholder='Ejemplo: 1 pantalon de cuero 25000' />
                </Form.Item>
                <Form.Item
                    name={"buyDate"}
                    id='buyDate'
                    label={"Fecha de compra"}
                    rules={[
                        {
                            validator() {
                                if (dates.buyDate === null) {
                                    return Promise.reject("Por favor, ingrese la fecha de compra")
                                }
                                return Promise.resolve()
                            }
                        }
                    ]}
                >

                    <DatePicker value={dates.buyDate} name='buyDate' id="buyDate" onChange={(date) => onChangeDate(date)} style={{ minWidth: "130px" }} />

                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={savingDebt}>Guardar</Button>
                </Form.Item>
            </Form>
            {showHelpDebtModal && <HowInsertDebts closeModal={() => setShowHelpDebtModal(false)} />}
        </>
    )
}

export default AddDebt