const ErrorResponse = require("../util/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponce(user, 200, res);
});
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || password) {
    return next(new ErrorResponse("plz provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credential", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credential", 401));
  }
  sendTokenResponce(user, 200, res);
});
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    data: user,
  });
});
const sendTokenResponce = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const option = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        next(new ErrorResponse('There is no user with that email',404))
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave : false})
    res.status(200).json({
      data: user,
    });
  });
