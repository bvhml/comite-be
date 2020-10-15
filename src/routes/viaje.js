import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import extractToken from '../shared/extractToken';
import { sequelize } from '../models';
import nodemailer from 'nodemailer';

const router = Router();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILACCOUNT,
    pass: process.env.MAILPWD,
  },
});

/******************************************************************************
 *                      Get All Viajes de Usuario especifico - "GET /:id_usuario"
 ******************************************************************************/
router.get('/:id_usuario', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);

    const viajes = await req.context.models.Viaje.findAll({
      where: {id_usuario: req.params.id_usuario},
      order: 
      [
        ['id', 'ASC'],
      ],
        raw:true
      });
    return res.status(OK).send(viajes);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener los viajes'); 
  }
  
});

/******************************************************************************
 *                      Get specific viaje - "GET /:viaje_id"
 ******************************************************************************/
router.get('/:viaje_id', async (req, res) => {

  try {
    jwt.verify(extractToken(req),process.env.SECRET);

    const viaje = await req.context.models.Viaje.findOne(
      {where: {id: req.params.viaje_id}}
    );
    return res.status(OK).send(viaje);
    
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener el viaje'); 
  }
  
});

/******************************************************************************
 *                      Create viaje - "POST /"
 ******************************************************************************/

  router.post('/', async (req, res) => {
    
    const t = await sequelize.transaction();
    try {
        //jwt.verify(extractToken(req),process.env.SECRET);
        const { viaje } = req.body;
        let viaje_creado = await req.context.models.Viaje.create(
            {
              coordenada_inicio: viaje.coordenada_inicio || null,
              ubicacion_inicio: viaje.ubicacion_inicio || null,
              coordenada_fin: viaje.coordenada_fin || null,
              ubicacion_fin: viaje.ubicacion_fin || null,
              id_estatus: viaje.id_estatus || null,
              id_usuario: viaje.id_usuario || null,
              id_conductor: viaje.id_conductor || null,
              id_director: viaje.id_director || null,
            }
        );
        
        //Notificar a Director
        const correoDirector = await req.context.models.User.findOne({where: {id: viaje.id_director}});
        let body = 
        `<h3>Estimado Director</h3><br>
        
        Se ha ingresado una nueva solicitud de viaje.<br><br><br><br>
        
        Saludos cordiales,<br><br><br>
        
        Victor Morales`;

        enviarNotificacion(process.env.MAILACCOUNT,correoDirector.dataValues.username,"Solicitud de viaje",body);

        //Agregar rutas de viaje a tabla RUTAS
        viaje.rutas.map((ruta)=>req.context.models.Ruta.create({...ruta, id_viaje:viaje_creado.dataValues.id}))

        await t.commit();
        return res.status(OK).json('Viaje creado exitosamente.');
        
        //logger.info(`Viaje creada por: ${viaje.username}`)
  
    } catch (error) {
      await t.rollback();
      logger.error(`Error al crear viaje`, error);
      return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un viaje.');
    }
  });

  /******************************************************************************
 *                      UPDATE viaje - "PUT /"
 ******************************************************************************/

router.put('/', async (req, res) => {
  try {
      //jwt.verify(extractToken(req),process.env.SECRET);
      const { viaje } = req.body;
      
      
      const verificarMantenimiento = await req.context.models.Viaje.findOne({
          where: {
            id: viaje.id,
          },
          raw:true
      });

      if (verificarMantenimiento) {
      await req.context.models.Viaje.update(
          {
            coordenada_inicio: viaje.coordenada_inicio || null,
            ubicacion_inicio: viaje.ubicacion_inicio || null,
            coordenada_fin: viaje.coordenada_fin || null,
            ubicacion_fin: viaje.ubicacion_fin || null,
            id_estatus: viaje.id_estatus || null,
            id_usuario: viaje.id_usuario || null,
            id_conductor: viaje.id_conductor || null,
            id_director: viaje.id_director || null,
          },
          {
              returning: true, where: { id: viaje.id } 
          }
      );

      //Agregar rutas de viaje a tabla RUTAS
      await viaje.rutas
      .filter((ruta)=>ruta.modificado !== 'false')
      .map((ruta)=>req.context.models.Ruta.update({...ruta},{returning: true, where: { id: ruta.id } }));

      return res.status(OK).json('Viaje actualizado exitosamente.');
      }else{

        return res.status(OK).json('Error, viaje no encontrado para actualizar');
      }
      //logger.info(`Viaje creada por: ${viaje.username}`)

  } catch (error) {
    logger.error(`Error al crear viaje`, error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un viaje.');
  }
});


//Definicion de Funciones

const enviarNotificacion = async (from, to, subject, html)=>{
  await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    html
  });
};

export default router;