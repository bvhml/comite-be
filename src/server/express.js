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

  await models.User.create(
    {
      username: 'byrito95@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', //admin
      nombre:'Byron',
      apellido:'Morales',
      edad:'25',
      dpi:'2739977850101',
      rol:'4',
    },
  );
  await models.User.create(
    {
      username: 'victormorales.uts@gmail.com',
      password: '$2b$10$zSjKPHI5n4Pe/d408to.C.9if4w81ui.AziBfzR/opYHbjSKiaB.i', //admin2
      nombre:'Victor',
      apellido:'Morales',
      edad:'20',
      dpi:'2739977850101',
      rol:'4',
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
        color: 'Negro'
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
  
  await models.Conductor.create({
    tipo_licencia: 'C',
    exp_licencia: '12/12/2030',
    disponibilidad: '1',
    id_usuario: 1,
  })
  await models.Conductor.create({
    tipo_licencia: 'B',
    exp_licencia: '12/12/2030',
    disponibilidad: '1',
    id_usuario: 2,
  })
  
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