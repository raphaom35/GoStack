import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/user';
import auth from '../../config/auth';

class SessionControle {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ erro: 'User not exits' });
    }

    if (!(await user.checkPassword(password))) {

      return res.status(401).json({ erro: 'Password error' });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}
export default new SessionControle();
