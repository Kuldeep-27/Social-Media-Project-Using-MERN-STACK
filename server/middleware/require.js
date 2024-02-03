const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(error(401, "Authorization header is required"));
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req._id = decoded.userId;

    next();
  } catch (e) {
    console.log(e);

    return res.send(error(401, "Invalid access key"));
  }
};
