const historialViaje = (sequelize, DataTypes) => {
    const Viaje = sequelize.define('historialViaje', {
        id_viaje: {
            type: DataTypes.INTEGER,
            references: {
            model: 'viajes', // 'viajes' refers to table name
            key: 'id', // 'id' refers to column name in viajes table
            },
        },
        id_estatus_anterior: {
            type: DataTypes.INTEGER,
            references: {
            model: 'estatus', // 'estatus' refers to table name
            key: 'id', // 'id' refers to column name in estatus table
            },
        },
        id_estatus_nuevo: {
            type: DataTypes.INTEGER,
            references: {
            model: 'estatus', // 'estatus' refers to table name
            key: 'id', // 'id' refers to column name in estatus table
            },
        },
        id_usuario_modifica: {
            type: DataTypes.INTEGER,
            references: {
            model: 'usuarios', // 'usuarios' refers to table name
            key: 'id', // 'id' refers to column name in usuarios table
            }
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        tableName: 'historialesViaje'
    });
    return Viaje;
  };
  
  export default historialViaje;