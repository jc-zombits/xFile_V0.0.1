"use client";

import { Card, Modal, Table, Spin, Alert } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import './Cards.css';

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/presupuesto/summary');
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Error al cargar el resumen de datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (fileType) => {
    if (fileType === 'xlsx') {
      setIsModalOpen(true);
      await fetchDataSummary();
    }
  };

  const fileTypes = [
    { title: 'xlsx', color: '#f0f9ff', hoverColor: '#e0f2fe' }, // Azul
    { title: 'csv', color: '#f0fdf4', hoverColor: '#dcfce7' }, // Verde
    { title: 'xlsm', color: '#fff7ed', hoverColor: '#ffedd5' }, // Naranja
    { title: 'txt', color: '#faf5ff', hoverColor: '#f3e8ff' } // Violeta
  ];

  const columns = [
      { title: 'Campo', dataIndex: 'field', key: 'field' },
      { title: 'Registros', dataIndex: 'count', key: 'count' },
      { title: 'Ejemplo', dataIndex: 'example', key: 'example' },
    ];

  return (
    <div className="flex flex-wrap justify-center gap-6 pt-4">
      {fileTypes.map((file, index) => (
        <Card 
          key={index}
          title={file.title.toUpperCase()}
          className={`card-hover w-64 transition-all duration-400 ${file.title === 'xlsx' ? 'cursor-pointer' : ''}`}
          styles={{
            header: { 
              backgroundColor: file.color,
              borderBottom: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            },
            body: { 
              backgroundColor: file.color,
              transition: 'all 0.3s ease'
            }
          }}
          hoverable
          onClick={() => handleCardClick(file.title)}
        >
          <p className="text-gray-600">
            Read your different <span className="font-semibold text-gray-800 bg-gray-100 p-1 rounded-md">{file.title}</span> files
          </p>
          
          <p className="text-xs text-blue-500 mt-2">
            {file.title === 'xlsx' ? 'Click to view data summary' : 'Coming soon'}
          </p>
        </Card>
      ))}

      {/* Modal para el resumen XLSX */}
      <Modal
        title="Resumen de Datos XLSX"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <p>Cargando resumen de datos...</p>
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          summaryData && (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold">Total registros: {summaryData.totalRecords || 0}</h3>
              </div>
              
              {summaryData.fields?.length > 0 && (
                <Table 
                  columns={columns}
                  dataSource={summaryData.fields}
                  pagination={false}
                  size="small"
                  rowKey="field"
                  className="mb-4"
                />
              )}

              {summaryData.totals && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-medium">Presupuesto Total</h4>
                    <p className="text-2xl">${summaryData.totals.ppto_inicial?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h4 className="font-medium">Disponible Neto</h4>
                    <p className="text-2xl">${summaryData.totals.disponible_neto?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded">
                    <h4 className="font-medium">% Ejecución</h4>
                    <p className="text-2xl">{Number(summaryData.totals.ejecucion_percentage)?.toFixed(2) || '0'}%</p>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default Cards;