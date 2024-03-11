const express = require('express');
const { newOrder, getsingleOrder, myOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles }= require('../middleware/authenticate');
const orderModel = require('../models/orderModel');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getsingleOrder);  
router.route('/myorders').get(isAuthenticatedUser,myOrders);  

//admin Routes
router.route('/orders').get(isAuthenticatedUser,authorizeRoles('admin'),orderModel)
router.route('/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
router.route('/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder)
module.exports = router;