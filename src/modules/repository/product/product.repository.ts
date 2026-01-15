// repositories/product.repository.ts
import { Decimal } from "@prisma/client/runtime/library";
import Product from "../../models/product/product.model";
import type { Transaction, WhereOptions } from "sequelize";
import Order from "../../models/product/order.mode";
import OrderItem from "../../models/product/OrderItem.model";

// === INPUT TYPES ===
export interface CreateProductInput {
  category: string;
  product_name: string;
  original_price: number;
  discount_percent?: number; // optional
  description?: string | null;
  final_price?: string | number;
  images?: string[];
}

export interface UpdateProductInput {
  category?: string;
  product_name?: string;
  original_price?: number;
  discount_percent?: number;
  description?: string | null;
  images?: string[];
}

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
}
export interface Customer {
  name: string;
  email: string;
  phone: string;
  status: string
}

export interface Item {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
}
// === REPOSITORY ===
class ProductRepository {
  // CREATE
  async create(
    data: any,
    transaction?: Transaction
  ): Promise<Product> {
    return await Product.create(data, { transaction });
    // final_price is auto-filled by hook
  }

  // GET ALL with pagination + search
  async findAll(options: ProductQueryOptions = {}): Promise<{
    rows: Product[];
    count: number;
  }> {
    const { page = 1, limit = 10, search } = options;
    const offset = (page - 1) * limit;

    const where: WhereOptions<Product> = {};
    if (search) {
      where.category = {
        [require("sequelize").Op.iLike]: `%${search}%`,
      };
    }

    return await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["updatedAt"] },
    });
  }

  // GET ONE BY ID
  async findById(id: number): Promise<Product | null> {
    return await Product.findByPk(id, {
      attributes: { exclude: ["updatedAt"] },
    });
  }

  // UPDATE
  async update(
    id: number,
    data: UpdateProductInput,
    transaction?: Transaction
  ): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    await product.update(data, { transaction });
    await product.reload();
    return product;
  }

  // DELETE
  async delete(id: number, transaction?: Transaction): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    await product.destroy({ transaction });
    return product;
  }

  // FIND BY NAME
  async findByName(product_name: string): Promise<Product | null> {
    return await Product.findOne({
      where: { product_name },
    });
  }

  // BULK DELETE
  async deleteMany(ids: number[], transaction?: Transaction): Promise<number> {
    return await Product.destroy({
      where: { id: ids },
      transaction,
    });
  }


  async orderProduct(
    customer: Customer,
    items: Item[],
    subtotal: number,
    total: number
  ) {
    try {
      const order = await Order.create(
        {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          status: 'Pending',
          subtotal,
          total,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        } as any,
        { include: [{ model: OrderItem, as: "items" }] }
      );

      return order;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  }
  async updateOrder(
    orderId: number,
    customer: { name: string; email: string; phone: string; status: string },
    items?: Item[],
    subtotal?: number,
    total?: number
  ) {
    try {

      // 1. Find the existing order
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: "items" }],
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
        await OrderItem.destroy({ where: { orderId: order?.dataValues.id } });
        // Add new items
        const orderItems = items.map((item) => ({
          orderId: orderId,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));
        const createdItems = await OrderItem.bulkCreate(orderItems, { returning: true });
        return createdItems;
      }

      // 4. Return the updated order with items
      const updatedOrder = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, as: "items" }],
      });

      return updatedOrder;
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error;
    }
  }



  async getAllOrders() {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            as: "items",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return orders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }

}
export default ProductRepository;