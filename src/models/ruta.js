const ruta = (sequelize, DataTypes) => {
    const Ruta = sequelize.define('ruta', {
      ubicacion_inicio: {
        type: DataTypes.TEXT,
        unique: false,
      },
      ubicacion_fin: {
        type: DataTypes.TEXT,
        unique: false,
      },
      numero_personas: {
        type: DataTypes.INTEGER,
        unique: false,
      },
      fecha: {
        type: DataTypes.TEXT,
        unique: false,
      },
      notas: {
        type: DataTypes.TEXT,
        unique: false,
      },
      eliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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