import { Presupuesto } from '../../config/database.js';

export const createTable = async (req, res) => {
  try {
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
};

export const uploadData = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'Se esperaba un array de datos'
      });
    }

    const result = await Presupuesto.bulkCreate(data, {
      validate: true,
      returning: true
    });

    res.status(201).json({
      success: true,
      inserted: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default { createTable, uploadData };