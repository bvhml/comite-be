const vehiculo = (sequelize, DataTypes) => {
    const Vehiculo = sequelize.define('vehiculo', {
      placa: {
        type: DataTypes.STRING,
        unique: false,
      },
      modelo: {
        type: DataTypes.STRING,
        unique: false,
      },
      linea: {
        type: DataTypes.STRING,
        unique: false,
      },
      tipo: {
        type: DataTypes.STRING,
        unique: false,
      },
      chasis:{
        type: DataTypes.STRING,
        unique: false,
      },
      marca:{
        type: DataTypes.STRING,
        unique: false,
      },
      tamaño_motor:{
        type: DataTypes.STRING,
        unique: false,
      },
      cant_cilindros:{
        type: DataTypes.INTEGER,
        unique: false,
      },
      toneladas:{
        type: DataTypes.INTEGER,
        unique: false,
      },
      transmision:{
        type: DataTypes.STRING,
        unique: false,
      },
      asientos:{
        type: DataTypes.INTEGER,
        unique: false,
      },
      color:{
        type: DataTypes.STRING,
        unique: false,
      }
    },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: 'vehiculos'
      });
    return Vehiculo;
  };
  
  export default vehiculo;