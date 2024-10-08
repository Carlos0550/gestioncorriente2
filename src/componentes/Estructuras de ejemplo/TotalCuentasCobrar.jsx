import { IdcardOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

export const totalAccountsToPay =[
    {
        key: 1,
        title: 'Cliente',
        render: (_,record) => (
            <>
                {record.nombre}
            </>
        )
    },
    {
        key: 2,
        title: 'Adeuda',
        render: (_,record) => (
            <>
                {parseInt(record.adeuda).toLocaleString("es-AR",{style:"currency",currency:"ARS"})}
            </>
        )
    },
    {
        key: 3,
        title: 'Acciones',
        render: (_,record) => (
            <>
                <Space >
                    <Button type="primary">Revisar fichero<IdcardOutlined/></Button>
                </Space>
            </>
        )
    }
]