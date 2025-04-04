import ExcelJS from 'exceljs';
import { initModels } from '../../config/database.js';
import fs from 'fs';

// Funciones de limpieza de datos
const cleanValue = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
};

const cleanNumeric = (value) => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export const processExcel = async (filePath) => {
  const { Presupuesto } = await initModels();
  
  try {
    // Validaciones iniciales
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado en ruta: ${filePath}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    if (worksheet.rowCount < 2) {
      throw new Error('El archivo Excel no contiene datos (solo cabecera)');
    }

    // Mapeo de columnas (ajusta según tu Excel)
    const columnMap = {
      fondo: 1,
      centro_gestor: 2,
      posicion_presupuestaria: 3,
      area_funcional: 4,
      proyecto: 5,
      nombre: 6,
      ppto_inicial: 7,
      reducciones: 8,
      adiciones: 9,
      creditos: 10,
      contracreditos: 11,
      total_ppto_actual: 12,
      disponibilidad: 13,
      compromiso: 14,
      reserva: 15,
      factura: 16,
      pagos: 17,
      ejecucion: 18,
      porcentaje_ejecucion: 19,
      disponible_neto: 20
    };

    const rows = [];
    let headerValid = true;

    // Validar cabeceras
    const headerRow = worksheet.getRow(1);
    Object.entries(columnMap).forEach(([key, colIndex]) => {
      const headerCell = headerRow.getCell(colIndex).value?.toString().trim().toLowerCase();
      if (!headerCell || !headerCell.includes(key.toLowerCase())) {
        console.warn(`Advertencia: La columna ${colIndex} (${headerCell}) no coincide con ${key}`);
        headerValid = false;
      }
    });

    if (!headerValid) {
      console.warn('Advertencia: Las cabeceras no coinciden exactamente con lo esperado');
    }

    // Procesar filas
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar cabecera

      const rowData = {
        fondo: cleanValue(row.getCell(columnMap.fondo).value),
        centro_gestor: cleanValue(row.getCell(columnMap.centro_gestor).value),
        posicion_presupuestaria: cleanValue(row.getCell(columnMap.posicion_presupuestaria).value),
        area_funcional: cleanValue(row.getCell(columnMap.area_funcional).value),
        proyecto: cleanValue(row.getCell(columnMap.proyecto).value),
        nombre: cleanValue(row.getCell(columnMap.nombre).value),
        ppto_inicial: cleanNumeric(row.getCell(columnMap.ppto_inicial).value),
        reducciones: cleanNumeric(row.getCell(columnMap.reducciones).value),
        adiciones: cleanNumeric(row.getCell(columnMap.adiciones).value),
        creditos: cleanNumeric(row.getCell(columnMap.creditos).value),
        contracreditos: cleanNumeric(row.getCell(columnMap.contracreditos).value),
        total_ppto_actual: cleanNumeric(row.getCell(columnMap.total_ppto_actual).value),
        disponibilidad: cleanNumeric(row.getCell(columnMap.disponibilidad).value),
        compromiso: cleanNumeric(row.getCell(columnMap.compromiso).value),
        reserva: cleanNumeric(row.getCell(columnMap.reserva).value),
        factura: cleanNumeric(row.getCell(columnMap.factura).value),
        pagos: cleanNumeric(row.getCell(columnMap.pagos).value),
        ejecucion: cleanNumeric(row.getCell(columnMap.ejecucion).value),
        porcentaje_ejecucion: cleanNumeric(row.getCell(columnMap.porcentaje_ejecucion).value),
        disponible_neto: cleanNumeric(row.getCell(columnMap.disponible_neto).value)
      };

      rows.push(rowData);
    });

    // Insertar en lotes
    const chunkSize = 500;
    let totalInserted = 0;
    let errors = [];

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      try {
        await Presupuesto.bulkCreate(chunk, {
          validate: true,
          ignoreDuplicates: true,
          returning: false
        });
        totalInserted += chunk.length;
      } catch (error) {
        errors.push({
          chunk: Math.floor(i / chunkSize) + 1,
          error: error.message,
          sampleRow: chunk[0],
          databaseError: error.errors?.map(e => e.message)
        });
      }
    }

    return {
      totalProcessed: totalInserted,
      totalErrors: errors.length,
      errors: errors.slice(0, 5), // Limitar a 5 errores máximo
      sampleData: rows.length > 0 ? rows[0] : null,
      invalidRows: rows.filter(row => 
        row.fondo === null || 
        row.centro_gestor === null || 
        row.ppto_inicial === null
      ).length
    };

  } finally {
    // Limpieza garantizada
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (cleanupError) {
      console.error('Error al limpiar archivo temporal:', cleanupError);
    }
  }
};