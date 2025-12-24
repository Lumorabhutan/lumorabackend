"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_repository_1 = __importDefault(require("../../repository/booking/booking.repository"));
const nodemailer_1 = require("../../../middleware/nodemailer");
const bookingRepo = new booking_repository_1.default();
const mailService = new nodemailer_1.MailService();
class BookingHandler {
    async createBooking(bookingData) {
        const booking = await bookingRepo.create(bookingData);
        if (!booking)
            throw new Error("Booking not found");
        const subject = "Your booking has been created";
        const html = `
      <h3>Booking Created</h3>
      <p>Dear ${bookingData.name ?? "Customer"},</p>
      <p>Your booking with  (Lumora Tour and Travel) has been created. Please wait until booking get confirm from Lumora tour and Travel</p>
      <ul>
        <li>Start Date: ${bookingData.travelStartDate}</li>
        <li>End Date: ${bookingData.travelEndDate}</li>
        <li>Status: Pending</li>
        <li>Travelers: ${bookingData.numTravelers}</li>
      </ul>
      <p>Thank you for booking with us.</p>
    `;
        // send email; rethrow if fails or handle as needed
        await mailService.sendMail("info@lumorabhutan.com", bookingData?.email, subject, html);
        await mailService.sendMail(bookingData?.email, "info@lumorabhutan.com", subject, html);
        return booking;
    }
    async getBookingById(bookingId) {
        return await bookingRepo.findById(bookingId);
    }
    /**
     * Update booking and send an email to the booking.email
     * Accepts partial updates.
     */
    async updateBooking(bookingId, bookingData) {
        const booking = await bookingRepo.update(bookingId, bookingData);
        if (!booking)
            throw new Error("Booking not found");
        const subject = "Your booking has been updated";
        const html = `
      <h3>Booking Updated</h3>
      <p>Dear ${bookingData.name ?? "Customer"},</p>
      <p>Your booking with  (Lumora Tour and Travel) has been ${bookingData.status}.</p>
      <ul>
        <li>Start Date: ${bookingData.travelStartDate}</li>
        <li>End Date: ${bookingData.travelEndDate}</li>
        <li>Status: ${bookingData.status}</li>
        <li>Travelers: ${bookingData.numTravelers}</li>
      </ul>
      <p>Remarks: ${bookingData.remarks ?? "None"}</p>
      <p>Thank you for booking with us.</p>
    `;
        const bookingmail = bookingData.email ? 'info@lumorabhutan.com' : booking.email;
        // send email; rethrow if fails or handle as needed
        await mailService.sendMail("info@lumorabhutan.com", bookingmail, subject, html);
        return booking;
    }
    async deleteBooking(bookingId) {
        return await bookingRepo.delete(bookingId);
    }
    async getAllBookings() {
        return await bookingRepo.findAll();
    }
    async getBookingByEmail(email) {
        return await bookingRepo.findByEmail(email);
    }
}
exports.default = BookingHandler;
//# sourceMappingURL=booking.handler.js.map