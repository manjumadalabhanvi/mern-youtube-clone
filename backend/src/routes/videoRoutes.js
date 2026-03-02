import express from "express";
import { uploadVideo,getAllVideos,getVideoById } from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { likeVideo,dislikeVideo } from "../controllers/videoController.js";
import { addView } from "../controllers/videoController.js";


const router = express.Router();

// upload video (protected)

router.post("/",authMiddleware,uploadVideo);
router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.put("/view/:id", addView);

router.put("/like/:id", authMiddleware, likeVideo);
router.put("/dislike/:id", authMiddleware, dislikeVideo);



export default router;
