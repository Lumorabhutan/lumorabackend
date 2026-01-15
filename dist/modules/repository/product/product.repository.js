"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../../models/product/product.model"));
const order_mode_1 = __importDefault(require("../../models/product/order.mode"));
const OrderItem_model_1 = __importDefault(require("../../models/product/OrderItem.model"));
// === REPOSITORY ===
class ProductRepository {
    // CREATE
    async create(data, transaction) {
        return await product_model_1.default.create(data, { transaction });
        // final_price is auto-filled by hook
    }
    // GET ALL with pagination + search
    async findAll(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const offset = (page - 1) * limit;
        const where = {};
        if (search) {
            where.category = {
                [require("sequelize").Op.iLike]: `%${search}%`,
            };
        }
        return await product_model_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            attributes: { exclude: ["updatedAt"] },
        });
    }
    // GET ONE BY ID
    async findById(id) {
        return await product_model_1.default.findByPk(id, {
            attributes: { exclude: ["updatedAt"] },
        });
    }
    // UPDATE
    async update(id, data, transaction) {
        const product = await this.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        // Ensure images is an array if provided
        if (data.images) {
            data.images = Array.isArray(data.images) ? data.images : [];
        }
        // Update product
        await product.update(data, { transaction });
        await product.reload();
        // Make sure images returned as array
        const updatedProduct = product.toJSON();
        updatedProduct.images = Array.isArray(updatedProduct.images) ? updatedProduct.images : [];
        return updatedProduct;
    }
    // DELETE
    async delete(id, transaction) {
        const product = await this.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        await product.destroy({ transaction });
        return product;
    }
    // FIND BY NAME
    async findByName(product_name) {
        return await product_model_1.default.findOne({
            where: { product_name },
        });
    }
    // BULK DELETE
    async deleteMany(ids, transaction) {
        return await product_model_1.default.destroy({
            where: { id: ids },
            transaction,
        });
    }
    async orderProduct(customer, items, subtotal, total) {
        try {
            const order = await order_mode_1.default.create({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                status: customer.status,
                subtotal,
                total,
                items: items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }, { include: [{ model: OrderItem_model_1.default, as: "items" }] });
            return order;
        }
        catch (error) {
            console.error("Failed to create order:", error);
            throw error;
        }
    }
    async updateOrder(orderId, customer, items, subtotal, total) {
        try {
            // 1. Find the existing order
            const order = await order_mode_1.default.findByPk(orderId, {
                include: [{ model: OrderItem_model_1.default, as: "items" }],
            });
            if (!order) {
                throw new Error("Order not found");
            }
            // 2. Update main order fields (only fields provided)
            await order.update({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                status: customer.status,
                ...(subtotal !== undefined && { subtotal }),
                ...(total !== undefined && { total }),
            });
            // 3. Handle associated items if provided
            if (items && items.length > 0) {
                // Delete existing items
                await OrderItem_model_1.default.destroy({ where: { orderId: order?.dataValues.id } });
                // Add new items
                const orderItems = items.map((item) => ({
                    orderId: orderId,
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                }));
                const createdItems = await OrderItem_model_1.default.bulkCreate(orderItems, { returning: true });
                return createdItems;
            }
            // 4. Return the updated order with items
            const updatedOrder = await order_mode_1.default.findByPk(order.id, {
                include: [{ model: OrderItem_model_1.default, as: "items" }],
            });
            return updatedOrder;
        }
        catch (error) {
            console.error("Failed to update order:", error);
            throw error;
        }
    }
    async getAllOrders() {
        try {
            const orders = await order_mode_1.default.findAll({
                include: [
                    {
                        model: OrderItem_model_1.default,
                        as: "items",
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            return orders;
        }
        catch (error) {
            console.error("Failed to fetch orders:", error);
            throw error;
        }
    }
}
exports.default = ProductRepository;
//# sourceMappingURL=product.repository.js.map