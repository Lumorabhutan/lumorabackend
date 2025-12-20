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
router.get("/user/:id", VERIFY_TOKEN, UserController.getUserById.bind(UserController));
router.put("/user/:id",VERIFY_TOKEN, UserController.updateUser.bind(UserController));
router.delete("/user/:id",VERIFY_TOKEN, UserController.deleteUser.bind(UserController));
router.post("/changepassword", UserController.updateUserPassword.bind(UserController));
router.post("/login", UserController.loginUser.bind(UserController));

// bookings and trips routes can be added here similarly
router.post("/booking", bookingController.createBooking.bind(bookingController));
router.get("/booking", VERIFY_TOKEN, bookingController.getAllBookings.bind(bookingController));
router.get("/booking/:id", VERIFY_TOKEN, bookingController.getBookingById.bind(bookingController));
router.put("/booking/:id",VERIFY_TOKEN, bookingController.updateBooking.bind(bookingController));
router.delete("/booking/:id",VERIFY_TOKEN, bookingController.deleteBooking.bind(bookingController));
router.get("/booking/:email", bookingController.getBookingByEmail.bind(bookingController));


//contact us routes can be added here similarly
router.post("/contact", contactController.createContact.bind(contactController));
router.get("/contact", contactController.getAllContacts.bind(contactController));
router.get("/contact/:id",VERIFY_TOKEN, contactController.getContactById.bind(contactController));
router.put("/contact/:id",VERIFY_TOKEN, contactController.updateContact.bind(contactController));
router.delete("/contact/:id",VERIFY_TOKEN, contactController.deleteContact.bind(contactController));


// trips routes can be added here similarly
router.post("/trips", TripController.upload, tripController.createTrip.bind(tripController));

// router.post("/trips", tripController.createTrip.bind(tripController));
router.get("/trips", tripController.getAllTrips.bind(tripController));
router.get("/trips/:id", tripController.getTripById.bind(tripController));
router.put("/trips/:id",VERIFY_TOKEN,TripController.upload,  tripController.updateTrip.bind(tripController));
router.delete("/trips/:id",VERIFY_TOKEN, tripController.deleteTrip.bind(tripController));

// review routes 
router.post("/review", reviewController.createReview.bind(reviewController));
router.get("/review",VERIFY_TOKEN, reviewController.fetchAll.bind(reviewController));
router.put("/review/:id",VERIFY_TOKEN, reviewController.updateReview.bind(reviewController));
router.delete("/review/:id",VERIFY_TOKEN, reviewController.deleteReview.bind(reviewController));
router.get("/fetchActiveReview",reviewController.fetchReview.bind(reviewController))

// router.post('/changepassword',forgetPasswordController.forgetPassword.bind(forgetPasswordController));


router.post(
  "/products",
  ProductController.upload, 
  productController.createProduct.bind(productController)
);

router.get("/products", productController.getAllProducts.bind(productController));
router.get("/products/:id", productController.getProductById.bind(productController));
router.put("/products/:id",VERIFY_TOKEN, productController.updateProduct.bind(productController));
router.delete("/products/:id",VERIFY_TOKEN, productController.deleteProduct.bind(productController));
router.post("/orders", productController.createOrder.bind(productController));
router.get("/orders",VERIFY_TOKEN, productController.getOrders.bind(productController)); // GET all orders
router.put("/orders/:id",VERIFY_TOKEN, productController.updateOrder.bind(productController)); // GET order by ID
//blogs
router.post("/blogs",VERIFY_TOKEN, blogsupload.any(), blogsController.createBlog);
router.put("/blogs/:id",VERIFY_TOKEN, blogsupload.any(), blogsController.updateBlog);

// Read
router.get("/blogs", blogsController.getAllBlogs);
router.get("/blogs/:id", blogsController.getBlogById);
router.get("/blogs/search", blogsController.searchBlogs);

// Delete & Publish
router.delete("/blogs/:id",VERIFY_TOKEN, blogsController.deleteBlog);
router.post("/blogs/:id/publish",VERIFY_TOKEN, blogsController.publishBlog);

router.get("/countries", blogsController.getCountries);

export default router;
