"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_model_1 = __importDefault(require("../../models/booking/booking.model"));
class BookingRepository {
    // Booking repository methods here
    async create(bookingData) {
        // Implementation for creating a booking
        const booking = await booking_model_1.default.create(bookingData);
        return booking;
    }
    async findById(bookingId) {
        const booking = await booking_model_1.default.findByPk(bookingId);
        return booking;
    }
    async findByEmail(email) {
        const booking = await booking_model_1.default.findOne({ where: { email } });
        return booking;
    }
    async update(bookingId, bookingData) {
        const booking = await booking_model_1.default.findByPk(bookingId);
        if (booking) {
            await booking.update(bookingData);
            return booking;
        }
        return null;
    }
    async delete(bookingId) {
        const booking = await booking_model_1.default.findByPk(bookingId);
        if (booking) {
            await booking.destroy();
            return true;
        }
        return false;
    }
    async findAll() {
        const bookings = await booking_model_1.default.findAll({
            order: [['createdAt', 'DESC']],
        });
        return bookings;
    }
}
exports.default = BookingRepository;
//# sourceMappingURL=booking.repository.js.map