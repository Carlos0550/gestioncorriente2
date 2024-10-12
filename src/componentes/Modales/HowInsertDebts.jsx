import { Modal } from 'antd';
import React from 'react';
import './HowInsertDebts.css'; 

function HowInsertDebts({ closeModal }) {
  return (
    <Modal
      open={true}
      footer={null}
      onCancel={closeModal}
      className="how-insert-debts-modal" 
    >
      <div className="how-insert-debts-content">
        <h2>Información sobre el Formato de Productos</h2>
        <p>
          Por favor, ten en cuenta lo siguiente al ingresar los productos:
        </p>
        <ul>
          <li><strong>Tallas</strong>: Las tallas no deben ser números. Por ejemplo, usa letras como "S", "M", "L", o "XL" en lugar de números.</li>
          <li>
            <strong>Formato Esperado</strong>: Cada producto debe ingresarse en una nueva línea con el siguiente formato:
            <pre>
              <code>[cantidad] [nombre del producto] [precio]</code>
            </pre>
          </li>
          <li><strong>Cantidad</strong>: Un número entero que representa la cantidad del producto.</li>
          <li><strong>Nombre del Producto</strong>: Una descripción del producto que puede incluir letras y espacios, pero <strong>no debe contener números</strong>.</li>
          <li><strong>Precio</strong>: Un número que puede ser entero o decimal (por ejemplo, "25000" o "25000.50"), <strong>El precio debe ser POR UNIDAD</strong>.</li>
        </ul>
        <h3>Ejemplo de Formato Válido</h3>
        <pre>
          <code>1 pantalón de cuero 25000</code>
        </pre>
      </div>
    </Modal>
  );
}

export default HowInsertDebts;
