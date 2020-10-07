const vehiculoConductor = (sequelize, DataTypes) => {
    const VehiculoConductor = sequelize.define('vehiculoConductor', {
        id_conductor: {
            type: DataTypes.INTEGER,
            references: {
            model: 'conductores', // 'conductores' refers to table name
            key: 'id', // 'id' refers to column name in conductores table
            }
        },
        id_vehiculo: {
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
        tableName: 'vehiculoConductor'
      });
    return VehiculoConductor;
  };
  
  export default vehiculoConductor;