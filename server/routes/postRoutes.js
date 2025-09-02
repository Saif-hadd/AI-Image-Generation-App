import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

dotenv.config();
const router = express.Router();

// Vérification Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration variables are missing in .env file");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET tous les posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Fetching posts failed" });
  }
});

// POST nouveau post
router.post("/", async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    if (!photo || (!photo.startsWith("data:image/png") && !photo.startsWith("data:image/jpeg"))) {
      return res.status(400).json({ success: false, message: "Photo invalide" });
    }

    const uploadedPhoto = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: uploadedPhoto.url,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: "Unable to create post" });
  }
});

export default router;
