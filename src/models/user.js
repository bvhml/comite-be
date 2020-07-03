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
    });

    User.findByLogin = async (login,password) => {
        let user = await User.findOne({
          where: { username: login, password: password},
        });
    
        if (!user) {
          user = await User.findOne({
            where: { username: login ,password: password} ,
          });
        }
        else{
          console.log(user.dataValues);
        }
        
        return user;
      };

     
    return User;
  };
  
  export default user;