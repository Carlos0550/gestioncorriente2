import { notification, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { baseUrl } from '../../config';
import dayjs from "dayjs"
function ReportsManager() {
  const [reportes, setReportes] = useState([]);

  const alreadyGetted = useRef(false)
  useEffect(() => {
    if (!alreadyGetted.current) {
      (async () => {
        alreadyGetted.current = true
        const response = await fetch(`${baseUrl.api}/get-logs`);
        const data = await response.json();
        if (response.status === 200) {
          setReportes(data.reports);
          notification.success({
            message: "Reportes obtenidos!",
            duration: 1,
            showProgress: true
          });
        } else if (response.status === 404) {
          setReportes([]);
          notification.info({
            message: "No se encontraron reportes",
            description: response.message,
            duration: 4,
            showProgress: true
          });
        }
      })();
    }
  }, []);

  const actionTypes = {
    insert: "Crear",
    create: "Crear",
    update: "Actualizar",
    delete: "Eliminar",

  };

  const transformedReports = reportes.map(report => ({
    ...report,
    detalles: `${report.details} el día ${dayjs(report.day).format("DD/MM/YYYY")} a las ${report.time}`,
    action_type: actionTypes[report.action_type] ? actionTypes[report.action_type] : report.action_type,
  }));

  const columns = [
    {
      title: 'Usuario',
      render: (_, record) => (
        <Space>
          <p>{record.user_name}</p>
          <picture className="user__image-container"><img src={record.user_image} alt="" /></picture>
        </Space>
      ),
      key: 'user_name',
    },
    {
      title: 'Tipo de Acción',
      dataIndex: 'action_type',
      key: 'action_type',
    },
    {
      title: 'Entidad',
      dataIndex: 'entity',
      key: 'entity',
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
    },
  ];


  return (
    <>
      <Navbar />
      <h1 className='title'>Reportes</h1>
      <div className="container-wrapper">
        <Table dataSource={transformedReports} columns={columns} rowKey="id" scroll={{ x: 500 }} />
      </div>
    </>
  );
}

export default ReportsManager;
