import mongoose from "mongoose";

const connection = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO);
    if (res) {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connection;
