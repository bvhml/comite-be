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
    //jwt.verify(extractToken(req),process.env.SECRET);

    const vehiculos = await req.context.models.Vehiculo.findAll({
      order: [
          ['id', 'ASC'],
        ],
      where:{
        eliminado: false,
      },
        raw:true
      });
    return res.status(OK).send(vehiculos);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Get All Vehiculos JOIN conductores (usuarios con rol=1) - "GET /"
 ******************************************************************************/
router.get('/asignados', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);
    let pilotosConVehiculos = [];
    const pilotos = await req.context.models.User.findAll(
      {
      order: [
        ['id', 'ASC'],
      ],
      where: {
          rol:1
        },
        raw:true
      });

      await Promise.all(pilotos.map(async (piloto)=>{
        let vehiculos = await req.context.models.Vehiculo.findAll({
          where: {
            piloto: piloto.id,
          },
          raw:true
        });
        pilotosConVehiculos.push({...piloto,vehiculos:JSON.stringify(vehiculos)});
      }));

    return res.status(OK).send(pilotosConVehiculos);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener los pilotos con sus vehiculos'); 
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

        try {
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
                  piloto: vehiculo.piloto || null,
              }
          );
  
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} agrego un nuevo vehiculo con placas: ${vehiculo.placa}`);

          return res.status(OK).json('Vehiculo creado exitosamente.');
          //logger.info(`Vehiculo creada por: ${vehiculo.username}`)
          
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear un vehiculo.');
        }
  
    } catch (error) {
      //logger.error(`Error al crear vehiculo`, error);
      return res.status(BAD_REQUEST).json('Ha ocurrido un error, Acceso denegado');
    }
  });

  /******************************************************************************
 *                      UPDATE/DELETE Vehiculo - "PUT /"
 ******************************************************************************/

router.put('/', async (req, res) => {
  try {
      jwt.verify(extractToken(req),process.env.SECRET);
      const { vehiculo } = req.body;
      if (vehiculo.eliminado) {
        try {
          await req.context.models.Vehiculo.update(
            {
                eliminado: vehiculo.eliminado || true
            },
            {
                returning: true, where: { id: vehiculo.id } 
            }
          );
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} elimino el vehiculo con placas: ${vehiculo.placa}`);

          return res.status(OK).json('Vehiculo eliminado exitosamente.');
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al eliminar un vehiculo.');
        }
      } else {
        try {
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
                piloto: vehiculo.piloto || null,
            },
            {
                returning: true, where: { id: vehiculo.id } 
            }
          );
          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} edito el vehiculo con placas: ${vehiculo.placa}`);

          return res.status(OK).json('Vehiculo editado exitosamente.');
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al editar un vehiculo.');
        }
      }
  } catch (error) {
    //logger.error(`Error al editar vehiculo`, error);
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