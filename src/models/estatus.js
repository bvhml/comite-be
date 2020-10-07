const estatus = (sequelize, DataTypes) => {
    const Estatus = sequelize.define('estatus', {
      estatus: {
        type: DataTypes.STRING,
        unique: false,
      },
    },
    {
        timestamps: true,
        freezeTableName: true,
        tableName: 'estatus'
    });
    return Estatus;
  };
  
  export default estatus;