import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import mailConfig from '../config/mail';
import nodemailerbs from 'nodemailer-express-handlebars';

class Mail {
    constructor() {
      const  {host , port, secure, auth} = mailConfig;
      this.tranporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: auth.user ? auth : null,
      });
      this.configureTemplates();
    }
    configureTemplates() {
      const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
      this.tranporter.use('compile',nodemailerbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath,'layouts'),
          partialsDir: resolve(viewPath,'partials'),
          defaultLayout: 'default',
          extname: '.hbs'
        }),
        viewPath,
        extName: '.hbs',
      }))
    }
    sendMail(message) {
      console.log(mailConfig.default)
      return this.tranporter.sendMail({
        ...mailConfig.default,
        ...message,
      });
    }
    }

export default new Mail();
