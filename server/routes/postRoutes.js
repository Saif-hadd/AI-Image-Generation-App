import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

// Vérification des variables d'environnement
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration variables are missing in .env file");
}

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET route pour récupérer tous les posts
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// POST route pour créer un nouveau post
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Vérifier que le champ photo existe
    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    // Uploader l'image à Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Créer un nouveau post dans la base de données
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

export default router;
