const jwt = require("jsonwebtoken");
const ayncHanlder = require("./async");
const ErrorResponse = require("../util/errorResponse");
const User = require("../models/User");
exports.protect = ayncHanlder(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // else if(req.cookies.token){
  //     token=req.cookies.token
  // }
  if (!token) {
    return next(new ErrorResponse("Not Authorize to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user=await User.findById(decoded.id)
    next()
  } catch (err) {
    return next(new ErrorResponse("Not Authorize to access this route", 401));
  }
});
