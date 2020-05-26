const ErrorResponse=require('../util/errorResponse')
const errorHandler=(err,req,res,next)=>{
    let error ={...err}
    error.message=err.message
    console.log("dd",err.name)
    if(err.name==='CastError'){
        const message =`Bootcamp will not found wit hid of${err.value}`;
        error=new ErrorResponse(message,404)
    }
    if(err.code===11000){
        const message = 'Duplicate field value entered';
        error=new ErrorResponse(message,400)
    }
    if(err.name==='Validation Error'){
        const message=Object.values(err.error).map(val=>val.message);
        error=new ErrorResponse(message,404)
    }
    res.status(error.statusCode||500).json({
        success: false,
        error : error.message||'Server error'
    })
}
module.exports = errorHandler