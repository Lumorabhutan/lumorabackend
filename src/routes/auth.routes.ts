import { Router } from "express";
import { VERIFY_TOKEN } from "../middleware/token";
import BookingController from "../modules/controller/booking/booking.controller";
import ContactController from "../modules/controller/contactus/contactus.controller";
import TripController from "../modules/controller/trip/trip.controller";
import ReviewController from "../modules/controller/review/review.controller";
import { ForgetPasswordController } from "../modules/controller/forgetpassword/forgetpssword.controller";
import ProductController from "../modules/controller/product/product.controller";
import { BlogController } from "../modules/controller/blogs/blogs.controller";
import { UserController } from "../modules/controller/user/user.controller";
import { blogsupload } from "../middleware/blogs";

const router = Router();
const bookingController = new BookingController();
const contactController = new ContactController();
const tripController = new TripController();
const reviewController = new ReviewController();
const forgetPasswordController = new ForgetPasswordController();
const productController = new ProductController();
const blogsController = new BlogController();

router.post("/user", UserController.createUser.bind(UserController));
router.get("/user", UserController.getAllUsers.bind(UserController));
router.get("/user/:id", UserController.getUserById.bind(UserController));
router.put("/user/:id", UserController.updateUser.bind(UserController));
router.delete("/user/:id", UserController.deleteUser.bind(UserController));
router.post("/changepassword", UserController.updateUserPassword.bind(UserController));
router.post("/login", UserController.loginUser.bind(UserController));

// bookings and trips routes can be added here similarly
router.post("/booking", bookingController.createBooking.bind(bookingController));
router.get("/booking", bookingController.getAllBookings.bind(bookingController));
router.get("/booking/:id", bookingController.getBookingById.bind(bookingController));
router.put("/booking/:id", bookingController.updateBooking.bind(bookingController));
router.delete("/booking/:id", bookingController.deleteBooking.bind(bookingController));
router.get("/booking/:email", bookingController.getBookingByEmail.bind(bookingController));


//contact us routes can be added here similarly
router.post("/contact", contactController.createContact.bind(contactController));
router.get("/contact", contactController.getAllContacts.bind(contactController));
router.get("/contact/:id", contactController.getContactById.bind(contactController));
router.put("/contact/:id", contactController.updateContact.bind(contactController));
router.delete("/contact/:id", contactController.deleteContact.bind(contactController));


// trips routes can be added here similarly
router.post("/trips", TripController.upload, tripController.createTrip.bind(tripController));

// router.post("/trips", tripController.createTrip.bind(tripController));
router.get("/trips", tripController.getAllTrips.bind(tripController));
router.get("/trips/:id", tripController.getTripById.bind(tripController));
router.put("/trips/:id",TripController.upload,  tripController.updateTrip.bind(tripController));
router.delete("/trips/:id", tripController.deleteTrip.bind(tripController));

// review routes 
router.post("/review", reviewController.createReview.bind(reviewController));
router.get("/review", reviewController.fetchAll.bind(reviewController));
router.put("/review/:id", reviewController.updateReview.bind(reviewController));
router.delete("/review/:id", reviewController.deleteReview.bind(reviewController));
router.get("/fetchActiveReview",reviewController.fetchReview.bind(reviewController))

// router.post('/changepassword',forgetPasswordController.forgetPassword.bind(forgetPasswordController));


router.post(
  "/products",
  ProductController.upload, 
  productController.createProduct.bind(productController)
);

router.get("/products", productController.getAllProducts.bind(productController));
router.get("/products/:id", productController.getProductById.bind(productController));
router.put("/products/:id", productController.updateProduct.bind(productController));
router.delete("/products/:id", productController.deleteProduct.bind(productController));
router.post("/orders", productController.createOrder.bind(productController));
router.get("/orders", productController.getOrders.bind(productController)); // GET all orders
router.put("/orders/:id", productController.updateOrder.bind(productController)); // GET order by ID
//blogs
router.post("/blogs", blogsupload.any(), blogsController.createBlog);
router.put("/blogs/:id", blogsupload.any(), blogsController.updateBlog);

// Read
router.get("/blogs", blogsController.getAllBlogs);
router.get("/blogs/:id", blogsController.getBlogById);
router.get("/blogs/search", blogsController.searchBlogs);

// Delete & Publish
router.delete("/blogs/:id",VERIFY_TOKEN, blogsController.deleteBlog);
router.post("/blogs/:id/publish", blogsController.publishBlog);

router.get("/countries", blogsController.getCountries);

export default router;
