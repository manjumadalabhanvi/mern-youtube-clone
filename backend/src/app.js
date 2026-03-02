import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';

import authMiddleware from "./middleware/authMiddleware.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from'./routes/userRoutes.js';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"])

dotenv.config();
const app=express();

app.use(cors());
app.use(express.json()); //Converts the Json into json object sent by frontend req.body

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


  // routes
app.use("/api/auth", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// test route
app.get("/",(req,res)=>{
    res.send("Youtube Clone Backend Server Running")
})

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user.id,
  });
});



export default app;

