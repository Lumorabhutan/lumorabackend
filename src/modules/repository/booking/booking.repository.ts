import Booking from "../../models/booking/booking.model";

export default class BookingRepository {
    // Booking repository methods here
    async create(bookingData: any) {
        // Implementation for creating a booking
        const booking = await Booking.create(bookingData);
        return booking;
    }

    async findById(bookingId: number) {
        const booking = await Booking.findByPk(bookingId);
        return booking;
    }
    async findByEmail(email: string) {
        const booking = await Booking.findOne({ where: { email } as any });
        return booking;
    }

    async update(bookingId: number, bookingData: any) {
        const booking = await Booking.findByPk(bookingId);
        if (booking) {
            await booking.update(bookingData);
            return booking;
        }
        return null;
    }

    async delete(bookingId: number) {
        const booking = await Booking.findByPk(bookingId);
        if (booking) {
            await booking.destroy();
            return true;
        }
        return false;
    }
async findAll() {
  const bookings = await Booking.findAll({
    order: [['createdAt', 'DESC']],
  });

  return bookings;
}

}

