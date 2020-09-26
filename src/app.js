import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import models from './models';
import routes from './routes';


const usersBaseURL = '/usuarios';
const vehiculosBaseURL = '/vehiculos';
const mantenimientoVehiculoBaseURL = '/mantenimiento-vehiculo';
const app = express();
// Application-Level Middleware
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Routes
app.use(`${usersBaseURL}`, routes.usuario);
app.use(`${vehiculosBaseURL}`, routes.vehiculo);
app.use(`${mantenimientoVehiculoBaseURL}`, routes.mantenimientoVehiculo);
// Start

export default app;

