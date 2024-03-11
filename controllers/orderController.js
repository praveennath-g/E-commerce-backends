const catchAsyncError = require('../middleware/catchAsyncError');
const Order = require('../models/orderModel');
const Product = require('../models/productModel')
const ErrorHandler = require('../utility/errorHandler');
//create new user
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }= req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    })
    res.status(200).json({
        success:true,
        order
    })
})


//get single order
exports.getsingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','email')
    if(!order){
        return next(new ErrorHandler(`order not found with this id:${req.params.id}`,404))
    } 
    res.status(200).json({
        success:true,
        order
    })
})


//get logged user order 
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders= await Order.find({user: req.user.id});
    
    res.status(200).json({
        success:true,
        orders
    })
})

//get all orders
exports.orders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();


    let totalAmount = 0;

    orders.forEach(order=>{
       totalAmount += order.totalPrice
    })   
        res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//update order
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler('order has been already delivered!',400))
    }

    order.orderItems.forEach(async orderItem =>{
         await updateStock(orderItem.product,orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success:true
    })
});

async function updateStock (productId,quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave:false})
}


//delete order
exports.deleteOrder =  catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`order not found with this id:${req.params.id}`,404))
    }

    await order.remove();
    res.status(200).json({
        success:true
    })
})