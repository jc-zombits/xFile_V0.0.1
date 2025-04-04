export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ejecucion_presupuestal', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fondo: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'fondo'
    },
    centro_gestor: { 
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'centro_gestor'
    },
    posicion_presupuestaria: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'posicion_presupuestaria'
    },
    area_funcional: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'area_funcional'
    },
    proyecto: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'proyecto'
    },
    nombre: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'nombre'
    },
    ppto_inicial: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'ppto_inicial'
    },
    reducciones: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'reducciones'
    },
    adiciones: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'adiciones'
    },
    creditos: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'creditos'
    },
    contracreditos: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'contracreditos'
    },
    total_ppto_actual: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'total_ppto_actual'
    },
    disponibilidad: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'disponibilidad'
    },
    compromiso: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'compromiso'
    },
    reserva: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'reserva'
    },
    factura: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'factura'
    },
    pagos: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'pagos'
    },
    disponible_neto: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'disponible_neto'
    },
    ejecucion: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      field: 'ejecucion'
    },
    porcentaje_ejecucion: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      field: 'porcentaje_ejecucion'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('ejecucion_presupuestal');
};