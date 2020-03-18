import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointments from '../models/Appointments';
import User from '../models/user';
import File from '../models/File';
import Notification from '../schemas/Notification';
import CancelamentMail from '../jobs/CancelationMail';
import Queue from '../../lib/Queue';

class AppointmentsControle {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;
    /**
     * Check if provider is provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    // zerar os minutos da data
    const hourStart = startOfHour(parseISO(date));
    /**
     * Check for past date
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }
    /**
     * Check date availability
     */
    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointments date is not availability' });
    }

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    /**
     * Notify appointments provider
     */
    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMM', as' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });
    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointments.findByPk(req.params.id,{
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name','email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permissin to cancel this appointment" });
    } else {
      appointment.canceled_at = new Date();
      await appointment.save();
      await Queue.add(CancelamentMail.key,{
        appointment,
      });
      return res.json(appointment);
    }
    const dateWhitSub = subHours(appointment.date, 2);
    if (isBefore(dateWhitSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can omy cancel appointments 2 hours in advanced' });
    }
    const date = new Date();
  }
}
export default new AppointmentsControle();
