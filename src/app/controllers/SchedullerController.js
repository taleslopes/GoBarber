import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class SchedullerController {
  async index(req, res) {
    const isUserProvider = await User.findOne({
      where: { id: req.userID, provider: true },
    });

    if (!isUserProvider) {
      return res.status(400).json({ error: 'User is not provider!' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userID,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json({ appointments });
  }
}

export default new SchedullerController();
