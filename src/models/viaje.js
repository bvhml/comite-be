const viaje = (sequelize, DataTypes) => {
    const Viaje = sequelize.define('viaje', {
      coordenada_inicio: {
        type: DataTypes.STRING,
        unique: false,
      },
      ubicacion_inicio: {
        type: DataTypes.STRING,
        unique: false,
      },
      coordenada_fin: {
        type: DataTypes.STRING,
        unique: false,
      },
      ubicacion_fin: {
        type: DataTypes.STRING,
        unique: false,
      },
        id_estatus: {
            type: DataTypes.INTEGER,
            references: {
            model: 'estatus', // 'estatus' refers to table name
            key: 'id', // 'id' refers to column name in estatus table
            },
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
            model: 'usuarios', // 'usuarios' refers to table name
            key: 'id', // 'id' refers to column name in usuarios table
            }
        },
        id_conductor: {
                type: DataTypes.INTEGER,
                references: {
                model: 'conductores', // 'conductores' refers to table name
                key: 'id', // 'id' refers to column name in conductores table
                }
        },
        id_director: {
                type: DataTypes.INTEGER,
                references: {
                model: 'usuarios', // 'conductores' refers to table name
                key: 'id', // 'id' refers to column name in conductores table
                }
        },
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'viajes'
      });
    return Viaje;
  };
  
  export default viaje;