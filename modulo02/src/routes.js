import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserControle from './app/controllers/UserControle';
import Session from './app/controllers/SessionControle';
import FileControle from './app/controllers/FileControler';
import ProviderControler from './app/controllers/ProviderControler';
import authMiddleware from './app/middlewares/auth';
import AppointmentsControler from './app/controllers/AppointmentsControler';
import ScheduleControler from './app/controllers/ScheduleControler';
import NotificationContorler from './app/controllers/NotificationControler';
import AvailableControler from './app/controllers/AvailableControler';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserControle.store);
routes.post('/sessions', Session.store);
routes.use(authMiddleware);
routes.put('/users', UserControle.update);

routes.get('/providers', ProviderControler.index);
routes.get('/providers/:provideId/available', AvailableControler.index);

routes.get('/appointments', AppointmentsControler.index);
routes.post('/appointments', AppointmentsControler.store);
routes.delete('/appointments/:id', AppointmentsControler.delete);

routes.get('/schedule', ScheduleControler.index);

routes.post('/files', upload.single('file'), FileControle.store);

routes.put('/notification/:id', NotificationContorler.update);
routes.get('/notification', NotificationContorler.index);

export default routes;
