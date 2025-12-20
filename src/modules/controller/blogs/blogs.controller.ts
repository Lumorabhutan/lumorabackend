import { Request, Response } from "express";
import BlogRepository from "../../repository/blogs/blogs.repository";
import cloudinary from "cloudinary"; // ← for optional deletion
import { tripupload } from "../../../middleware/tripupload";

const blogRepo = new BlogRepository();

export class BlogController {
  // Expose the middleware for routes
  static upload = tripupload.array("images"); // or use .fields() if you want stricter control

  async createBlog(req: Request, res: Response) {
    try {
      const { category, is_published, published_at } = req.body;

      // Parse items if sent as string
      let items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items || [];

      const uploadedFiles = req.files as Express.Multer.File[];

      console.log("Uploaded files:", uploadedFiles?.map(f => f.originalname));

      // Map images to correct items (unchanged logic)
      items = items.map((item: any, index: number) => {
        const itemFiles = uploadedFiles?.filter((file) => {
          const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
          return match && parseInt(match[1]) === index;
        });

        // Use Cloudinary secure_url (file.path)
        const imageUrls = itemFiles?.map(file => file.path) || [];

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
        message: "Blog created successfully",
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

      let items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items || [];
      const uploadedFiles = req.files as Express.Multer.File[];

      console.log("Update - Uploaded files:", uploadedFiles?.map(f => f.originalname));

      if (uploadedFiles && uploadedFiles.length > 0) {
        items = items.map((item: any, index: number) => {
          const itemFiles = uploadedFiles.filter((file) => {
            const match = file.fieldname.match(/items\[(\d+)\]\[images\]\[\]/);
            return match && parseInt(match[1]) === index;
          });

          const newImageUrls = itemFiles.map(file => file.path); // Cloudinary secure_url

          return {
            ...item,
            images: newImageUrls.length > 0 ? newImageUrls : item.images || [],
          };
        });
      }

      const updateData: any = {
        category,
        is_published: is_published === "true",
        published_at: published_at || null,
        items,
      };

      const blog = await blogRepo.updateBlog(Number(id), updateData);

      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully",
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

      // Optional: Fetch blog to delete images from Cloudinary
      const blog = await blogRepo.getBlogById(Number(id));
      if (blog) {
        // Collect all public_ids from all items
        const publicIds: string[] = [];
        blog.items?.forEach((item: any) => {
          if (Array.isArray(item.images)) {
            item.images.forEach((url: string) => {
              // Extract public_id from Cloudinary URL
              const parts = url.split('/');
              const fileWithExt = parts.pop();
              const publicIdWithExt = fileWithExt?.split('.')[0];
              if (publicIdWithExt) publicIds.push(publicIdWithExt);
            });
          }
        });

        // Delete from Cloudinary (optional - uncomment if needed)
        // if (publicIds.length > 0) {
        //   await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
        // }
      }

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

      // Convert to plain objects
      const plainBlogs = blogs.map(blog => blog.get({ plain: true }));

      const host = `${req.protocol}://${req.get("host")}`;

      const withFullUrls = plainBlogs.map((blog: any) => {
        if (blog.items && Array.isArray(blog.items)) {
          blog.items = blog.items.map((item: any) => {
            let cleanImages: string[] = [];

            if (Array.isArray(item.images)) {
              cleanImages = item.images
                .filter((img: any) => typeof img === "string" && img.trim() !== "")
                .map((img: string) => img.startsWith("http") ? img : `${host}${img}`);
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
        data: withFullUrls,
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

      const host = `${req.protocol}://${req.get("host")}`;

      const withFullUrls = plainBlogs.map((blog: any) => {
        if (blog.items && Array.isArray(blog.items)) {
          blog.items = blog.items.map((item: any) => {
            // FIX THE MAIN BUG: Clean invalid images
            let cleanImages: string[] = [];

            if (Array.isArray(item.images)) {
              cleanImages = item.images
                .filter((img: any) => {
                  return typeof img === "string" && img.trim() !== "";
                })
                .map((img: string) =>
                  img.startsWith("http") ? img : `${host}${img}`
                );
            }

            return {
              ...item,
              images: cleanImages, // ← Now always clean array of strings
            };
          });
        }
        return blog;
      });

      return res.status(200).json({ success: true, data: withFullUrls });
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

      // Convert body to JSON
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