import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({
        message: "All fields required",
      });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,

      email,

      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};

// LOGIN

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { id: user._id, username: user.username },

      process.env.JWT_SECRET,

      { expiresIn: "1d" },
    );

    res.json({
      token,

      user: {
        id: user._id,

        username: user.username,

        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};

// SUBSCRIBE

export const subscribeUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const targetUser = await User.findById(req.params.id);

    const isSubscribed = currentUser.subscribedTo.some(
      (id) => id.toString() === targetUser._id.toString(),
    );

    if (isSubscribed) {
      currentUser.subscribedTo.pull(targetUser._id);

      targetUser.subscribers.pull(currentUser._id);
    } else {
      currentUser.subscribedTo.push(targetUser._id);

      targetUser.subscribers.push(currentUser._id);
    }

    await currentUser.save();

    await targetUser.save();

    res.json({
      subscribers: targetUser.subscribers.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};
