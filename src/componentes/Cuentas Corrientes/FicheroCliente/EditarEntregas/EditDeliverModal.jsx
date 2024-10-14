import { Button, Modal } from 'antd'
import React from 'react'
import AddDelivers from '../FormEntregas/AddDelivers'

function EditDeliverModal({closeModal, clientId, selectedDeliver}) {
    const { id_cliente, ...deliver } = selectedDeliver
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={[
            <Button onClick={()=> closeModal()}>Cancelar</Button>
        ]}
    >
        <AddDelivers clientId={clientId} editingDeliver={true} selectedDeliver={deliver} closeModal={closeModal} />
    </Modal>
  )
}

export default EditDeliverModal