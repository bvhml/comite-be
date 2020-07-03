import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import exjwt from 'express-jwt';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';

const jwtMW = exjwt({
  secret: 'meg the cat', algorithms: ['RS256'] 
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
          message: 'Usuario/Password no son correctos',
          user:user
        });
      }
      else{

      bcrypt.compare(password, user.password, function(err, result) {
        if(result === true){
          console.log("Valid!");
          let token = jwt.sign({ id:user.id,nombre:user.nombre,apellido:user.apellido,username: user.username }, 'meg the cat', { expiresIn: 3600 }); // Signing the token
          res.json({
            status:OK,
            success: true,
            message:"Login Correcto",
            jwt:token
          });
        }
        else {
          console.log("Usuario/Password no son correctos");
          res.status(BAD_REQUEST).json({
            status:BAD_REQUEST,
            success: false,
            token: null,
            err: 'Usuario/Password no son correctos'
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
        res.status(BAD_REQUEST).json({
          status:BAD_REQUEST,
          success: true,
          token: null,
          err: 'Ha ocurrido un error al insertar nuevo usuario'
        });
      }
      else{
        res.status(OK).json({
          status:OK,
          success: true,
          token: null,
          msg: 'Creado con exito '
        });
      }
      
      
    })
    .catch(function(err) {
      // print the error details
      res.status(BAD_REQUEST).json({
        status:BAD_REQUEST,
        success: false,
        token: null,
        err: 'El Correo ya esta en uso'
      });
      //console.log(err, request.body.email);
  });
    
  });
});
export default router;