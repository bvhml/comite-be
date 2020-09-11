import 'dotenv/config';
import models, { sequelize } from '../models';
import app from '../app';
import { logger } from '../shared/Logger';
import http from 'http';
import https from 'https';

//force usado para hacer un truncate de toda la base de datos
sequelize.sync({ force: true }).then(async () => {
  try {

    //Crear usuario Admin example
    createUsers();

    if(process.env.HTTPS_SERVER === 'true'){
      var options = {
        key: fs.readFileSync(path.resolve('../key.pem')),
        cert: fs.readFileSync(path.resolve('../cert.pem')),
        passphrase: 'alumni'
      };
      const server = https.createServer(options, app);
      server.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
        logger.info(`HTTPS Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
      );
    }else{

      // Create HTTP server.
      const server = http.createServer(app);
      server.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
        logger.info(`HTTP Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
      );

    }
} catch (error) {
    logger.error(error);
}
});

const createUsers = async () => {
  await models.User.create(
    {
      username: 'a@b.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', //admin
      nombre:'Admin example',
      apellido:'Admin example',
    },
  );
  console.log("Creation of example user done");
};