import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import exjwt from 'express-jwt';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';

const jwtMW = exjwt({
  secret: process.env.SECRET, algorithms: ['RS256'] 
  });

const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /"
 ******************************************************************************/
router.get('/', async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.status(OK).send(users);
});

/******************************************************************************
 *                      Get specific user - "GET /:userId"
 ******************************************************************************/
router.get('/:userId', async (req, res) => {
  const user = await req.context.models.User.findByPk(
    req.params.userId,
  );
  return res.status(OK).send(user);
});

/******************************************************************************
 *                      Post Login - "POST /login"
 ******************************************************************************/
router.post('/login', async (req, res) => {
  const {email,password} = req.body;
  const saltRounds = 10;
  
  bcrypt.hash(password, saltRounds,(err, hash) => {
    req.context.models.User.findOne({
      where:{
        username: email
      },
      attributes: ['id','username','password','nombre','apellido']
    }).then((user) => {
      
      if (user === null) {
        res.status(BAD_REQUEST).json({
          status:BAD_REQUEST,
          success: false,
          token: null,
          message: 'Usuario ó Password no son correctos',
          user:user
        });
      }
      else{

      bcrypt.compare(password, user.password, function(err, result) {
        if(result === true){
          let token = jwt.sign({ id:user.id,nombre:user.nombre,apellido:user.apellido,username: user.username }, process.env.SECRET, { expiresIn: 3600 }); // Signing the token
          res.json({
            status:OK,
            success: true,
            message:"Login Correcto",
            jwt:token
          });
        }
        else {
          res.status(BAD_REQUEST).json({
            status:BAD_REQUEST,
            success: false,
            token: null,
            err: 'Usuario ó Contraseña no son correctos'
          });
        }
      });
    }
    })
  


    
  });
});

/******************************************************************************
 *                      Post SignUp - "POST /register"
 ******************************************************************************/
router.post('/register', async (req, res) => {
  const {email,password,nombre,apellido} = req.body;
  const buscarUsuario = await req.context.models.User.findAll({
    attributes:['username'],
      where: {
        username:email,
      },
      raw:true
    }
  );
  if (buscarUsuario.length > 0){
    return res.status(OK).json({
      status:BAD_REQUEST,
      success: false,
      token: null,
      err: 'El usuario ya esta en uso, seleccione uno diferente'
    });
  }else{
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds,(err, hash) => {
      req.context.models.User.create(
        {
          username: email,
          password: hash,
          nombre:nombre,
          apellido:apellido,
        },
      ).then((user) => {
        if (user === null) {
          return res.status(BAD_REQUEST).json({
            status:BAD_REQUEST,
            success: true,
            token: null,
            err: 'Ha ocurrido un error al insertar nuevo usuario'
          });
        }
        else{
          return res.status(OK).json({
            status:OK,
            success: true,
            token: null,
            msg: 'Creado con exito '
          });
        }
        
        
      })
      .catch(function(err) {
        // print the error details
        return res.status(BAD_REQUEST).json({
          status:BAD_REQUEST,
          success: false,
          token: null,
          err: 'El Correo ya esta en uso'
        });
        //console.log(err, request.body.email);
    });
      
    });
  }
});
export default router;