const backendDomin = process.env.REACT_APP_BACKEND_URL || "";

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },
  forgotPassword: {
    url: `${backendDomin}/api/forgot-password`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomin}/api/reset-password`,
    method: "post",
  },
  chat: {
    url: `${backendDomin}/api/chat`,
    method: "post",
  },
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomin}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "post",
  },
  addToWishlist: {
    url: `${backendDomin}/api/addtowishlist`,
    method: "post",
  },
  wishlistProductCount: {
    url: `${backendDomin}/api/wishlist-count`,
    method: "get",
  },
  getWishlistProducts: {
    url: `${backendDomin}/api/wishlist-products`,
    method: "get",
  },
  removeFromWishlist: {
    url: `${backendDomin}/api/remove-from-wishlist`,
    method: "post",
  },
  saveFutureLetter: {
    url: `${backendDomin}/api/wishlist-save-letter`,
    method: "post",
  },
  getFutureLetter: {
    url: `${backendDomin}/api/wishlist-get-letter`,
    method: "get",
  },
  addReview: {
    url: `${backendDomin}/api/add-review`,
    method: "post",
  },
  getReviews: {
    url: `${backendDomin}/api/get-reviews`,
    method: "get",
  },
  editReview: {
    url: `${backendDomin}/api/edit-review`,
    method: "post",
  },
  deleteReview: {
    url: `${backendDomin}/api/delete-review`,
    method: "post",
  },
  createOrder: {
    url: `${backendDomin}/api/create-order`,
    method: "post",
  },
  cancelOrder: {
    url: `${backendDomin}/api/cancel-order`,
    method: "post",
  },
  getOrders: {
    url: `${backendDomin}/api/my-orders`,
    method: "get",
  },
};

export default SummaryApi;