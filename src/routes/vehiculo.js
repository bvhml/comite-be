import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import extractToken from '../shared/extractToken';

const router = Router();



/******************************************************************************
 *                      Get All Vehiculos - "GET /"
 ******************************************************************************/
router.get('/', async (req, res) => {

  try {
    jwt.verify(extractToken(req),process.env.SECRET);

    const vehiculos = await req.context.models.Vehiculo.findAll({
        raw:true
      });
    return res.status(OK).send(vehiculos);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Get specific vehiculo - "GET /:vehiculoId"
 ******************************************************************************/
router.get('/:vehiculoId', async (req, res) => {

  try {
    jwt.verify(extractToken(req),process.env.SECRET);

    const vehiculo = await req.context.models.Vehiculo.findOne(
      {where: {id: req.params.vehiculoId}}
    );
    return res.status(OK).send(vehiculo);
    
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Create Vehiculo - "POST /"
 ******************************************************************************/

router.post('/', async (req, res) => {
    try {
        jwt.verify(extractToken(req),process.env.SECRET);
        const { vehiculo } = req.body;
        
        //Verifico si dentro de vehiculo viene un id
        if (vehiculo.id !== undefined && vehiculo.id !== null && vehiculo.id !== '' ) {
        
        const verificarVehiculo = await req.context.models.Vehiculo.findOne({
            where: {
            id: vehiculo.id,
            },
            raw:true
        });

        if (verificarVehiculo) {
        await req.context.models.Vehiculo.update(
            {
                placa: vehiculo.placa || null,
                modelo: vehiculo.modelo || null,
                linea: vehiculo.linea || null,
                tipo: vehiculo.tipo || null,
                chasis: vehiculo.chasis || null,
                marca: vehiculo.marca || null,
                tamaño_motor: vehiculo.tamaño_motor || null,
                cant_cilindros: vehiculo.cant_cilindros || null,
                toneladas: vehiculo.toneladas || null,
                transmision: vehiculo.transmision || null,
                asientos: vehiculo.asientos || null,
                color: vehiculo.color || null,
            },
            {
                returning: true, where: { id: vehiculo.id } 
            }
        );
        return res.status(OK).json('Vehiculo actualizado exitosamente.');
        }else{
        await req.context.models.Vehiculo.create(
            {
                placa: vehiculo.placa || null,
                modelo: vehiculo.modelo || null,
                linea: vehiculo.linea || null,
                tipo: vehiculo.tipo || null,
                chasis: vehiculo.chasis || null,
                marca: vehiculo.marca || null,
                tamaño_motor: vehiculo.tamaño_motor || null,
                cant_cilindros: vehiculo.cant_cilindros || null,
                toneladas: vehiculo.toneladas || null,
                transmision: vehiculo.transmision || null,
                asientos: vehiculo.asientos || null,
                color: vehiculo.color || null,
            }
        );

        return res.status(OK).json('Vehiculo creado exitosamente.');
        }
        }else{

        await req.context.models.Vehiculo.create(
            {
                placa: vehiculo.placa || null,
                modelo: vehiculo.modelo || null,
                linea: vehiculo.linea || null,
                tipo: vehiculo.tipo || null,
                chasis: vehiculo.chasis || null,
                marca: vehiculo.marca || null,
                tamaño_motor: vehiculo.tamaño_motor || null,
                cant_cilindros: vehiculo.cant_cilindros || null,
                toneladas: vehiculo.toneladas || null,
                transmision: vehiculo.transmision || null,
                asientos: vehiculo.asientos || null,
                color: vehiculo.color || null,
            } 
        );
        return res.status(OK).json('Vehiculo creado exitosamente.');
        }
        //logger.info(`Vehiculo creada por: ${vehiculo.username}`)
  
    } catch (error) {
      logger.error(`Error al crear vehiculo`, error);
      return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un vehiculo.');
    }
  });


export default router;