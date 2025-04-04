export const up = async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ejecucion_presupuestal', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        x: { type: Sequelize.TEXT, field: 'x' },
        centro_gestor: { 
          type: Sequelize.TEXT,
          field: 'Centro Gestor'
        },
        posicion_presupuestaria: {
          type: Sequelize.TEXT,
          field: 'Posicion Presupuestaria'
        },
        area_funcional: {
          type: Sequelize.TEXT,
          field: 'Area Funcional'
        },
        proyecto: {
          type: Sequelize.TEXT,
          field: 'Proyecto'
        },
        nombre: {
          type: Sequelize.TEXT,
          field: 'Nombre'
        },
        ppto_inicial: {
          type: Sequelize.NUMERIC,
          field: 'Ppto inicial'
        },
        reducciones: {
          type: Sequelize.NUMERIC,
          field: 'Reducciones'
        },
        adiciones: {
          type: Sequelize.NUMERIC,
          field: 'Adiciones'
        },
        creditos: {
          type: Sequelize.NUMERIC,
          field: 'Creditos'
        },
        contracreditos: {
          type: Sequelize.NUMERIC,
          field: 'Contracreditos'
        },
        total_ppto_actual: {
          type: Sequelize.NUMERIC,
          field: 'Total Ppto actual'
        },
        disponibilidad: {
          type: Sequelize.NUMERIC,
          field: 'Disponibilidad'
        },
        compromiso: {
          type: Sequelize.NUMERIC,
          field: 'Compromiso'
        },
        reserva: {
          type: Sequelize.NUMERIC,
          field: 'Reserva'
        },
        factura: {
          type: Sequelize.NUMERIC,
          field: 'Factura'
        },
        pagos: {
          type: Sequelize.NUMERIC,
          field: 'Pagos'
        },
        disponible_neto: {
          type: Sequelize.NUMERIC,
          field: 'Disponible neto'
        },
        ejecucion: {
          type: Sequelize.NUMERIC,
          field: 'Ejecucion'
        },
        // ... todos los demás campos
        porcentaje_ejecucion: {
          type: Sequelize.NUMERIC,
          field: '% ejecucion'
        }
    });
  }
  
export const down = async (queryInterface) => {
  await queryInterface.dropTable('ejecucion_presupuestal');
};

export default { up, down };