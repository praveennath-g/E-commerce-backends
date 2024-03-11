const express = require("express");
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require("../controllers/productController");
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/authenticate');

router.route("/products").get(isAuthenticatedUser,getProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin','user'),newProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);

router.route('/review').put(isAuthenticatedUser,createReview)
router.route('/reviews').get(getReviews)
router.route('/review').delete(deleteReview)
//Admin routes
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin','user'),newProduct);
module.exports = router;
