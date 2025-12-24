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
    <p>Your booking with Lumora Tour and Travel has been created. Please wait until it gets confirmed.</p>
    <ul>
      <li>Start Date: ${bookingData.travelStartDate}</li>
      <li>End Date: ${bookingData.travelEndDate}</li>
      <li>Status: Pending</li>
      <li>Travelers: ${bookingData.numTravelers}</li>
    </ul>
    <p>Thank you for booking with us.</p>
  `;

  // Send confirmation to customer
  await mailService.sendMail(
    bookingData.email,        // recipient
    subject,                  // subject
    html,                     // HTML content
    "info@lumorabhutan.com"   // sender
  );

  // Optional: send notification to admin
  await mailService.sendMail(
    "info@lumorabhutan.com",  // recipient (admin)
    `New booking from ${bookingData.name ?? "Customer"}`, // subject
    html,                     // same content
    "info@lumorabhutan.com"   // sender
  );

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
    <p>Your booking with Lumora Tour and Travel has been ${bookingData.status ?? "updated"}.</p>
    <ul>
      <li>Start Date: ${bookingData.travelStartDate ?? booking.travelStartDate}</li>
      <li>End Date: ${bookingData.travelEndDate ?? booking.travelEndDate}</li>
      <li>Status: ${bookingData.status ?? booking.status}</li>
      <li>Travelers: ${bookingData.numTravelers ?? booking.numTravelers}</li>
    </ul>
    <p>Remarks: ${bookingData.remarks ?? booking.remarks ?? "None"}</p>
    <p>Thank you for booking with us.</p>
  `;

  // Determine recipient email
  const recipientEmail = bookingData.email ?? booking.email ?? "info@lumorabhutan.com";

  // Send email to customer
  await mailService.sendMail(
    recipientEmail,      // to
    subject,             // subject
    html,                // html content
    "info@lumorabhutan.com" // from
  );

  return recipientEmail;
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
