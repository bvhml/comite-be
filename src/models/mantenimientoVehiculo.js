const mantenimientoVehiculo = (sequelize, DataTypes) => {
    const MantenimientoVehiculo = sequelize.define('mantenimientoVehiculo', {
      descripcion: {
        type: DataTypes.STRING,
        unique: false,
      },
      lugar: {
        type: DataTypes.STRING,
        unique: false,
      },
      fecha: {
        type: DataTypes.STRING,
        unique: false,
      },
      eliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      vehiculoId: {
            type: DataTypes.INTEGER,
            references: {
            model: 'vehiculos', // 'vehiculos' refers to table name
            key: 'id', // 'username' refers to column name in vehiculos table
            }
        },
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'mantenimientosVehiculo'
      });
    return MantenimientoVehiculo;
  };
  
  export default mantenimientoVehiculo;