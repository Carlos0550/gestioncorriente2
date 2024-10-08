import { DeleteOutlined, EditOutlined, PicRightOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

export const structureTable = [
    {
        key: 1,
        title: "Usuarios Registrados",
        render: (_,record) => (
            <p>Acá iran las cuentas que tienen acceso al sistema</p>
        )
    },
    {
        key: 2,
        title: "Permisos",
        render: (_, record) => (
            <p>Aca irán los permisos de cada usuario, por defecto el admin tiene todos los permisos</p>
        )
    },
    {
        key: 3,
        title: "Avatar",
        render: (_, record) => (
            <picture><img src="https://placehold.jp/100x100.png" alt="" /></picture>
        )
    },{
        key: 4,
        title: "Acciones",
        render: (_, record) => (
            <>
                <Space direction='vertical'>
                    <Button type='primary' danger>Revocar acceso<DeleteOutlined /></Button>
                    <Button type='primary'>Editar permisos <EditOutlined/></Button>
                    <Button type='primary'>Colocar Avatar <PicRightOutlined /></Button>
                </Space>
            </>
        )
    }
]