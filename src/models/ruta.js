const ruta = (sequelize, DataTypes) => {
    const Ruta = sequelize.define('ruta', {
      ubicacion_inicio: {
        type: DataTypes.STRING,
        unique: false,
      },
      ubicacion_fin: {
        type: DataTypes.STRING,
        unique: false,
      },
      numero_personas: {
        type: DataTypes.INTEGER,
        unique: false,
      },
      fecha: {
        type: DataTypes.STRING,
        unique: false,
      },
      id_viaje: {
          type: DataTypes.INTEGER,
          references: {
          model: 'viajes', // 'usuarios' refers to table name
          key: 'id', // 'id' refers to column name in usuarios table
          },
      },
      id_conductor: {
        type: DataTypes.INTEGER,
        references: {
        model: 'usuarios', // 'usuarios' refers to table name
        key: 'id', // 'id' refers to column name in usuarios table
        allowNull: true,
        },
      },
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'rutas'
      });
    return Ruta;
  };
  
  export default ruta;