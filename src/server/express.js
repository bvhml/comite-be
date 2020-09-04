import 'dotenv/config';
import { sequelize } from '../models';
import app from '../app';
import { logger } from '../shared/Logger';
import http from 'http';
import https from 'https';

sequelize.sync().then(async () => {
  try {
    if(process.env.HTTPS_SERVER === 'true'){
      var options = {
        key: fs.readFileSync(path.resolve('../key.pem')),
        cert: fs.readFileSync(path.resolve('../cert.pem')),
        passphrase: 'alumni'
      };
      const server = https.createServer(options, app);
      server.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
        logger.info(`HTTPS Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
      );
    }else{

      // Create HTTP server.
      const server = http.createServer(app);
      server.listen(process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT, () =>
        logger.info(`HTTP Server, Listening on port ${process.env.NODE_ENV === 'development' ? 80: process.env.EXPRESS_PORT}!`),
      );

    }
} catch (error) {
    logger.error(error);
}
});
