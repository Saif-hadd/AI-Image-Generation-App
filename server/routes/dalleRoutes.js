import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Vérification clé Hugging Face
if (!process.env.HF_API_KEY) {
  throw new Error("HF_API_KEY is missing in .env file");
}

//  Liste de mots interdits pour filtrage
const forbiddenWords = [
  "nude", "sex", "porn", "nsfw", "gore", "violence", "drugs", "blood"
];

function isPromptSafe(prompt) {
  const lower = prompt.toLowerCase();
  return !forbiddenWords.some(word => lower.includes(word));
}

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "" || prompt.length > 300) {
    return res.status(400).json({ message: "Prompt invalide ou trop long" });
  }

  //  Vérification du prompt
  if (!isPromptSafe(prompt)) {
    return res
      .status(400)
      .json({ success: false, message: "Prompt contains forbidden words or sensitive content" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt, options: { wait_for_model: true } }),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 503) {
        return res
          .status(503)
          .json({ success: false, message: "Model is loading, please retry later" });
      }
      return res.status(response.status).json({ success: false, message: errorText || "Error from HF API" });
    }

    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      if (jsonData.error) {
        return res.status(503).json({ success: false, message: jsonData.error });
      }
      return res.status(200).json({ success: true, photo: null, message: "Model is loading, retry soon" });
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    res.status(200).json({ success: true, photo: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ success: false, message: error?.message || "Error generating image" });
  }
});

export default router;
