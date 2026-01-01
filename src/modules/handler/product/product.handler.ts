import { ReviewIProps, ReviewRepository } from "../../repository/review/review.repository";
import Review from "../../models/review/review.model";
import ReviewHandler from "../review/review.handler";
import ProductRepository, { Customer, Item } from "../../repository/product/product.repository";
import { MailService } from "../../../middleware/nodemailer";
import BookingRepository from "../../repository/booking/booking.repository";

const productRepo = new ProductRepository();
const mailService = new MailService();
const bookingRepo = new BookingRepository()
class ProductHandler {
 async CreateOrder(
  customer: Customer,
  item: Item[],
  total: number,
  subtotal: number
): Promise<any> {
  try {
    // Create order
    const response = await productRepo.orderProduct(
      customer,
      item,
      total,
      subtotal
    );

    if (!response) {
      throw new Error("Order creation failed");
    }

    /* --------------------------------
       EMAIL CONTENT
    -------------------------------- */

    const subject = "Your order has been received";

    const orderItemsHtml = item
      .map(
        (i) => `
          <li>
            ${i.name} — Qty: ${i.quantity} — Price:$ ${i.price}
          </li>
        `
      )
      .join("");

    /* -------- Customer Email -------- */
    const customerHtml = `
      <h3>Order Received</h3>

      <p>Dear ${customer.name ?? "Customer"},</p>

      <p>
        Thank you for placing an order with
        <strong>Lumora Tour and Travel</strong>.
        Your order has been successfully received and is currently
        <strong>pending processing</strong>.
      </p>

      <h4>Order Details</h4>
      <ul>
        ${orderItemsHtml}
      </ul>

      <p>
        <strong>Total:</strong>$ ${total}<br />
        <strong>Status:</strong> Pending
      </p>

      <p>
        We will notify you once your order is confirmed or processed.
      </p>

      <p>
        Regards,<br />
        <strong>Lumora Tour and Travel</strong>
      </p>
    `;

    /* -------- Admin Email -------- */
    const adminHtml = `
      <h3>New Order Created</h3>

      <p>Hello Team,</p>

      <p>
        A new order has been created. Please review the details below:
      </p>

      <p>
        <strong>Customer Name:</strong> ${customer.name ?? "N/A"}<br />
        <strong>Email:</strong> ${customer.email ?? "N/A"}
      </p>

      <h4>Order Items</h4>
      <ul>
        ${orderItemsHtml}
      </ul>

      <p>
        <strong>Total:</strong>$ ${total}<br />
        <strong>Status:</strong> Pending
      </p>

      <p>
        Please take the necessary action to process this order.
      </p>

      <p>
        System Notification<br />
        <strong>Lumora Tour and Travel</strong>
      </p>
    `;

    /* --------------------------------
       SEND EMAILS
    -------------------------------- */

    // Send email to customer
    await mailService.sendMail(
      customer.email,
      subject,
      customerHtml,
      "info@lumorabhutan.com"
    );

    // Send email to admin
    await mailService.sendMail(
      "info@lumorabhutan.com",
      `New order from ${customer.name ?? "Customer"}`,
      adminHtml,
      "info@lumorabhutan.com"
    );

    return response;
  } catch (error: any) {
    console.error("Error creating order:", error.message || error);
    return {
      success: false,
      message: error.message || "Failed to create order",
    };
  }
}

async UpdateOrder(
  id: string,
  updateData: {
    name: string;
    email?: string;
    phone: string;
    status: string;
    items?: Item[];
    subtotal?: number;
    total?: number;
  }
): Promise<any> {
  try {
    const customer = {
      name: updateData.name,
      email: updateData.email || "",
      phone: updateData.phone,
      status: updateData.status,
    };

    const response = await productRepo.updateOrder(
      Number(id),
      customer,
      updateData.items,
      updateData.subtotal,
      updateData.total
    );

    if (!response) {
      throw new Error("Order update failed");
    }

    /* --------------------------------
       EMAIL CONTENT
    -------------------------------- */

    const subject = `Your order has been ${updateData.status}`;

    const orderItemsHtml =
      updateData.items && updateData.items.length
        ? updateData.items
            .map(
              (i) => `
                <li>
                  ${i.name} — Qty: ${i.quantity} — Price: ${i.price}
                </li>
              `
            )
            .join("")
        : "<li>No item details available</li>";

    /* -------- Customer Email -------- */
    const customerHtml = `
      <h3>Order ${updateData.status}</h3>

      <p>Dear ${customer.name ?? "Customer"},</p>

      <p>
        Your order with <strong>Lumora Tour and Travel</strong> has been
        <strong>${updateData.status}</strong>.
      </p>

      <h4>Order Details</h4>
      <ul>
        ${orderItemsHtml}
      </ul>

      <p>
        <strong>Subtotal:</strong> ${updateData.subtotal ?? "N/A"}<br />
        <strong>Total:</strong> ${updateData.total ?? "N/A"}<br />
        <strong>Status:</strong> ${updateData.status}
      </p>

      <p>
        Thank you for choosing Lumora Tour and Travel.
      </p>

      <p>
        Regards,<br />
        <strong>Lumora Tour and Travel</strong>
      </p>
    `;

    /* -------- Admin Email (Optional) -------- */
    const adminHtml = `
      <h3>Order Updated</h3>

      <p>Hello Team,</p>

      <p>
        An order has been updated with the following details:
      </p>

      <p>
        <strong>Order ID:</strong> ${id}<br />
        <strong>Customer:</strong> ${customer.name}<br />
        <strong>Email:</strong> ${customer.email}<br />
        <strong>Status:</strong> ${updateData.status}
      </p>

      <h4>Items</h4>
      <ul>
        ${orderItemsHtml}
      </ul>

      <p>
        <strong>Subtotal:</strong> ${updateData.subtotal ?? "N/A"}<br />
        <strong>Total:</strong> ${updateData.total ?? "N/A"}
      </p>

      <p>
        System Notification<br />
        <strong>Lumora Tour and Travel</strong>
      </p>
    `;

    /* --------------------------------
       SEND EMAILS
    -------------------------------- */

    // Send email to customer
    if (customer.email) {
      await mailService.sendMail(
        customer.email,
        subject,
        customerHtml,
        "info@lumorabhutan.com"
      );
    }

    // Notify admin
    await mailService.sendMail(
      "info@lumorabhutan.com",
      `Order ${id} ${updateData.status}`,
      adminHtml,
      "info@lumorabhutan.com"
    );

    return {
      success: true,
      message: "Order updated successfully",
      data: response,
    };
  } catch (error: any) {
    console.error("Error updating order:", error.message || error);
    return {
      success: false,
      message: error.message || "Failed to update order",
    };
  }
}


}

export default ProductHandler;
