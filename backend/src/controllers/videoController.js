import Video from "../models/Video.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;

    // basic validation
    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      user: req.user.id, // comes from authMiddleware
    });

    await video.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: "Video upload failed" });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.title = {
        $regex: search,

        $options: "i",
      };
    }

    const videos = await Video.find(filter);

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch videos",
    });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "user",
      "username email subscribers",
    );

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch video",
    });
  }
};
export const addView = async (req, res) => {
  try {
    await Video.findByIdAndUpdate(
      req.params.id,

      { $inc: { views: 1 } },
    );

    res.status(200).json("View added");
  } catch (error) {
    res.status(500).json({
      message: "Failed to add view",
    });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // remove from dislikes if exists
    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);

    // check if already liked
    if (video.likes.includes(userId)) {
      // unlike
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      // like
      video.likes.push(userId);
    }
    
    await video.save();

    res.status(200).json({
      message: "Like updated",
      likes: video.likes.length,
    });
  } catch (error) {
    console.log(error); // VERY IMPORTANT

    res.status(500).json({
      message: "Failed to like video",
    });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // remove user from likes if present
    video.likes = video.likes.filter(
      (userId) => userId.toString() !== req.user.id,
    );

    // toggle dislike
    const alreadyDisliked = video.dislikes.some(
      (userId) => userId.toString() === req.user.id,
    );

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter(
        (userId) => userId.toString() !== req.user.id,
      );
    } else {
      video.dislikes.push(req.user.id);
    }

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike video" });
  }
};
