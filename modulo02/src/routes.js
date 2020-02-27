import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserControle from './app/controllers/UserControle';
import Session from './app/controllers/SessionControle';
import FileControle from './app/controllers/FileControler';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserControle.store);
routes.post('/sessions', Session.store);
routes.use(authMiddleware);
routes.put('/users', UserControle.update);

routes.post('/files', upload.single('file'), FileControle.store);

export default routes;
