const logger =
  (req,
  res,
  next) => {
    console.log("hi dear");
    next()
  };
  
module.exports = logger;
