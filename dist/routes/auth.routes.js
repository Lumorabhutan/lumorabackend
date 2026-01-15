"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_1 = require("../middleware/token");
const booking_controller_1 = __importDefault(require("../modules/controller/booking/booking.controller"));
const contactus_controller_1 = __importDefault(require("../modules/controller/contactus/contactus.controller"));
const trip_controller_1 = __importDefault(require("../modules/controller/trip/trip.controller"));
const review_controller_1 = __importDefault(require("../modules/controller/review/review.controller"));
const forgetpssword_controller_1 = require("../modules/controller/forgetpassword/forgetpssword.controller");
const product_controller_1 = __importDefault(require("../modules/controller/product/product.controller"));
const blogs_controller_1 = require("../modules/controller/blogs/blogs.controller");
const user_controller_1 = require("../modules/controller/user/user.controller");
const blogs_1 = require("../middleware/blogs");
const router = (0, express_1.Router)();
const bookingController = new booking_controller_1.default();
const contactController = new contactus_controller_1.default();
const tripController = new trip_controller_1.default();
const reviewController = new review_controller_1.default();
const forgetPasswordController = new forgetpssword_controller_1.ForgetPasswordController();
const productController = new product_controller_1.default();
const blogsController = new blogs_controller_1.BlogController();
router.post("/user", user_controller_1.UserController.createUser.bind(user_controller_1.UserController));
router.get("/user", user_controller_1.UserController.getAllUsers.bind(user_controller_1.UserController));
router.get("/user/:id", user_controller_1.UserController.getUserById.bind(user_controller_1.UserController));
router.put("/user/:id", user_controller_1.UserController.updateUser.bind(user_controller_1.UserController));
router.delete("/user/:id", user_controller_1.UserController.deleteUser.bind(user_controller_1.UserController));
router.post("/changepassword", user_controller_1.UserController.updateUserPassword.bind(user_controller_1.UserController));
router.post("/login", user_controller_1.UserController.loginUser.bind(user_controller_1.UserController));
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
router.post("/trips", trip_controller_1.default.upload, tripController.createTrip.bind(tripController));
// router.post("/trips", tripController.createTrip.bind(tripController));
router.get("/trips", tripController.getAllTrips.bind(tripController));
router.get("/trips/:id", tripController.getTripById.bind(tripController));
router.put("/trips/:id", trip_controller_1.default.upload, tripController.updateTrip.bind(tripController));
router.delete("/trips/:id", tripController.deleteTrip.bind(tripController));
// review routes 
router.post("/review", reviewController.createReview.bind(reviewController));
router.get("/review", reviewController.fetchAll.bind(reviewController));
router.put("/review/:id", reviewController.updateReview.bind(reviewController));
router.delete("/review/:id", reviewController.deleteReview.bind(reviewController));
router.get("/fetchActiveReview", reviewController.fetchReview.bind(reviewController));
// router.post('/changepassword',forgetPasswordController.forgetPassword.bind(forgetPasswordController));
router.post("/products", product_controller_1.default.upload, productController.createProduct.bind(productController));
router.get("/products", productController.getAllProducts.bind(productController));
router.get("/products/:id", productController.getProductById.bind(productController));
router.put("/products/:id", product_controller_1.default.upload, productController.updateProduct.bind(productController));
router.delete("/products/:id", productController.deleteProduct.bind(productController));
router.post("/orders", productController.createOrder.bind(productController));
router.get("/orders", productController.getOrders.bind(productController)); // GET all orders
router.put("/orders/:id", productController.updateOrder.bind(productController)); // GET order by ID
//blogs
router.post("/blogs", blogs_1.blogsupload.any(), blogsController.createBlog);
router.put("/blogs/:id", blogs_1.blogsupload.any(), blogsController.updateBlog);
// Read
router.get("/blogs", blogsController.getAllBlogs);
router.get("/blogs/:id", blogsController.getBlogById);
router.get("/blogs/search", blogsController.searchBlogs);
// Delete & Publish
router.delete("/blogs/:id", token_1.VERIFY_TOKEN, blogsController.deleteBlog);
router.post("/blogs/:id/publish", blogsController.publishBlog);
router.get("/countries", blogsController.getCountries);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map