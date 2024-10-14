import { Button, Modal } from 'antd'
import React from 'react'
import AddDebt from '../FormProductos/AddDebt'

function EditDebtsModal({closeModal, selectedDebt}) {
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={[
            <Button onClick={closeModal} type='primary' danger>Cancelar</Button>
        ]}
    >
        <AddDebt closeModal={closeModal} selectedDebt={selectedDebt} editingDebt={true}/>
    </Modal>
  )
}

export default EditDebtsModal