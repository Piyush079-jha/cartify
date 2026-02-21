const express = require("express");
const router = express.Router();
const multer = require("multer");

const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require("../controller/user/userSignIn");
const userDetailsController = require("../controller/user/userDetails");
const authToken = require("../middleware/authToken");
const userLogout = require("../controller/user/userLogout");
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const forgotPasswordController = require("../controller/user/forgotPassword");
const resetPasswordController = require("../controller/user/resetPassword");
const chatController = require("../controller/chat/chatController");

const UploadProductController = require("../controller/product/uploadProduct");
const uploadImageController = require("../controller/product/uploadImage");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetails = require("../controller/product/getProductDetails");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");

const addToCartController = require("../controller/user/addToCartController");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const addToCartViewProduct = require("../controller/user/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");

const getCategories = require("../controller/product/getCategories");
const {
    addToWishlistController,
    countWishlistProducts,
    getWishlistProducts,
    removeFromWishlistController,
    saveFutureLetterController,
    getFutureLetterController
} = require('../controller/wishlist')

const { createOrder, getUserOrders, cancelOrder } = require('../controller/order/orderController')

// ── REVIEWS ──
const { getReviews, addReview, editReview, deleteReview } = require('../controller/review/reviewController')

// ── MULTER (memory storage → Cloudinary) ──
const upload = multer({ storage: multer.memoryStorage() })

// AUTH
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// CHAT
router.post("/chat", chatController);

// WISHLIST
router.post("/addtowishlist", authToken, addToWishlistController)
router.post("/remove-from-wishlist", authToken, removeFromWishlistController)
router.get("/wishlist-count", authToken, countWishlistProducts)
router.get("/wishlist-products", authToken, getWishlistProducts)
router.post("/wishlist-save-letter", authToken, saveFutureLetterController)
router.get("/wishlist-get-letter", authToken, getFutureLetterController)

// ADMIN
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);

// PRODUCTS
router.post("/upload-product", authToken, UploadProductController);
router.post("/upload-image", authToken, upload.single('productImage'), uploadImageController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/products", getProductController);

// CATEGORY
router.get("/get-categoryProduct", getCategoryProduct);
router.get("/category-product", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);

// PRODUCT DETAILS
router.post("/product-details", getProductDetails);

// SEARCH & FILTER
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);

// CART
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

// CATEGORIES
router.get("/categories", getCategories);

// ORDERS
router.post("/create-order", authToken, createOrder)
router.get("/my-orders", authToken, getUserOrders)
router.post("/cancel-order", authToken, cancelOrder)

// REVIEWS
router.get("/get-reviews/:productId", getReviews)
router.post("/add-review", authToken, addReview)
router.post("/edit-review", authToken, editReview)
router.post("/delete-review", authToken, deleteReview)

module.exports = router;