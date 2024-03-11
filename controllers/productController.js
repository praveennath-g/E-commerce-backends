const Product = require("../models/productModel");
const ErrorHandler = require('../utility/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const APIFeatures = require('../utility/apiFeatures')


exports.getProducts = catchAsyncError ( async (req, res, next) => {
  const resPerPage = 2;
  const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage);

  const products = await apiFeatures.query;
  res.status(200).json({
    sucess: true,
    count:products.length,
    products,
  })
})

exports.newProduct = catchAsyncError(async (req, res, next) => {
  
  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product 
  });
});

exports.getSingleProduct= catchAsyncError (async(req,res,next)=>{
  const product  = await Product.findById(req.params.id);
      if(!product){

       return next(new ErrorHandler('Product not found ',400))
        
      }
      res.status(201).json({
        success:true,
        product
      })

  });
exports.updateProduct = async(req,res,next)=>{
  let product = await Product.findById(req.params.id);
  if(!product){
    return res.status(404).json({
      success:false,
      message:"Product not found"
    });
  }
 product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    
  new:true,
  runvalidators:true
  })
  res.status(200).json({
    success:true,
    product
  })


}

exports.deleteProduct = async(req,res,next)=>{
  const product  = await Product.findById(req.params.id);
      if(!product){
        return res.status(404).json({
          success:false,
          message:"Product not found"
        });
      }
      await product.remove();

      res.status(200).json({
        success: true,
        message: "Product Deleted!"
      })
}

//create review
exports.createReview = catchAsyncError(async(req,res,next)=>{
  const { productId, rating, comment } =req.body;
  const review = {
    user:req.user.id,
    rating,
    comment    
  }
  
const product = await Product.findById(productId);
const isReviewed = product.reviews.find(review=>{
  return review.user.toString() == req.user.id.toString()
})

if(isReviewed){
  product.reviews.forEach(review =>{

    if(review.user.toString() == req.user.id.toString()){
      review.comment = comment
      review.rating = rating
    }
  })

}else{
  product.reviews.push(review);
  product.numOfReviews =  product.reviews.length;
}

product.ratings = product.reviews.reduce((acc,review) => {
    return review.rating + acc;
},0) / product.reviews.length;
product.rating = isNaN(product.rating)?0:product.ratings

await product.save({validateBeforeSave:false});

res.status(200).json({
  success:true
})

})

//get reviews
exports.getReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})

//delete Review

exports.deleteReview = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(review =>{
      return review._id.toString() !==req.query.id.toString()
  });
  const numOfReviews = reviews.length;
  let rating = reviews.reduce((acc,review)=>{
    return review.rating +acc;
  },0) / reviews.length;
  ratings = isNaN(rating)?0:ratings;
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    numOfReviews,
    ratings
  })
    res.status(200).json({
      success:true
    })

});