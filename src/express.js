import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import models, { sequelize } from './models';
import routes from './routes';
import { logger } from './shared/Logger';
import fs from 'fs';
import path from 'path';
import https from 'https';



const usersBaseURL = '/users';
const app = express();
// Application-Level Middleware
app.use(express.static('public'));
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  const { email } = req.body;

  req.context = {
    models,
    /*me: await models.User.findByLogin(email||''),*/
  };
  next();
});

// Routes
app.use(`${usersBaseURL}`, routes.user);
// Start

const eraseDatabaseOnSync = false;

sequelize.sync(/*{ force: eraseDatabaseOnSync }*/).then(async () => {
  try {
  
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  if(process.env.HTTPS_SERVER === 'true'){
    var options = {
      key: fs.readFileSync(path.resolve('./src/key.pem')),
      cert: fs.readFileSync(path.resolve('./src/cert.pem')),
      passphrase: 'alumni'
    };
    const server = https.createServer(options, app);
    server.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
      logger.info(`HTTPS Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
    );
  }else{
    app.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
    logger.info(`HTTP Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
  );

  }
} catch (error) {
    logger.error(error);
}
});


const createUsersWithMessages = async () => {
  try {
    await models.User.create(
      {
        nombre1: 'Byron',
        nombre2: 'Victor Hugo',
        apellido1: 'Morales',
        apellido2: 'Lemus',
        añoGraduacion: '2013',
        trabajo: 'Universidad Fransisco Marroquín',
        especialidad: 'Front-end developer',
        telefono: '23387713',
        pais: 'Guatemala',
        carrera: 'Licenciatura en Ingenieria en Informatica y Sistemas',
        email: 'victorm@ufm.edu',
        username: '1320114',
        genero: 'M',
      },
    );

    await models.User.create(
      {
        nombre1: 'Jorge',
        nombre2: 'Siddhartha',
        apellido1: 'Gonzalez',
        apellido2: 'Ibarra',
        añoGraduacion: '2005',
        trabajo: 'Universidad de Guadalajara',
        especialidad: 'Musico',
        telefono: '12211221',
        pais: 'Mexico',
        carrera: 'Licenciatura en Composición Musical',
        email: 'victorm@ufm.edu',
        username: '1234567',
        genero: 'M',
      },
    );
} catch (error) {
  logger.error(error);
}
  logger.info("Creation done");
};

