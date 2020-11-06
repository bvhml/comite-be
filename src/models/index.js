import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    username: process.env.USER,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: console.log
  },
);

const models = {
  User: sequelize.import('./usuario'),
  Vehiculo: sequelize.import('./vehiculo'),
  MantenimientoVehiculo: sequelize.import('./mantenimientoVehiculo'),
  Viaje: sequelize.import('./viaje'),
  Estatus: sequelize.import('./estatus'),
  Ruta: sequelize.import('./ruta'),
  Log: sequelize.import('./log'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;