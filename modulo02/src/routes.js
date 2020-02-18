import { Router } from 'express';

import User from './app/models/user';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Rahael Martins',
    email: 'rapha35om@gmail.com',
    password_hash: '123456789',
  });
  return res.json(user);
});

export default routes;
