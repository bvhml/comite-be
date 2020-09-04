const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        unique: false,
      },
      nombre: {
        type: DataTypes.STRING,
        unique: false,
      },
      apellido: {
        type: DataTypes.STRING,
        unique: false,
      },
      rol: {
        type: DataTypes.INTEGER,
        unique: false,
      },
      inicio_sesion:{
        type: DataTypes.INTEGER,
        unique: false,
      }
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'usuarios'
      });
    return Usuario;
  };
  
  export default usuario;