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
      edad: {
        type: DataTypes.INTEGER,
        unique: false,
      },
      dpi: {
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
        defaultValue: 0,
      },
      titulo: {
        type: DataTypes.STRING,
        unique: false,
      },
      eliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'usuarios'
      });
    return Usuario;
  };
  
  export default usuario;