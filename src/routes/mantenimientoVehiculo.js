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
    jwt.verify(extractToken(req),process.env.SECRET);

    const mantenimientos = await req.context.models.MantenimientoVehiculo.findAll({
      where: {vehiculoId: req.params.vehiculoId},
      order: 
      [
        ['id', 'ASC'],
      ],
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
    jwt.verify(extractToken(req),process.env.SECRET);

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
        
        //Verifico si dentro de mantenimiento viene un id
        if (mantenimiento.id !== undefined && mantenimiento.id !== null && mantenimiento.id !== '' ) {
        
        const verificarMantenimiento = await req.context.models.MantenimientoVehiculo.findOne({
            where: {
            id: mantenimiento.id,
            },
            raw:true
        });

        if (verificarMantenimiento) {
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
        return res.status(OK).json('Mantenimiento actualizado exitosamente.');
        }else{
        await req.context.models.MantenimientoVehiculo.create(
            {
                descripcion: mantenimiento.descripcion || null,
                lugar: mantenimiento.lugar || null,
                fecha: mantenimiento.fecha || null,
                vehiculoId: mantenimiento.vehiculoId || null,
            }
        );

        return res.status(OK).json('Mantenimiento creado exitosamente.');
        }
        }else{

        await req.context.models.MantenimientoVehiculo.create(
            {
                descripcion: mantenimiento.descripcion || null,
                lugar: mantenimiento.lugar || null,
                fecha: mantenimiento.fecha || null,
                vehiculoId: mantenimiento.vehiculoId || null,
            }
        );
        return res.status(OK).json('Mantenimiento creado exitosamente.');
        }
        //logger.info(`Mantenimiento creada por: ${mantenimiento.username}`)
  
    } catch (error) {
      logger.error(`Error al crear mantenimiento`, error);
      return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un mantenimiento.');
    }
  });

export default router;