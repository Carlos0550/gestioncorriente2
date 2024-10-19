import { notification, Space, Table, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { baseUrl } from '../../config';
import dayjs from "dayjs"
const { Text } = Typography
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
  console.log("Reportes: ", reportes)

 

  return (
    <>
      <Navbar />
      <h1 className='title'>Reportes</h1>
      <div className="container-wrapper">
      </div>
    </>
  );
}

export default ReportsManager;
