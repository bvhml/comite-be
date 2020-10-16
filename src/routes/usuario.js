import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NO_CONTENT  } from 'http-status-codes';
import { logger } from '../shared/Logger';
import extractToken from '../shared/extractToken';
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
 *                      Get All Users - "GET /"
 ******************************************************************************/
router.get('/', async (req, res) => {

  try {
    jwt.verify(extractToken(req),process.env.SECRET);

    const users = await req.context.models.User.findAll({
      attributes:['id','username','nombre','apellido','edad','dpi','rol'],
        raw:true
      });
    return res.status(OK).send(users);
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
});

/******************************************************************************
 *                      Get specific user - "GET /:userId"
 ******************************************************************************/
router.get('/:username', async (req, res) => {

  try {
    jwt.verify(extractToken(req),process.env.SECRET);

    const user = await req.context.models.User.findOne(
      {where: {username: req.params.username}}
    );
    return res.status(OK).send(user);
    
  } catch (error) {
    logger.error(error);
    return res.status(BAD_REQUEST).json('Ha ocurrido un error'); 
  }
  
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
            jwt:token,
            user:user.username
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


  try {
    
  
  const {username,password,nombre,apellido,edad,dpi,rol} = req.body;
  const buscarUsuario = await req.context.models.User.findOne({
    attributes:['username'],
      where: {
        username:username,
      },
      raw:true
    }
  );
  if (buscarUsuario){
    return res.status(OK).json({
      status:BAD_REQUEST,
      success: false,
      err: 'El usuario ya esta en uso, seleccione uno diferente'
    });
  }else{
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds,async (err, hash) => {
      req.context.models.User.create(
        {
          username,
          password: hash,
          nombre,
          apellido,
          rol,
          edad,
          dpi,
        },
      ).then(async (user) => {
        if (user === null) {
          return res.status(BAD_REQUEST).json({
            status:BAD_REQUEST,
            success: true,
            token: null,
            err: 'Ha ocurrido un error al crear nuevo usuario'
          });
        }
        else{

          let body = `<h3>Bienvenido</h3><br><br>
            
          Tu usuario es: ${username} <br>
          y tu contraseña es: ${password} <br><br>
          
          Puedes ingresar a la pagina <a href="http://localhost:3000/">aquí</a><br><br><br>
          
          Saludos cordiales,<br><br>
          
          Victor Morales`;
          enviarNotificacion(process.env.MAILACCOUNT,username,"Bienvenido al sistema de flotillas",body);

          return res.status(OK).json({
            status:OK,
            success: true,
            msg: 'Creado con exito '
          });
        }
        
        
      })
      .catch(function(err) {
        // print the error details
        return res.status(BAD_REQUEST).json({
          status:BAD_REQUEST,
          success: false,
          err: 'El Correo ya esta en uso'
        });
    });
      
    });
  }
  } catch (error) {
      
    }
});

/******************************************************************************
 *                      PUT Edit User - "PUT /register"
 ******************************************************************************/
router.put('/register', async (req, res) => {


  try {
    
  
  const {username,password,nombre,apellido,edad,dpi,rol} = req.body;


    if (password !== '') {
      
    
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds,async (err, hash) => {
      req.context.models.User.update(
        {
          username,
          password: hash,
          nombre,
          apellido,
          rol,
          edad,
          dpi,
        },{
            returning: true, where: { username } 
           }
      );
      
    });
  }else{
    await req.context.models.User.update(
      {
        username,
        password: hash,
        nombre,
        apellido,
        rol,
        edad,
        dpi,
      },{
          returning: true, where: { username } 
         }
    );

    return res.status(OK).json('Usuario editado con exito');

  }
  
  } catch (error) {
    return res.status(BAD_REQUEST).json('Error al editar usuario');
    }
});

/******************************************************************************
 *                      Post ResetPassword - "POST /resetpassword"
 ******************************************************************************/
router.post('/resetpassword', async (req, res) => {
  const {username,password} = req.body;
  const buscarUsuario = await req.context.models.User.findOne({
      where: {
        username:username,
      },
      raw:true
    }
  );
  if (buscarUsuario){ 

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds,(err, hash) => {
      req.context.models.User.update(
        {
          password: hash,
        },
        {returning: true, where: {username: username} }   
      );
    });
    return res.status(OK).json({status:OK,message:'Contraseña cambiada existosamente'});
  }else{
    
    return res.status(OK).json({
      status:BAD_REQUEST,
      success: false,
      err: 'No existe nigun usuario con ese nombre'
    });
  }
});

/******************************************************************************
 *                      Post ResetPassword - "POST /resetmypassword"
 ******************************************************************************/
router.post('/resetmypassword', async (req, res) => {
  const { username,password } = req.body;
  const buscarUsuario = await req.context.models.User.findOne({
      where: {
        username:username,
      },
      raw:true
    }
  );
  if (buscarUsuario){ 

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds,(err, hash) => {
      req.context.models.User.update(
        {
          password: hash,
          inicio_sesion: 1,
        },
        {returning: true, where: {username: username} }   
      );
    });
    return res.status(OK).json({status:OK,message:'Contraseña cambiada existosamente'});
  }else{
    
    return res.status(OK).json({
      status:BAD_REQUEST,
      success: false,
      err: 'No existe nigun usuario con ese nombre'
    });
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