import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import extractToken from '../shared/extractToken';

const router = Router();



/******************************************************************************
 *                      Get All Mantenimientos de Vehiculo especifico - "GET /"
 ******************************************************************************/
router.get('/:vehiculoId', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);

    const mantenimientos = await req.context.models.MantenimientoVehiculo.findAll({
      where: {vehiculoId: req.params.vehiculoId},
      order: 
      [
        ['id', 'ASC'],
      ],where:{
        eliminado: false,
      },
        raw:true
      });
    return res.status(OK).send(mantenimientos);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Get specific mantenimiento - "GET /:mantenimientoId"
 ******************************************************************************/
router.get('/:mantenimientoId', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);

    const mantenimiento = await req.context.models.MantenimientoVehiculo.findOne(
      {where: {id: req.params.mantenimientoId}}
    );
    return res.status(OK).send(mantenimiento);
    
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Create mantenimiento - "POST /"
 ******************************************************************************/

  router.post('/', async (req, res) => {
    try {
        jwt.verify(extractToken(req),process.env.SECRET);
        const { mantenimiento } = req.body;

        try {
          await req.context.models.MantenimientoVehiculo.create(
              {
                  descripcion: mantenimiento.descripcion || null,
                  lugar: mantenimiento.lugar || null,
                  fecha: mantenimiento.fecha || null,
                  vehiculoId: mantenimiento.vehiculoId || null,
              }
          );

          const vehiculo = await req.context.models.Vehiculo.findOne(
            {
              where: {
                id: mantenimiento.vehiculoId
              }
            }
          );
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} creo un nuevo mantenimiento para el vehiculo ${vehiculo.placa}`);
          
          return res.status(OK).json('Mantenimiento creado exitosamente.');
          
          //logger.info(`Mantenimiento creada por: ${mantenimiento.username}`)
          
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un mantenimiento.');
        }
  
    } catch (error) {
      //logger.error(`Error al crear mantenimiento`, error);
      return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
    }
  });

  /******************************************************************************
 *                      UPDATE/DELETE mantenimiento - "PUT /"
 ******************************************************************************/

  router.put('/', async (req, res) => {
    try {
      jwt.verify(extractToken(req),process.env.SECRET);
      const { mantenimiento } = req.body;

      if (mantenimiento.eliminado) {
        try {
          
          await req.context.models.MantenimientoVehiculo.update(
            {
                eliminado: mantenimiento.eliminado || true,
            },
            {
                returning: true, where: { id: mantenimiento.id } 
            }
          );

          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} elimino un mantenimiento con id: ${mantenimiento.id}`);
          return res.status(OK).json('Mantenimiento eliminado exitosamente.');
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al eliminar un mantenimiento.');
        }
      } else {
          try {
            await req.context.models.MantenimientoVehiculo.update(
                {
                    descripcion: mantenimiento.descripcion || null,
                    lugar: mantenimiento.lugar || null,
                    fecha: mantenimiento.fecha || null,
                    vehiculoId: mantenimiento.vehiculoId || null,
                },
                {
                    returning: true, where: { id: mantenimiento.id } 
                }
            );

            const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
            await logAccion(req, `Usuario: ${decodedToken.username} edito un mantenimiento con id: ${mantenimiento.id}`);
            
            return res.status(OK).json('Mantenimiento editado exitosamente.');
            //logger.info(`Mantenimiento creada por: ${mantenimiento.username}`)

        } catch (error) {
          //logger.error(`Error al crear mantenimiento`, error);
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al editar un mantenimiento.');
        }
      }
    } catch (error) {
      return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
    }
    
  });


  //Definicion funciones

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