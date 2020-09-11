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
        type: DataTypes.INTEGER,
        unique: false,
      },
      chasis:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      marca:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      tamaño_motor:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      cant_cilindros:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      toneladas:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      transmision:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      asientos:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
      },
      color:{
        type: DataTypes.INTEGER,
        unique: false,
        defaultValue: 0,
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