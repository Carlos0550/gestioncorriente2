export const pagosRecientesEstructura = [
    {
        key:1,
        title: "Fecha",
        dataIndex: "fecha",
    },
    {
        key:2,
        title: "Cliente",
        dataIndex: "cliente",
    },
    {
        key: 3,
        title: "Monto",
        dataIndex: "monto",
        render: (_, record) => (
            <p>{record.monto}</p>
        )
    }
]