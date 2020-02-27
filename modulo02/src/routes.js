import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserControle from './app/controllers/UserControle';
import Session from './app/controllers/SessionControle';
import FileControle from './app/controllers/FileControler';
import ProviderControler from './app/controllers/ProviderControler';
import authMiddleware from './app/middlewares/auth';
import AppointmentsControler from './app/controllers/AppointmentsControler';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserControle.store);
routes.post('/sessions', Session.store);
routes.use(authMiddleware);
routes.put('/users', UserControle.update);

routes.get('/providers', ProviderControler.index);

routes.post('/appointments', AppointmentsControler.store);

routes.post('/files', upload.single('file'), FileControle.store);

export default routes;
