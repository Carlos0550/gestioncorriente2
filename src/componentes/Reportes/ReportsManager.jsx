import { notification, Space, Table, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { baseUrl } from '../../config';
import dayjs from "dayjs"
import "./recordsManager.css"
const { Text } = Typography
function ReportsManager() {
  const [reportes, setReportes] = useState([]);

  const alreadyGetted = useRef(false)
  useEffect(() => {
    if (!alreadyGetted.current) {
      (async () => {
        alreadyGetted.current = true
        try {
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
        } catch (error) {
          console.log(error)
          notification.error({
            message: "Error al obtener reportes",
            description: error.message,
            duration: 4,
          });
        }
      })();
    }
  }, []);


  const parseData = () => {
    try {
      const updatedReports = [...reportes]
      for (let i = 0; i < updatedReports.length; i++) {

        const reporte = updatedReports[i]
        if (reporte?.entity === "history_client"){
          updatedReports[i].old_data = {}
        }

        const hasOldData = reporte?.old_data?.oldDataSerialized && typeof reporte?.old_data?.oldDataSerialized === 'string';
        const hasNewData = reporte?.new_data?.newDataSerialized && typeof reporte?.new_data?.newDataSerialized === 'string';

        if (!hasOldData && !hasNewData) continue;
        const parsedOldData = reporte?.old_data?.oldDataSerialized ? JSON.parse(reporte?.old_data?.oldDataSerialized) : {}
        const parsedNewData = reporte?.new_data?.newDataSerialized ? JSON.parse(reporte?.new_data?.newDataSerialized) : {}

        updatedReports[i].old_data = parsedOldData ? parsedOldData : {};
        updatedReports[i].new_data = parsedNewData ? parsedNewData : {};

      }

      return updatedReports

    } catch (error) {
      console.log(error)
      console.log(error.message || "Error al procesar los datos");
      return null;
    }
  };

  const renderData = (id) => {
    const processedReports = parseData();
    const specificReport = processedReports.find(report => report.id === id);

    if (!specificReport) return <p>No hay datos disponibles para este registro.</p>

    if (specificReport.entity.trim() === "usuarios") return <p>No hay datos para mostrar</p>

    const hasOldData = specificReport.old_data && Object.keys(specificReport.old_data).length > 0;
    const hasNewData = specificReport.new_data && Object.keys(specificReport.new_data).length > 0;

    if (!hasOldData && !hasNewData) return <p>No hay datos que mostrar</p>

    return (
      <div>
        {hasOldData && (
          <>
            <h4>Datos antiguos</h4>
            <ul>
              {Object.entries(specificReport.old_data).map(([key, value]) => (
                <li key={key}>
                  {Array.isArray(value) && value.length > 0 ? (
                    value.map((item, index) => (
                      <div key={index}>
                        {`Producto ${index + 1}: ${item.cantidad} ${item.nombre} ${item.precio}`}
                      </div>
                    ))
                  ) : typeof value === 'object' && value !== null ? (
                    <ul>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <li key={subKey}>
                          <strong>{subKey}:</strong> {subKey.includes('fecha') ? dayjs(subValue).format('DD/MM/YYYY') : subValue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <strong>{key}:</strong> {key.includes('fecha') ? dayjs(value).format('DD/MM/YYYY') : value}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {hasNewData && (
          <>
            <h4>Datos nuevos</h4>
            <ul>
              {Object.entries(specificReport.new_data).map(([key, value]) => (
                <li key={key}>
                  {Array.isArray(value) && value.length > 0 ? (
                    value.map((item, index) => (
                      <div key={index}>
                        {`Producto ${index + 1}: ${item.cantidad} ${item.nombre} ${item.precio}`}
                      </div>
                    ))
                  ) : typeof value === 'object' && value !== null ? (
                    <ul>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <li key={subKey}>
                          <strong>{subKey}:</strong> {subKey.includes('fecha') ? dayjs(subValue).format('DD/MM/YYYY') : subValue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <strong>{key}:</strong> {key.includes('fecha') ? dayjs(value).format('DD/MM/YYYY') : value}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}


      </div>
    );
  };



  useEffect(() => {
    if (reportes && reportes.length > 0) {
      parseData()
    }
  }, [reportes])


  const tableStructure = [
    {
      key: "1",
      title: "Usuario",
      render: (_, record) => (
        <Space direction='vertical'>
          <div className='user-profile'>
            <picture className='user-photo'>
              <img src={record.user_image} alt="" />
            </picture>
            <p className='user-name'>{record.user_name}</p>
          </div>
        </Space>
      )
    },
    {
      key: "2",
      title: "Detalle",
      render: (_, record) => (
        <p>{record.details} el día {dayjs(record.day).format("DD/MM/YYYY")} a las {record.time}</p>
      )
    },
    {
      key: "3",
      title: "R. detallado",
      render: (_, record) => (
        renderData(record.id)
      )
    }

  ];

  return (
    <>
      <Navbar />
      <h1 className='title'>Reportes</h1>
      <div className="container-wrapper">
        <Table columns={tableStructure}  />
      </div>
    </>
  );
}

export default ReportsManager;
