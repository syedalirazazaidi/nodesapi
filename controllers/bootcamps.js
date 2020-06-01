const ErrorResponse=require('../util/errorResponse')
const Bootcamp = require("../models/Bootcamp");
const path=require('path')
const geoCoder=require('../util/geocoder')
const asyncHandler = require("../middleware/async")
exports.getBootcamps = async(req, res, next) => {
  let query;
  const reqquery={...req.query}
  const removeField=['select','sort','page','limit']
  removeField.forEach(param=>delete reqquery[param])
  console.log(reqquery)
  let queryStr=JSON.stringify(reqquery);
  queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
  query=Bootcamp.find(JSON.parse(queryStr)).populate('courses')
  if(req.query.select){
    const fields=req.query.select.split(',').join('')
    query=query.select(fields)
  }
                      //sorting  

  if(req.query.sort){
    const sortBy=req.query.sort.split(',').join('')
    query=query.sort(sortBy)
  }
  else{
    query=query.sort('-createdAt')
  }
                                 // paginating
const page= parseInt(req.query.page,10)||1
const limit= parseInt(req.query.page,10)||100
const startIndex=(page-1)*limit;
const endIndex=page*limit;
const total=await Bootcamp.countDocuments()
query=query.skip(startIndex).limit(limit)
const bootcamps=await query;
const pagination={}
if(endIndex<total){
 pagination.next={
   page:page+1,
   limit
 }
}
if(startIndex>0){
pagination.prev={
  page:page-1,
  limit
}
}
 try{
   const bootcamps = await query
   res.status(200).json({
    success: true,
    data: bootcamps,
    count:bootcamps.length,
    pagination,
    data:bootcamps
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
    req.body.user = req.user.id
    const publishBootcamp = await Bootcamp.findOne({user:req.user.id})
    if(publishBootcamp && req.user.role!=='admin'){
      return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamo`,400))
    }
    const bootcamp = await Bootcamp.create(req.body);
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
    let  bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    //Make sure User is bootcamp owner
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this` ,401))
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
      new : true,
      runValidators:true
    })
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this` ,401))
    }
    bootcamp.remove()
    console.log(req.body);
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err)
  }
 
};

exports.getBootcampInRadius = async (req, res, next) => {
 const {zipcode,distance}=req.params
 const loc = await geoCoder.geocode(zipcode);
 const lat  =loc[0].latitude;
 const lng  =loc[0].longitude;
 const radius = distance/3963;
 const bootcamps=await Bootcamp.find({
   location:{ $geoWithin:{$centerSphere:[[lng,lat],radius]} }
 })
 
res.status(200).json({
  success:true,
  count :bootcamps.length,
  data:bootcamps
})
 
};
exports.bootcampPhotoUpload  = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this` ,401))
    }
   if(!req.files){
    return next(new ErrorResponse(`Please upload a file `,404))
   }
  const file = req.files.file
  if(!file.mimetype.startWith('image')){
    return next(new ErrorResponse(`Please upload a image file `,404))
  }
  if(file.size>process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload an Image${process.env.MAX_FILE_UPLOAD}`,404))
  }
  file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
    if(err){
      console.error(err)
      return next(new ErrorResponse(`Problem wit hupload file `,500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});
    res.status(200).json({
      success:true,
      data:file.name
    })
  })
  } catch (err) {
    next(err)
  }
 
};
