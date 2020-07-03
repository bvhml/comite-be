import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    username: process.env.USER,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
);

const models = {
  User: sequelize.import('./user'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;