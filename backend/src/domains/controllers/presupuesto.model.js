import { DataTypes } from 'sequelize';

export const presupuestoModel = (sequelize) => {
  return sequelize.define('Presupuesto', {
    fondo: {
      type: DataTypes.STRING, // Cambiado de TEXT a STRING
      allowNull: true,
      field: 'fondo' // Eliminamos mayúsculas y espacios
    },
    centro_gestor: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'centro_gestor' // Nombre sin espacios
    },
    posicion_presupuestaria: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'posicion_presupuestaria'
    },
    area_funcional: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'area_funcional'
    },
    proyecto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'proyecto'
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nombre'
    },
    ppto_inicial: {
      type: DataTypes.DECIMAL(15, 2), // Más específico que NUMERIC
      allowNull: true,
      field: 'ppto_inicial',
      get() {
        const value = this.getDataValue('ppto_inicial');
        return value === null ? null : parseFloat(value);
      }
    },
    reducciones: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'reducciones'
    },
    adiciones: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'adiciones'
    },
    creditos: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'creditos'
    },
    contracreditos: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'contracreditos'
    },
    total_ppto_actual: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'total_ppto_actual'
    },
    disponibilidad: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'disponibilidad'
    },
    compromiso: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'compromiso'
    },
    reserva: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'reserva'
    },
    factura: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'factura'
    },
    pagos: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'pagos'
    },
    disponible_neto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'disponible_neto'
    },
    ejecucion: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'ejecucion'
    },
    porcentaje_ejecucion: {
      type: DataTypes.DECIMAL(5, 2), // Porcentaje con 2 decimales
      allowNull: true,
      field: 'porcentaje_ejecucion'
    }
  }, {
    tableName: 'ejecucion_presupuestal',
    timestamps: false,
    freezeTableName: true,
    hooks: {
      beforeBulkCreate: (instances) => {
        // Limpieza de datos antes de insertar
        instances.forEach(instance => {
          Object.keys(instance.dataValues).forEach(key => {
            if (typeof instance[key] === 'string') {
              instance[key] = instance[key].trim();
            }
          });
        });
      }
    }
  });
};