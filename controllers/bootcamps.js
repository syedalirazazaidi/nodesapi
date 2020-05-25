exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all bootcamp" });
};
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `show a single bootcamp${req.params.id}` });
};
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "create new bootcamp" });
};
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Display bootcamp${req.params.id}` });
};
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp${req.params.id}` });
};
