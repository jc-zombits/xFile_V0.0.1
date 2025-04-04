import { DataTypes } from 'sequelize';

export const presupuestoModel = (sequelize) => {
  return sequelize.define('Presupuesto', {
    x: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'x'
    },
    centro_gestor: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Centro Gestor'
    },
    posicion_presupuestaria: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Posicion Presupuestaria'
    },
    area_funcional: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Area Funcional'
    },
    proyecto: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Proyecto'
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Nombre'
    },
    ppto_inicial: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Ppto inicial'
    },
    reducciones: {
        type: DataTypes.NUMERIC,
        allowNull: true,
        field: 'Reducciones'
    },
    adiciones: {
        type: DataTypes.NUMERIC,
        allowNull: true,
        field: 'Adiciones'
    },
    creditos: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Creditos'
    },
    contracreditos: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Contracreditos'
    },
    total_ppto_actual: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Total Ppto actual'
    },
    disponibilidad: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Disponibilidad'
    },
    compromiso: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Compromiso'
    },
    reserva: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Reserva'
    },
    factura: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Factura'
    },
    pagos: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Pagos'
    },
    disponible_neto: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Disponible Neto'
    },
    ejecucion: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: 'Ejecucion'
    },
    porcentaje_ejecucion: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      field: '% ejecucion'
    }
  }, {
    tableName: 'ejecucion_presupuestal',
    timestamps: false,
    freezeTableName: true
  });
};