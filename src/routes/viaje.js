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
 *                      Get All Viajes - "GET /"
 ******************************************************************************/
router.get('/todos/', async (req, res) => {
try {
  jwt.verify(extractToken(req),process.env.SECRET);
  try {
    let viajesConRutas = [];
    const viajes = await req.context.models.Viaje.findAll({
      order: 
      [
        ['id', 'DESC'],
      ],
        raw:true
      });

      await Promise.all(viajes.map(async (viaje)=>{
        let rutas = await req.context.models.Ruta.findAll({
          where: {
            id_viaje: viaje.id,
          },
          raw:true
        });
        viajesConRutas.push({...viaje,rutas:JSON.stringify(rutas)});
      }));
    return res.status(OK).send(viajesConRutas);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener los viajes'); 
  }
} catch (error) {
  return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
}
  
  
});


/******************************************************************************
 *                      Get All Viajes de Usuario (SOLICITANTE) especifico - "GET /:id_usuario"
 ******************************************************************************/
router.get('/misviajes/solicitante/:id_usuario', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);

    let viajesConRutas = [];
    const viajes = await req.context.models.Viaje.findAll({
      where: {id_solicitante: req.params.id_usuario},
      order: 
      [
        ['id', 'ASC'],
      ],
        raw:true
      });

      await Promise.all(viajes.map(async (viaje)=>{
        let rutas = await req.context.models.Ruta.findAll({
          where: {
            id_viaje: viaje.id,
          },
          raw:true
        });
        viajesConRutas.push({...viaje,rutas:JSON.stringify(rutas)});
      }));
    return res.status(OK).send(viajesConRutas);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener los viajes'); 
  }
  
});

/******************************************************************************
 *                      Get All Viajes de Usuario (DIRECTOR) especifico - "GET /:id_usuario"
 ******************************************************************************/
router.get('/misviajes/director/:id_usuario', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);
    
    let viajesConRutas = [];
    const viajes = await req.context.models.Viaje.findAll({
      where: {id_director: req.params.id_usuario},
      order: 
      [
        ['id', 'ASC'],
      ],
        raw:true
      });

      await Promise.all(viajes.map(async (viaje)=>{
        let rutas = await req.context.models.Ruta.findAll({
          where: {
            id_viaje: viaje.id,
          },
          raw:true
        });
        viajesConRutas.push({...viaje,rutas:JSON.stringify(rutas)});
      }));
    return res.status(OK).send(viajesConRutas);
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

    let viajeConRutas = [];
    const viaje = await req.context.models.Viaje.findOne(
      {where: {id: req.params.viaje_id}}
    );

      let rutas = await req.context.models.Ruta.findAll({
        where: {
          id_viaje: viaje.id,
        },
        raw:true
      });
      viajeConRutas.push({...viaje,rutas:JSON.stringify(rutas)});
    return res.status(OK).send(viajeConRutas);
    
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener el viaje'); 
  }
  
});

/******************************************************************************
 *                      Create viaje - "POST /"
 ******************************************************************************/

router.post('/', async (req, res) => {
    try {
      jwt.verify(extractToken(req),process.env.SECRET);
      const t = await sequelize.transaction();
      try {
          const { viaje } = req.body;
          let viaje_creado = await req.context.models.Viaje.create(
              {
                id_estatus: viaje.id_estatus || null,
                id_solicitante: viaje.id_solicitante || null,
                id_director: viaje.id_director || null,
              }
          );
          
          if (viaje.id_director) {
            //Notificar a Director
            const correoDirector = await req.context.models.User.findOne({where: {id: viaje.id_director}});
            let body = 
            `<h3>Estimado Director</h3><br>
            
            Se ha ingresado una nueva solicitud de viaje.<br><br><br><br>
            
            Saludos cordiales,<br><br><br>
            
            Victor Morales`;

            enviarNotificacion(process.env.MAILACCOUNT,correoDirector.dataValues.username,"Solicitud de viaje",body);
          }
          //Agregar rutas de viaje a tabla RUTAS
          viaje.rutas.map((ruta)=>req.context.models.Ruta.create({...ruta, id_viaje:viaje_creado.dataValues.id}))

          await t.commit();

          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} creo un nuevo viaje`);

          return res.status(OK).json('Viaje creado exitosamente.');
          
          //logger.info(`Viaje creada por: ${viaje.username}`)
    
      } catch (error) {
        await t.rollback();
        logger.error(`Error al crear viaje`, error);
        return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un viaje.');
      }
    } catch (error) {
      return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
    }
      
  });

  /******************************************************************************
 *                      UPDATE viaje - "PUT /"
 ******************************************************************************/

router.put('/', async (req, res) => {
  try {
    jwt.verify(extractToken(req),process.env.SECRET);
    const { viaje } = req.body;

    if (viaje.eliminado) {
      try {
        await req.context.models.Viaje.update(
          {
            eliminado: viaje.eliminado || true,
          },
          {
              returning: true, where: { id: viaje.id } 
          }
        );
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} elimino un nuevo viaje con id: ${viaje.id}`);

        return res.status(OK).json('Viaje eliminado exitosamente.');
      } catch (error) {
        return res.status(BAD_REQUEST).json('Ha ocurrido un error al eliminar un viaje.');
      }
        
    } else {
      try {
        const verificarViaje = await req.context.models.Viaje.findOne({
          where: {
            id: viaje.id,
          },
          raw:true
        });
  
        if (verificarViaje) {
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          switch (viaje.id_estatus) {
            //APROBAR viaje por DIRECTOR
            case 1:
                await req.context.models.Viaje.update(
                    {
                      id_estatus: viaje.id_estatus || 0,
                    },
                    {
                        returning: true, where: { id: viaje.id } 
                    }
                );
                await logAccion(req, `Director con usuario: ${decodedToken.username} aprobo el viaje con id: ${viaje.id}`);

                return res.status(OK).json('Viaje actualizado exitosamente.');
            //ASIGNAR CONDUCTORES A CADA RUTA por ADMIN
            case 2:
                const t = await sequelize.transaction();
                try {
                  await req.context.models.Viaje.update(
                      {
                        id_estatus: viaje.id_estatus || null,
                      },
                      {
                          returning: true, where: { id: viaje.id } 
                      }
                  );
                  //Agregar rutas de viaje que ya contienen CONDUCTOR
                  await viaje.rutas.map((ruta)=>req.context.models.Ruta.update({ id_conductor: ruta.id_conductor},{returning: true, where: { id: ruta.id } }));

                  await logAccion(req, `Administrador con usuario: ${decodedToken.username} asigno pilotos al viaje con id: ${viaje.id}`);

                  return res.status(OK).json('Viaje actualizado exitosamente.');
                  
                } catch (error) {
                  await t.rollback();
                  return res.status(BAD_REQUEST).json('Ha ocurrido un error al actualizar el viaje.');
                }
            
                //INICIAR viaje por ADMIN
            case 3:
              await req.context.models.Viaje.update(
                {
                  id_estatus: viaje.id_estatus || 0,
                },
                {
                    returning: true, where: { id: viaje.id } 
                }
              );

              await logAccion(req, `Administrador con usuario: ${decodedToken.username} inicio el viaje con id: ${viaje.id}`);

              return res.status(OK).json('Viaje actualizado exitosamente.');
  
            //COMPLETAR viaje por ADMIN
            case 4:
              await req.context.models.Viaje.update(
                {
                  id_estatus: viaje.id_estatus || 0,
                },
                {
                    returning: true, where: { id: viaje.id } 
                }
              );
              
              await logAccion(req, `Administrador con usuario: ${decodedToken.username} colocó en completado el viaje con id: ${viaje.id}`);

              return res.status(OK).json('Viaje actualizado exitosamente.');
  
            //DENEGAR por Director(Status negativo)
            default:
  
              await req.context.models.Viaje.update(
                {
                  id_estatus: -1,
                },
                {
                    returning: true, where: { id: viaje.id } 
                }
            );
            
            await logAccion(req, `Director con usuario: ${decodedToken.username} desaprobo el viaje con id: ${viaje.id}`);

            return res.status(OK).json('Viaje denegado exitosamente.');
          }
        }else{
          return res.status(BAD_REQUEST).json('Error, viaje no encontrado para actualizar');
        }
        //logger.info(`Viaje creada por: ${viaje.username}`)
  
      } catch (error) {
          logger.error(`Error al crear viaje`, error);
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al actualizar un viaje.');
        }
    }
    
    } catch (error) {
      return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
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

const logAccion = async (req, descripcion)=>{
  try {
    await req.context.models.Log.create(
      {
        descripcion
      }
    );
    return 'Log creado con exito'
    
  } catch (error) {
    return 'Ha ocurrido un error al crear un log.';
  }
};
export default router;