import React, { useEffect } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { Button, Form, Input, message } from 'antd';

function AddBranches({isEditing, selectedBranch, cancelEdit}) {
    const { saveBranch,editBranchName } = useAppContext()
    const [form] = Form.useForm();
console.log(selectedBranch)
    const onFinish = async (values) => {
        const { businessName } = values

        if (!businessName) return message.error("Se necesita un nombre de sucursal/negocio!")

        const hiddenMessage = message.loading("Aguarde...",0)

        isEditing ? await editBranchName(selectedBranch.id, businessName, selectedBranch.business_name) : await 
        saveBranch(businessName)
        hiddenMessage()
        form.resetFields()

        cancelEdit()
    }

    useEffect(()=>{
        if (isEditing) {
            form.setFieldsValue({
                businessName: selectedBranch.business_name
            })
        }else{
            form.resetFields()
        }
    },[isEditing])
    return (
        <>
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
        </>
    )
}

export default AddBranches