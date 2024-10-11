import { Button, ConfigProvider, DatePicker, Form, message, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import es_ES from "antd/locale/es_ES"
import React, { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import Markdown from "react-markdown"
import HowInsertDebts from '../../Modales/HowInsertDebts'
import { QuestionCircleFilled } from '@ant-design/icons'
function AddDebt({clientId}) {
    const [debtsForm] = Form.useForm()
    const [showHelpDebtModal, setShowHelpDebtModal] = useState(false)
    const { uuidv4,saveClientDebt } = useAppContext()
    const [dates, setDates] = useState({
        buyDate: dayjs()
    })


 const onChangeDate = (value) => {
        setDates({
            buyDate: value
        })
    }

    const [savingDebt, setSavingDebt] = useState(false)
    const onFinish = async(values) => {
        const { productName } = values
        
        const products = productName.trim().split("\n")
        const regex = /^\d+ [a-zA-Z\s]+ \d+(\.\d{2})?$/

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
        await saveClientDebt(products, dayjs(dates.buyDate).format("YYYY-MM-DD"), uuidv4(), clientId)
        setSavingDebt(false)
    }
  return (
    <>
    <Button type='primary' icon={<QuestionCircleFilled/>} onClick={()=> setShowHelpDebtModal(true)}>Ayuda</Button>
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
            <TextArea rows={10} placeholder='Ejemplo: 1 pantalon de cuero 25000'/>
        </Form.Item>
        <Form.Item
        name={"buyDate"}
        id='buyDate'
        label={"Fecha de compra"}
        rules={[
            {
                validator(){
                    if (dates.buyDate === null) {
                        return Promise.reject("Por favor, ingrese la fecha de compra")
                    }
                    return Promise.resolve()
                }
            }
        ]}
        >
            <ConfigProvider locale={es_ES}>
                <DatePicker value={dates.buyDate} name='buyDate' id="buyDate" onChange={(date) => onChangeDate(date)}  style={{minWidth: "130px"}}/>
            </ConfigProvider>
        </Form.Item>
        <Form.Item>
            <Button type='primary' htmlType='submit'>Guardar</Button>
        </Form.Item>
    </Form>
    {showHelpDebtModal && <HowInsertDebts closeModal={() => setShowHelpDebtModal(false)} />}
    </>
  )
}

export default AddDebt