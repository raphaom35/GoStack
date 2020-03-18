import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointments';

class AvailableControler {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }
    const serarchDate = Number(date);

    const appoitments = await Appointment.findaAll({
      where: {
        provider_id: req.params.provideId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(serarchDate), endOfDay(serarchDate)],
        },
      },
    });
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];
    const avaiable = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(serarchDate, hour), minute),
        0
      );
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, new Date()) &&
          !appoitments.find(a => format(a.date, 'HH:mm') === time),
      };
    });
    const oooo = appoitments.find(a => format(a.date, 'HH:mm'));
    return res.json(avaiable);
  }
}
export default new AvailableControler();
