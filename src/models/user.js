const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
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
    });
    return User;
  };
  
  export default user;