import { Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/******************************************************************************
 *                      Get All Programas - "GET /"
 ******************************************************************************/
router.get('/', async (req, res) => {

    try {
        const programas = await req.context.models.Programa.findAll({
          order: [
            ['unidadAcademica', 'ASC'],
          ],
          raw:true
        });
        return res.status(OK).json(programas);
    } catch (error) {
        logger.error(`Error al obtener todas las programas`, error);
        return res.status(BAD_REQUEST).json('Ha ocurrido un error al obtener todas las programas');
    }
  
});

/******************************************************************************
 *                      Get specific programa - "GET /:programaId"
 ******************************************************************************/

router.get('/:programaId', async (req, res) => {

  try {
    const programa = await req.context.models.Programa.findAll({
      where: {
        id: req.params.programaId,
      },
      raw:true
    });
    return res.status(OK).json(programa);
} catch (error) {
  logger.error(`Error al buscar programa laboral ${req.params.programaId}`, error);
  return res.status(BAD_REQUEST).json('Ha ocurrido un error al buscar programa laboral');
}
});

/******************************************************************************
 *                      Get specifics programa created by user - "GET /usuario/:username"
 ******************************************************************************/

router.get('/usuario/:username', async (req, res) => {

  try {
    const programa = await req.context.models.Programa.findAll({
      where: {
        username: req.params.username,
      },
      order: [
        ['unidadAcademica', 'ASC'],
      ],
      raw:true
    });
    return res.status(OK).json(programa);
} catch (error) {
  logger.error(`Error al buscar programa laboral del usuario ${req.params.username}`, error);
  return res.status(BAD_REQUEST).json('Ha ocurrido un error al buscar programa laboral');
}
});

/******************************************************************************
 *                      Update programa attributes - "PUT /:programaId"
 ******************************************************************************/

router.put('/', async (req, res) => {
  try {

    const { programa } = req.body;

    await req.context.models.Programa.update(
        {
            titulo: programa.titulo === '' ? null: programa.titulo,
            descripcion: programa.descripcion === '' ? null: programa.descripcion,
            especialidad: programa.especialidad === '' ? null: programa.especialidad,
        },
        {returning: true, where: {username: programa.username, id: programa.id } }
    );
    logger.info(`Usuario ${programa.username} actualizó datos de programa ${programa.id}`)
    return res.status(OK).json('Programa actualizada exitosamente.');

  } catch (error) {
    logger.error(`Error al actualizar programa ${req.params.username}`, error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error.');
  }
});

/******************************************************************************
 *                      Create programa - "POST /"
 ******************************************************************************/

router.post('/', async (req, res) => {
  try {
    
    const { programa, username} = req.body;

    if (programa.id !== undefined && programa.id !== null && programa.id !== '' ) {
      
      const verificarPrograma = await req.context.models.Programa.findOne({
        where: {
          id: programa.id,
        },
        raw:true
      });

    if (verificarPrograma) {
      await req.context.models.Programa.update(
        {
          nombre: programa.nombre === '' ? null: programa.nombre,
          nivel: programa.nivel === '' ? null: programa.nivel,
          tipoCiclo: programa.tipoCiclo === '' ? null: programa.tipoCiclo,
          numeroMatriculas: programa.numeroMatriculas === '' ? null: programa.numeroMatriculas,
          numeroMatriculaAlAnio: programa.numeroMatriculaAlAnio === '' ? null: programa.numeroMatriculaAlAnio,
          costoMatricula: programa.costoMatricula === '' ? null: programa.costoMatricula,
          numeroUma: programa.numeroUma === '' ? null: programa.numeroUma,
          precioUma: programa.precioUma === '' ? null: programa.precioUma,
          unidadAcademica: programa.unidadAcademica === '' ? null: programa.unidadAcademica,
          diasImpartidos: programa.diasImpartidos === '' ? null: programa.diasImpartidos,
          horario: programa.horario === '' ? null: programa.horario,
          precioCarne: programa.precioCarne === '' ? null: programa.precioCarne,
          precioServicioAdmin: programa.precioServicioAdmin === '' ? null: programa.precioServicioAdmin,
          duracionPrograma: programa.duracionPrograma === '' ? null: programa.duracionPrograma,
          dimensionalDuracion: programa.dimensionalDuracion === '' ? null: programa.dimensionalDuracion,
          modalidad: programa.modalidad === '' ? null: programa.modalidad,
          pensum: programa.pensum === '' ? null: programa.pensum,
          moneda: programa.moneda === '' ? null: programa.moneda,
          palabrasClave: programa.palabrasClave === '' ? null: programa.palabrasClave,
        },
        {returning: true, where: {username: programa.username, id: programa.id } }
      );
      return res.status(OK).json('Programa actualizado exitosamente.');
    }else{
      await req.context.models.Programa.create(
          {
              id : uuidv4(),
              nombre: programa.nombre === '' ? null: programa.nombre,
              nivel: programa.nivel === '' ? null: programa.nivel,
              tipoCiclo: programa.tipoCiclo === '' ? null: programa.tipoCiclo,
              numeroMatriculas: programa.numeroMatriculas === '' ? null: programa.numeroMatriculas,
              numeroMatriculaAlAnio: programa.numeroMatriculaAlAnio === '' ? null: programa.numeroMatriculaAlAnio,
              costoMatricula: programa.costoMatricula === '' ? null: programa.costoMatricula,
              numeroUma: programa.numeroUma === '' ? null: programa.numeroUma,
              precioUma: programa.precioUma === '' ? null: programa.precioUma,
              unidadAcademica: programa.unidadAcademica === '' ? null: programa.unidadAcademica,
              diasImpartidos: programa.diasImpartidos === '' ? null: programa.diasImpartidos,
              horario: programa.horario === '' ? null: programa.horario,
              precioCarne: programa.precioCarne === '' ? null: programa.precioCarne,
              precioServicioAdmin: programa.precioServicioAdmin === '' ? null: programa.precioServicioAdmin,
              duracionPrograma: programa.duracionPrograma === '' ? null: programa.duracionPrograma,
              dimensionalDuracion: programa.dimensionalDuracion === '' ? null: programa.dimensionalDuracion,
              modalidad: programa.modalidad === '' ? null: programa.modalidad,
              pensum: programa.pensum === '' ? null: programa.pensum,
              moneda: programa.moneda === '' ? null: programa.moneda,
              palabrasClave: programa.palabrasClave === '' ? null: programa.palabrasClave,
              username: username,

          }
      );

    return res.status(OK).json('Programa creado exitosamente.');
      }
    }else{

      await req.context.models.Programa.create(
        {
            id : uuidv4(),
            nombre: programa.nombre === '' ? null: programa.nombre,
            nivel: programa.nivel === '' ? null: programa.nivel,
            tipoCiclo: programa.tipoCiclo === '' ? null: programa.tipoCiclo,
            numeroMatriculas: programa.numeroMatriculas === '' ? null: programa.numeroMatriculas,
            numeroMatriculaAlAnio: programa.numeroMatriculaAlAnio === '' ? null: programa.numeroMatriculaAlAnio,
            costoMatricula: programa.costoMatricula === '' ? null: programa.costoMatricula,
            numeroUma: programa.numeroUma === '' ? null: programa.numeroUma,
            precioUma: programa.precioUma === '' ? null: programa.precioUma,
            unidadAcademica: programa.unidadAcademica === '' ? null: programa.unidadAcademica,
            diasImpartidos: programa.diasImpartidos === '' ? null: programa.diasImpartidos,
            horario: programa.horario === '' ? null: programa.horario,
            precioCarne: programa.precioCarne === '' ? null: programa.precioCarne,
            precioServicioAdmin: programa.precioServicioAdmin === '' ? null: programa.precioServicioAdmin,
            duracionPrograma: programa.duracionPrograma === '' ? null: programa.duracionPrograma,
            dimensionalDuracion: programa.dimensionalDuracion === '' ? null: programa.dimensionalDuracion,
            modalidad: programa.modalidad === '' ? null: programa.modalidad,
            username: username,

        }
        
    );
    return res.status(OK).json('Programa creado exitosamente.');
    }
    //logger.info(`Programa creada por: ${programa.username}`)

  } catch (error) {
    logger.error(`Error al crear programa`, error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al crear una programa.');
  }
});

/******************************************************************************
 *                      UPLOAD FILE ATTACHMENT- "POST /"
 ******************************************************************************/

router.post('/upload/attachment', async (request, response) => {
  try {
    const form = new multiparty.Form();
      form.parse(request, async (error, fields, files) => {
        try {
          const path = files.files[0].path;
          const buffer = fs.readFileSync(path);
          const type = await fileType.fromBuffer(buffer);
          const timestamp = Date.now().toString();
          const fileName = `${timestamp}-lg`;
          const data = await uploadFile(buffer, fileName, type);
          return response.status(OK).send(data);
        } catch (error) {
          return response.status(BAD_REQUEST).send(error);
        }
    });

  } catch (error) {
    logger.error(`Error al subir archivo`, error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al subir archivo.');
  }
});

/******************************************************************************
 *                      Delete programa - "DELETE /"
 ******************************************************************************/

router.delete('/eliminar/:programaId', async (req, res) => {
  try {
    
    const programaId  = req.params.programaId;
    await req.context.models.Programa.destroy({
      where: {
        id: programaId
      }
    });
    //logger.info(`Programa creada por: ${programa.username}`)
    return res.status(OK).json('Programa eliminada exitosamente.');

  } catch (error) {
    logger.error(`Error al eliminar programa`, error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error al eliminar una programa.');
  }
});


export default router;