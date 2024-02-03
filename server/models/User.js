const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    avatar: {
      publicId: String,
      url: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!this.isModified("password")) {
    next();
  }
  try {
    //const saltRound = await bcrypt.genSalt(10);
    if (user.password) {
      const hashPassword = await bcrypt.hash(user.password, 10);
      user.password = hashPassword;
    }
  } catch (error) {
    console.log("From pre save ", error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: "1y",
    }
  );
};

module.exports = mongoose.model("user", userSchema);
