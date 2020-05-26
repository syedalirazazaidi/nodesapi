const ErrorResponse=require('../util/errorResponse')
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async")
exports.getBootcamps = async(req, res, next) => {
 try{
   const bootcamps = await Bootcamp.find();
   res.status(200).json({
    success: true,
    data: bootcamps,
    count:bootcamps.length
   })

 }catch(err){
   next(err);
 }
};
exports.getBootcamp = async  (req, res, next) => {
  try{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
     return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({
     success: true,
     data: bootcamp,
    })
  
  }catch(err){
    // res.status(400).json({ success: false });
    // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    next(err)
  }

};
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    console.log(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err)
  }
};
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err)
  }
};
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    console.log(req.body);
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err)
  }
 
};
