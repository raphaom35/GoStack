import { Router } from 'express';

import UserControle from './app/controllers/UserControle';
import Session from './app/controllers/SessionControle';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserControle.store);
routes.post('/sessions', Session.store);
routes.use(authMiddleware);
routes.put('/users', UserControle.update);

export default routes;
