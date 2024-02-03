const { error, success } = require("../utils/response");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const signupController = async (req, res) => {
  try {
    console.log("Start Requrest");

    const { name, email, password, userImg } = req.body;

    if (!name || !email || !password || !userImg) {
      return res.send(error(400, "All Fields Are Required"));
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.send(error(400, "User Already Exists"));
    }

    const cloudImg = await cloudinary.uploader.upload(userImg, {
      folder: "postImg",
    });

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    return res.send(success(201, "User Created Successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "All Fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.send(error(400, "User Does Not Exists"));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.send(error(400, "Incorrect Password"));
    }

    const token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { message: "Login Successfully", token }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const refreshAccessTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      res.send(error(401, "Refresh token is required"));
    }

    const refreshToken = cookies.jwt;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    const token = await user.generateToken();

    res.send(success(201, { message: "Token is Refreshed", token }));
  } catch (e) {
    res.send(error(401, "Invalid Refresh Token"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "User logged out"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
