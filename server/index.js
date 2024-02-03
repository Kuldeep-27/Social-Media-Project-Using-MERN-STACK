const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./dbConnect");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is lisen on PORT 4000");
  });
});
