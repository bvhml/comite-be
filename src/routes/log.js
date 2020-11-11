import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import extractToken from '../shared/extractToken';

const router = Router();

/******************************************************************************
 *                      Get All Logs - "GET /"
 ******************************************************************************/
router.get('/', async (req, res) => {

  try {
    //jwt.verify(extractToken(req),process.env.SECRET);

    const logs = await req.context.models.Log.findAll({
      order: [
        ['id', 'ASC'],
      ],
        raw:true
      });
    return res.status(OK).send(logs);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

export default router;