"use client";

const API_URL = "/api/excel/upload";

import { useState } from "react";
import { Radio, Upload, Input, Button, message, Card } from "antd";
import { UploadOutlined, LinkOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

const FileUploadForm = () => {
  const [uploadMethod, setUploadMethod] = useState("local");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const beforeUpload = (file) => {
    setFile(file);
    setShowWarning(false);
    return false;
  };

  const handleSubmit = async () => {
    if ((uploadMethod === "local" && !file) || (uploadMethod === "url" && !url)) {
      setShowWarning(true);
      message.error("Por favor completa los campos requeridos");
      return;
    }
  
    try {
      setIsProcessing(true);
      const formData = new FormData();
      
      if (uploadMethod === "local") {
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
          throw new Error("Formato inválido. Solo se permiten .xlsx o .xls");
        }
  
        formData.append("excelFile", file);
        
        message.loading({
          content: `Procesando ${file.name} (${(file.size/(1024*1024)).toFixed(1)}MB)...`, 
          key: 'upload',
          duration: 0
        });
  
        const response = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: progress => {
            const percent = Math.round((progress.loaded * 100) / progress.total);
            message.loading({
              content: `Subiendo... ${percent}%`,
              key: 'upload'
            });
          }
        });
  
        message.success({
          content: `${file.name} subido correctamente!`,
          key: 'upload',
          duration: 3
        });
  
        return response.data;
  
      } else {
        // Lógica para URL (si aún la necesitas)
      }
    } catch (error) {
      console.error("Error en upload:", error);
      message.error({
        content: error.response?.data?.message || error.message,
        key: 'upload',
        duration: 5
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 p-4 mt-4">
      <Card className="max-w-lg w-full p-62 rounded-xl shadow-md border border-gray-300 formBody">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Método de Carga</h2>

        <Radio.Group
          onChange={(e) => {
            setUploadMethod(e.target.value);
            setShowWarning(false);
          }}
          value={uploadMethod}
          className="w-full space-y-6"
        >
          {/* Opción Local */}
          <div className="border-b pb-4">
            <Radio value="local" className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Desde mi computadora</span>
            </Radio>
            <div className="ml-6 mt-3 flex items-center space-x-4">
              <Upload beforeUpload={beforeUpload} showUploadList={false}>
                <Button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 transition-all">
                  <UploadOutlined /> Seleccionar archivo
                </Button>
              </Upload>
              {file && (
                <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
              )}
            </div>
          </div>

          {/* Opción URL */}
          <div className="border-b pb-4">
            <Radio value="url" className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Desde una URL</span>
            </Radio>
            <div className="ml-6 mt-3">
              <Input
                placeholder="https://ejemplo.com/archivo.csv"
                prefix={<LinkOutlined className="text-gray-400" />}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setShowWarning(false);
                }}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Opción API (deshabilitada) */}
          <Radio value="api" disabled className="text-gray-400">
            Desde una conexión API (próximamente)
          </Radio>
        </Radio.Group>

        {/* Mensaje de advertencia */}
        {showWarning && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mt-4">
            <p className="text-red-600 flex items-center">
              <span className="mr-2">⚠️</span> Selecciona un archivo o ingresa una URL antes de continuar.
            </p>
          </div>
        )}

        {/* Botón de enviar */}
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={isProcessing}
          icon={isProcessing ? <LoadingOutlined /> : null}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-6 rounded-lg transition-all"
        >
          {isProcessing ? 'Procesando...' : 'Cargar Archivo'}
        </Button>
      </Card>
    </div>
  );
};

export default FileUploadForm;