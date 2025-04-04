import { processExcel } from '../../services/excel/excelParser.js';
import { initModels, sequelize } from '../../config/database.js';
import fs from 'fs';
import path from 'path';

export const presupuestoController = {
  createTable: async (req, res) => {
    try {
      const { Presupuesto } = await initModels();
      await Presupuesto.sync({ alter: true });
      res.status(200).json({ 
        success: true,
        message: 'Tabla ejecucion_presupuestal actualizada'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  uploadExcel: async (req, res) => {
    let filePath = req.file?.path;
    
    try {
      // Validación del archivo
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No se subió ningún archivo' 
        });
      }

      const fileExt = path.extname(req.file.originalname).toLowerCase();
      if (!['.xlsx', '.xls'].includes(fileExt)) {
        throw new Error('Formato de archivo no válido. Solo se aceptan .xlsx o .xls');
      }

      // Procesar el archivo
      const result = await processExcel(filePath);

      // Respuesta exitosa
      res.json({
        success: true,
        message: `Datos cargados exitosamente (${result.totalProcessed} registros)`,
        ...(result.totalErrors > 0 && {
          warning: `${result.totalErrors} registros no se procesaron`,
          sampleErrors: result.errors
        }),
        sampleData: result.sampleData
      });

    } catch (error) {
      console.error('Error en uploadExcel:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          fileProcessed: filePath
        })
      });
    } finally {
      // Limpieza garantizada
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Error al limpiar archivo temporal:', cleanupError);
        }
      }
    }
  },

  getDataSummary: async (req, res) => {
    try {
      const { Presupuesto } = await initModels();

      const [totalRecords, fieldsSummaryRaw, totals] = await Promise.all([
        Presupuesto.count(),
        sequelize.query(`
          SELECT
            'ppto_inicial' AS field,
            COUNT(ppto_inicial) AS count,
            MIN(ppto_inicial) AS example
          FROM ejecucion_presupuestal

          UNION

          SELECT
            'disponible_neto' AS field,
            COUNT(disponible_neto) AS count,
            MIN(disponible_neto) AS example
          FROM ejecucion_presupuestal

          UNION

          SELECT
            'porcentaje_ejecucion' AS field,
            COUNT(porcentaje_ejecucion) AS count,
            MIN(porcentaje_ejecucion) AS example
          FROM ejecucion_presupuestal;
        `),
        Presupuesto.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('ppto_inicial')), 'ppto_inicial'],
            [sequelize.fn('SUM', sequelize.col('disponible_neto')), 'disponible_neto'],
            [sequelize.literal('ROUND(AVG("porcentaje_ejecucion"), 2)'), 'ejecucion_percentage']
          ],
          raw: true
        })
      ]);

      res.json({
        totalRecords,
        fields: fieldsSummaryRaw[0],
        totals
      });

    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

};

export default presupuestoController;