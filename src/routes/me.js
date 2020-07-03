import { Router } from 'express';
import decode from "jwt-decode";

const router = Router();

function extractToken (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
      return req.query.token;
  }
  return null;
}

router.get('/', async (req, res) => {
   res.json({
    status:200,
    success: true,
    message:"/me",
    info:decode(extractToken(req)),
  });
});

export default router;