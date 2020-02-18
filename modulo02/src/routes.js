import { Router } from 'express';

import UserControle from './app/controllers/UserControle';
import Session from './app/controllers/SessionControle';

const routes = new Router();

routes.post('/users', UserControle.store);
routes.post('/sessions', Session.store);

export default routes;
