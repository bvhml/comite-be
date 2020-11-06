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
    createSampleData();

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

const createSampleData = async () => {

  //Directores
  await models.User.create(
    {
      username: 'byrito95@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Byron',
      apellido:'Morales',
      edad:'25',
      dpi:'2739977850101',
      rol:'4',
    },
  );
  await models.User.create(
    {
      username: 'albasagastume@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Alba',
      apellido:'Sagastume',
      edad:'25',
      dpi:'2739977850101',
      rol:'4',
    },
  );
  
  //Administradores
  await models.User.create(
    {
      username: 'administrador1@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Joel',
      apellido:'Perez',
      edad:'20',
      dpi:'2739977850101',
      rol:'3',
    },
  );
  await models.User.create(
    {
      username: 'administrador2@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Benedicto',
      apellido:'Guerra',
      edad:'20',
      dpi:'2739977850101',
      rol:'3',
    },
  );

  //Solicitante
  await models.User.create(
    {
      username: 'solicitante1@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Gerardo',
      apellido:'Gonzalez',
      edad:'20',
      dpi:'2739977850101',
      rol:'2',
    },
  );
  await models.User.create(
    {
      username: 'solicitante2@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Jesus',
      apellido:'Jerez',
      edad:'20',
      dpi:'2739977850101',
      rol:'2',
    },
  );
  
  //Pilotos
  await models.User.create(
    {
      username: 'piloto1@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Marvin',
      apellido:'Zepeda',
      edad:'20',
      dpi:'2739977850101',
      rol:'1',
    },
  );
  await models.User.create(
    {
      username: 'piloto2@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Jose',
      apellido:'Rodriguez',
      edad:'20',
      dpi:'2739977850101',
      rol:'1',
    },
  );

  //Soportes
  await models.User.create(
    {
      username: 'soportecomite@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', 
      nombre:'Fernando',
      apellido:'Lemus',
      edad:'20',
      dpi:'2739977850101',
      rol:'5',
    },
  );

  await models.Vehiculo.create(
    {
        placa: '222URL',
        modelo: '2020',
        linea: 'Supra',
        tipo:  'Sedan',
        chasis: '213213GXTJ2',
        marca: 'Toyota',
        tamaño_motor: '2500',
        cant_cilindros: '4',
        toneladas: '1',
        transmision: 'Mecanica',
        asientos: '4',
        color: 'Negro',
        piloto: 7,
    }
  );
  await models.Vehiculo.create(
    {
        placa: '557URL',
        modelo: '2020',
        linea: 'Hiace',
        tipo:  'Panel',
        chasis: '213213GXTJ2',
        marca: 'Toyota',
        tamaño_motor: '2500',
        cant_cilindros: '4',
        toneladas: '1',
        transmision: 'Mecanica',
        asientos: '14',
        color: 'Plateado',
        piloto: 8,
    }
  );

  await models.MantenimientoVehiculo.create(
    {
      descripcion: 'Servicio menor',
      lugar: 'VIFRIO GT',
      fecha: '23/09/2020',
      vehiculoId: 1,
    }
  );
  await models.MantenimientoVehiculo.create(
    {
      descripcion: 'Servicio mayor',
      lugar: 'TALLERES PROFESIONALES GT',
      fecha: '25/09/2020',
      vehiculoId: 1,
    }
  );
  
  await models.Estatus.create({
    estatus: '0',
  });
  await models.Estatus.create({
    estatus: '1',
  });
  await models.Estatus.create({
    estatus: '2',
  });
  
  console.log("Creation of sample data done");
};