const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        unique: false,
      },
      nombre: {
        type: DataTypes.TEXT,
        unique: false,
      },
      apellido: {
        type: DataTypes.TEXT,
        unique: false,
      },
      edad: {
        type: DataTypes.INTEGER,
        unique: false,
      },
      dpi: {
        type: DataTypes.TEXT,
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
        type: DataTypes.TEXT,
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