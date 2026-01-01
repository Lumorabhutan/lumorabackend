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
const customerHtml = `
  <h3>Booking Received</h3>

  <p>Dear ${bookingData.name ?? "Customer"},</p>

  <p>
    Thank you for booking with <strong>Lumora Tour and Travel</strong>.
    Your booking has been successfully received and is currently
    <strong>pending confirmation</strong>.
  </p>

  <ul>
    <li><strong>Start Date:</strong> ${bookingData.travelStartDate}</li>
    <li><strong>End Date:</strong> ${bookingData.travelEndDate}</li>
    <li><strong>Travelers:</strong> ${bookingData.numTravelers}</li>
    <li><strong>Status:</strong> Pending</li>
  </ul>

  <p>
    We will notify you once your booking is confirmed.
  </p>

  <p>
    Regards,<br />
    <strong>Lumora Tour and Travel</strong>
  </p>
`;

 const adminHtml = `
  <h3>New Booking Created</h3>

  <p>Hello Team,</p>

  <p>
    A new booking has been created and is awaiting confirmation.
    Please review the details below:
  </p>

  <ul>
    <li><strong>Customer Name:</strong> ${bookingData.name ?? "N/A"}</li>
    <li><strong>Start Date:</strong> ${bookingData.travelStartDate}</li>
    <li><strong>End Date:</strong> ${bookingData.travelEndDate}</li>
    <li><strong>Travelers:</strong> ${bookingData.numTravelers}</li>
    <li><strong>Status:</strong> Pending</li>
  </ul>

  <p>
    Please take the necessary action to confirm or update the booking.
  </p>

  <p>
    System Notification<br />
    <strong>Lumora Tour and Travel</strong>
  </p>
`;


  // Send confirmation to customer
  await mailService.sendMail(
    bookingData.email,        // recipient
    subject,                  // subject
    customerHtml,                     // HTML content
    "info@lumorabhutan.com"   // sender
  );

  // Optional: send notification to admin
  await mailService.sendMail(
    "info@lumorabhutan.com",  // recipient (admin)
    `New booking from ${bookingData.name ?? "Customer"}`, // subject
    adminHtml,                     // same content
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
