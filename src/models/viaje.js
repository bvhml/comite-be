const viaje = (sequelize, DataTypes) => {
    const Viaje = sequelize.define('viaje', {
      id_estatus: {
          type: DataTypes.INTEGER,
          references: {
          model: 'estatus', // 'estatus' refers to table name
          key: 'id', // 'id' refers to column name in estatus table
          },
      },
      id_solicitante: {
          type: DataTypes.INTEGER,
          references: {
          model: 'usuarios', // 'usuarios' refers to table name
          key: 'id', // 'id' refers to column name in usuarios table
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