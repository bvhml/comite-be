const log = (sequelize, DataTypes) => {
    const Log = sequelize.define('log', {
      descripcion: {
        type: DataTypes.STRING,
      },
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'logs'
      });
    return Log;
  };
  
  export default log;