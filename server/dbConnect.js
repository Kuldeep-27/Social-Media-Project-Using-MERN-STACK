const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB Connected Successfuly");
  } catch (error) {
    console.log("Error in coonected databse");
    console.log(error);
    process.exit(0);
  }
};

module.exports = connectDB;
