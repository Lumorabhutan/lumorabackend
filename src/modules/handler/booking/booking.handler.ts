import BookingRepository from "../../repository/booking/booking.repository";
import Booking from "../../models/booking/booking.model";
import {MailService} from "../../../middleware/nodemailer";
const bookingRepo = new BookingRepository();
const mailService = new MailService();

export default class BookingHandler {
  async createBooking(bookingData: Booking) {
    const booking = await bookingRepo.create(bookingData);
     if (!booking) throw new Error("Booking not found");

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
    await mailService.sendMail("bookings@travelagent.com", bookingData?.email, subject, html);

    return booking;
    return booking;
  }

  async getBookingById(bookingId: number) {
    return await bookingRepo.findById(bookingId);
  }

  /**
   * Update booking and send an email to the booking.email
   * Accepts partial updates.
   */
  async updateBooking(bookingId: number, bookingData: Partial<Booking>) {
    const booking = await bookingRepo.update(bookingId, bookingData);
    if (!booking) throw new Error("Booking not found");

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
    // send email; rethrow if fails or handle as needed
    await mailService.sendMail("bookings@travelagent.com", bookingData?.email, subject, html);

    return booking;
  }

  async deleteBooking(bookingId: number) {
    return await bookingRepo.delete(bookingId);
  }

  async getAllBookings() {
    return await bookingRepo.findAll();
  }

  async getBookingByEmail(email: string) {
    return await bookingRepo.findByEmail(email);
  }
}
