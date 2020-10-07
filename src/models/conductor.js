const conductor = (sequelize, DataTypes) => {
    const Conductor = sequelize.define('conductor', {
      tipo_licencia: {
        type: DataTypes.STRING,
        unique: false,
      },
      exp_licencia: {
        type: DataTypes.STRING,
        unique: false,
      },
      disponibilidad: {
        type: DataTypes.STRING,
        unique: false,
      },
      id_usuario: {
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
        tableName: 'conductores'
    });
    return Conductor;
  };
  
  export default conductor;