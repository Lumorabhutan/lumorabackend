import { Request, Response } from "express";
import BlogRepository from "../../repository/blogs/blogs.repository";

const blogRepo = new BlogRepository();

export class BlogController {
  async createBlog(req: Request, res: Response) {
    try {
      const { category, is_published, published_at } = req.body;

      let items = typeof req.body.items === "string" 
        ? JSON.parse(req.body.items) 
        : req.body.items || [];

      const uploadedFiles = req.files as Express.Multer.File[];

      console.log("📤 Files uploaded to Cloudinary:", uploadedFiles?.map(f => f.originalname));

      // Map Cloudinary URLs to items
      items = items.map((item: any, index: number) => {
        const itemFiles = uploadedFiles?.filter((file) => {
          const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
          return match && parseInt(match[1]) === index;
        });

        // CloudinaryStorage already uploaded - just get the URLs
        const imageUrls = itemFiles?.map(file => (file as any).path) || [];

        console.log(`📸 Item ${index}: ${imageUrls.length} images from Cloudinary`);

        return { ...item, images: imageUrls };
      });

      const blogData = {
        category,
        is_published: is_published === "true",
        published_at: published_at || null,
        items,
      };

      const blog = await blogRepo.createBlog(blogData);

      return res.status(201).json({
        success: true,
        message: "Blog created successfully with Cloudinary images",
        data: blog,
      });
    } catch (error: any) {
      console.error("Create blog error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create blog",
        error: error.message,
      });
    }
  }

async updateBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { category, is_published, published_at } = req.body;

    let items = typeof req.body.items === "string" 
      ? JSON.parse(req.body.items) 
      : req.body.items || [];

    const uploadedFiles = req.files as Express.Multer.File[];

    // 1️⃣ Fetch existing blog from DB to preserve old images
    const existingBlog = await blogRepo.getBlogById(Number(id));
    if (!existingBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    console.log("📤 Update - Files uploaded to Cloudinary:", uploadedFiles?.map(f => f.originalname));

    // 2️⃣ Merge new images with existing ones
    items = items.map((item: any, index: number) => {
      const itemFiles = uploadedFiles?.filter((file) => {
        const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
        return match && parseInt(match[1]) === index;
      });

      const newImageUrls = itemFiles?.map(file => (file as any).path) || [];

      // Get existing images from DB if available
      const existingImages = existingBlog.items?.[index]?.images || [];

      return {
        ...item,
        images: newImageUrls.length > 0 ? newImageUrls : existingImages,
      };
    });

    const updateData: any = {
      category,
      is_published: is_published === "true",
      published_at: published_at || null,
      items,
    };

    const blog = await blogRepo.updateBlog(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully with Cloudinary images",
      data: blog,
    });
  } catch (error: any) {
    console.error("Update blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
}


  async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await blogRepo.deleteBlog(Number(id));
      if (!deleted) return res.status(404).json({ success: false, message: "Blog not found" });
      return res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to delete blog", error: error.message });
    }
  }

  async getAllBlogs(req: Request, res: Response) {
    try {
      const { category, is_published, id } = req.query;
      const filters: any = {};
      if (category) filters.category = category;
      if (is_published !== undefined) filters.is_published = is_published === "true";
      if (id) filters.id = Number(id);

      const blogs = await blogRepo.getAllBlogs(filters);
      const plainBlogs = blogs.map(blog => blog.get({ plain: true }));

      // Cloudinary URLs are already full URLs, just clean them
      const withCleanUrls = plainBlogs.map((blog: any) => {
        if (blog.items && Array.isArray(blog.items)) {
          blog.items = blog.items.map((item: any) => {
            let cleanImages: string[] = [];

            if (Array.isArray(item.images)) {
              cleanImages = item.images.filter((img: any) => {
                return typeof img === "string" && img.trim() !== "";
              });
            }

            return {
              ...item,
              images: cleanImages,
            };
          });
        }
        return blog;
      });

      return res.status(200).json({
        success: true,
        message: "List successfully",
        data: withCleanUrls,
      });
    } catch (error: any) {
      console.error("Error in getAllBlogs:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch blogs",
        error: error.message || "Internal server error",
      });
    }
  }

  async getBlogById(req: Request, res: Response) {
    try {
      const blog = await blogRepo.getBlogById(Number(req.params.id));
      if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

      const plainBlogs = [blog].map(blog => blog.get({ plain: true }));

      const withCleanUrls = plainBlogs.map((blog: any) => {
        if (blog.items && Array.isArray(blog.items)) {
          blog.items = blog.items.map((item: any) => {
            let cleanImages: string[] = [];

            if (Array.isArray(item.images)) {
              cleanImages = item.images.filter((img: any) => {
                return typeof img === "string" && img.trim() !== "";
              });
            }

            return {
              ...item,
              images: cleanImages,
            };
          });
        }
        return blog;
      });

      return res.status(200).json({ success: true, data: withCleanUrls });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch blog", error: error.message });
    }
  }

  async searchBlogs(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string" || q.trim().length < 2) {
        return res.status(400).json({ success: false, message: "Search query must be at least 2 characters" });
      }

      const blogs = await blogRepo.searchBlogs(q.trim());
      return res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Search failed", error: error.message });
    }
  }

  async publishBlog(req: Request, res: Response) {
    try {
      const blog = await blogRepo.publishBlog(Number(req.params.id));
      if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
      return res.status(200).json({ success: true, message: "Blog published", data: blog });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to publish", error: error.message });
    }
  }

  async unpublishBlog(req: Request, res: Response) {
    try {
      const blog = await blogRepo.unpublishBlog(Number(req.params.id));
      if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
      return res.status(200).json({ success: true, message: "Blog unpublished", data: blog });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to unpublish", error: error.message });
    }
  }

  async getCountries(req: Request, res: Response): Promise<any> {
    try {
      const response = await fetch("https://www.apicountries.com/countries");
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch countries",
        error: error instanceof Error ? error.message : error
      });
    }
  }
}

export default new BlogController();