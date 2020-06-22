import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointments';
import User from '../models/User';

class ScheduleController {
    async index(req, res) {
        const checkuserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });
        if (!checkuserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const { date } = req.query;
        const pasrsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(pasrsedDate),
                        endOfDay(pasrsedDate),
                    ],
                },
            },
            order: ['date'],
        });

        return res.json(appointments);
    }
}
export default new ScheduleController();
