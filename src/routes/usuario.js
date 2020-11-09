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
      order: [
        ['id', 'ASC'],
      ],
      attributes:['id','username','nombre','apellido','edad','dpi','rol','titulo'],
      where:{
        eliminado: false,
      },
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
        username: email,
        eliminado: false,
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
    const { username, password, nombre, apellido, edad, dpi, rol, titulo } = req.body;
    const buscarUsuario = await req.context.models.User.findOne({
      attributes:['username'],
        where: {
          username,
        },
        raw:true
      }
    );
    if (buscarUsuario){
      return res.status(OK).json({
        status:BAD_REQUEST,
        success: false,
        err: 'El nombre usuario ya esta en uso, seleccione uno diferente'
      });
    }else {
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
            titulo,
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
  try{
    jwt.verify(extractToken(req),process.env.SECRET);
    const { username, password, nombre, apellido, edad, dpi, rol, eliminado, titulo } = req.body;

    console.log(eliminado)
    if (eliminado) {
      try {
        await req.context.models.User.update(
          {
            eliminado
          },{
              returning: true, where: { username } 
            }
        );
        const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
        await logAccion(req, `Usuario: ${decodedToken.username} elimino el usuario ${username}`);
        return res.status(OK).json('Usuario eliminado con exito');
      } catch (error) {
        return res.status(OK).json('Ha ocurrido un error al eliminar un usuario.');
      }
      
    } else {
        if (password !== '') {
          try {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds,async (err, hash) => {
            await req.context.models.User.update(
                {
                  username,
                  password: hash,
                  nombre,
                  apellido,
                  rol,
                  edad,
                  dpi,
                  titulo,
                },{
                    returning: true, where: { username } 
                  }
              );
            });
            const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
            await logAccion(req, `Usuario: ${decodedToken.username} edito informacion del usuario ${username}`);

            return res.status(OK).json('Usuario editado con exito');
          } catch (error) {
            return res.status(BAD_REQUEST).json('Ha ocurrido un error al editar un usuario.');
          }
          
      }else {
        try {
          await req.context.models.User.update(
            {
              username,
              password: hash,
              nombre,
              apellido,
              rol,
              edad,
              dpi,
              titulo,
            },{
                returning: true, where: { username } 
              }
          );

          const decodedToken = jwt.decode(extractToken(req),process.env.SECRET);
          await logAccion(req, `Usuario: ${decodedToken.username} edito informacion del usuario ${username}`);

          return res.status(OK).json('Usuario editado con exito');
          
        } catch (error) {
          return res.status(BAD_REQUEST).json('Ha ocurrido un error al editar un usuario.');
        }
    
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