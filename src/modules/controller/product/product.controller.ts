import { Request, Response } from "express";
import ProductRepository, { CreateProductInput } from "../../repository/product/product.repository";
import { upload } from "../../../middleware/upload"; // ← now uses Cloudinary storage
import ProductHandler from "../../handler/product/product.handler";

const productRepo = new ProductRepository();
const producthandler = new ProductHandler();

class ProductController {
  private productRepo = new ProductRepository();

  // ✅ Expose Multer middleware for routes (now uploads to Cloudinary)
  static upload = upload.array("images", 5); // up to 5 images per product

  /**
   * @desc Create new product
   * @route POST /api/products
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      // Extract form fields (unchanged)
      const {
        category,
        product_name,
        original_price,
        discount_percent,
        description,
        final_price
      } = req.body;

      // ✅ Cloudinary uploads → get secure URLs
      const files = req.files as Express.Multer.File[] | undefined;
      const imageUrls = files?.map(
        (file) => file.path  // ← Cloudinary secure_url
      ) || [];

      // ✅ Prepare data for repository (same structure)
      const data: CreateProductInput = {
        category,
        product_name,
        original_price: Number(original_price),
        discount_percent: discount_percent ? Number(discount_percent) : undefined,
        description: description || null,
        final_price,
        images: imageUrls,
      };

      // ✅ Save product
      const product = await this.productRepo.create(data);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
      });
    } catch (error: any) {
      console.error("❌ Error creating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    }
  }

  /**
   * @desc Get all products with pagination and optional search
   * @route GET /api/products
   */
  async getAllProducts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const result = await this.productRepo.findAll({
        page: Number(page),
        limit: Number(limit),
        search: search?.toString(),
      });

      // Cloudinary URLs are already full → no need to prepend host
      const data = result.rows.map(product => {
        const json = product.toJSON();

        // Ensure images is always an array (defensive)
        json.images = Array.isArray(json.images)
          ? json.images
          : json.images
            ? [json.images]
            : [];

        return json;
      });

      res.json({ success: true, count: result.count, data });
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * @desc Get product by ID
   * @route GET /api/products/:id
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepo.findById(Number(id));

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      // (unchanged: no image processing, just success)
      res.json({ success: true, product });
    } catch (error: any) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  }

  /**
   * @desc Update product
   */
async updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const files = req.files as Express.Multer.File[] | undefined;
    const newImageUrls = files?.map(file => file.path) || [];

    const existingProduct = await this.productRepo.findById(Number(id));
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ ALWAYS normalize before using
    const existingImages = existingProduct.images;

    const images =
      newImageUrls.length > 0
        ? [...newImageUrls]
        : [...existingImages];

    const data: CreateProductInput = {
      ...req.body,
      images, // will be saved as JSON/string by repo
    };

    if (data.original_price || data.discount_percent) {
      const price = Number(
        data.original_price ?? existingProduct.original_price
      );

      const discount = Number(
        data.discount_percent ?? existingProduct.discount_percent ?? 0
      );

      const finalPrice = price - (price * discount) / 100;
      data.final_price = finalPrice.toFixed(2); // Sequelize DECIMAL
    }

    const updatedProduct = await this.productRepo.update(Number(id), data);

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




  // DELETE PRODUCT (unchanged, but you could add Cloudinary deletion later)
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.productRepo.delete(Number(id));
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Order methods remain unchanged
  async createOrder(req: Request, res: Response) {
    try {
      const { customer, items, subtotal, total } = req.body;

      if (!customer || !items || !subtotal || !total) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const order = await producthandler.CreateOrder(customer, items, subtotal, total);
   
      return res.status(201).json({
        status: true,
        message: "Order created successfully",
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, status, items, subtotal, total } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      if (!items && !subtotal && !total) {
        return res.status(400).json({ error: "At least one field is required to update" });
      }

      const order = await producthandler.UpdateOrder(id, { name, email, phone, status, items, subtotal, total });

      if (!order.success) {
        return res.status(400).json({ error: order.message });
      }

      return res.status(200).json({
        status: true,
        message: "Order updated successfully",
        data: order.data,
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const orders = await productRepo.getAllOrders();
      return res.status(200).json({ orders });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }
}

export default ProductController;