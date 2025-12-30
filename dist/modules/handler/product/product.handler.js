"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = __importDefault(require("../../repository/product/product.repository"));
const nodemailer_1 = require("../../../middleware/nodemailer");
const booking_repository_1 = __importDefault(require("../../repository/booking/booking.repository"));
const productRepo = new product_repository_1.default();
const mailService = new nodemailer_1.MailService();
const bookingRepo = new booking_repository_1.default();
class ProductHandler {
    async CreateOrder(customer, item, total, subtotal) {
        try {
            // Create order
            const response = await productRepo.orderProduct(customer, item, total, subtotal);
            if (!response) {
                throw new Error("Order creation failed");
            }
            // Prepare email content
            const subject = "Your order has been updated";
            const html = `
                <h3>Order Updated</h3>
                <p>Dear ${customer.name ?? "Customer"},</p>
                <p>Your Order with Lumora Tour and Travel has been updated.</p>
                <ul> 
                    <li>Product Name: ${item.map((i) => i.name).join(", ")} X ${item.map((i) => i.quantity).join(", ")}</li>
                    <li>Total: ${total}</li>
                    <li>Quantity: ${subtotal}</li>
                </ul>
                <p>Thank you for ordering with us.</p>
            `;
            // Send email
            await mailService.sendMail("info@lumorabhutan.com", customer.email, subject, html);
            return { success: true, message: "Order created and email sent", data: response };
        }
        catch (error) {
            console.error("Error creating order:", error.message || error);
            return { success: false, message: error.message || "Failed to create order" };
        }
    }
    async UpdateOrder(id, updateData) {
        try {
            const customer = {
                name: updateData.name,
                email: updateData.email || "",
                phone: updateData.phone,
                status: updateData.status,
            };
            const response = await productRepo.updateOrder(Number(id), customer, updateData.items, // can be undefined
            updateData.subtotal, // can be undefined
            updateData.total // can be undefined
            );
            if (!response) {
                throw new Error("Order update failed");
            }
            const subject = "Your order has been Confirmed";
            const html = `
                <h3>Order Updated</h3>
                <p>Dear ${customer.name ?? "Customer"},</p>
                <p>Your Order with Lumora Tour and Travel has been Confirmed.</p>
                <ul> 
                    <li>Product Name: ${updateData.items?.map((i) => i.name).join(", ")} X ${updateData.items?.map((i) => i.quantity).join(", ")}</li>
                    <li>Total: ${updateData.total}</li>
                    <li>Quantity: ${updateData.subtotal}</li>
                </ul>
                <p>Thank you for ordering with us.</p>
            `;
            // Send email
            await mailService.sendMail("bookings@travelagent.com", customer.email, subject, html);
            return { success: true, message: "Order updated successfully", data: response };
        }
        catch (error) {
            return { success: false, message: error.message || "Failed to update order" };
        }
    }
}
exports.default = ProductHandler;
//# sourceMappingURL=product.handler.js.map