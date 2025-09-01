import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

if (!process.env.HF_API_KEY) {
  throw new Error("HF_API_KEY is missing in .env file");
}

// Route GET pour test
router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Hugging Face - Stable Diffusion!" });
});

// Route POST pour générer une image
router.post("/", async (req, res) => {
  const { prompt } = req.body;
  console.log("POST /dalle received:", req.body);

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    // URL corrigée pour Stable Diffusion XL
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: prompt,
          options: {
            wait_for_model: true // Attendre que le modèle soit chargé
          }
        }),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", response.status, errorText);
      
      // Gérer les erreurs spécifiques
      if (response.status === 503) {
        return res.status(503).json({ 
          message: "Model is loading, please try again in a few seconds" 
        });
      }
      
      return res.status(response.status).json({ 
        message: errorText || "Error from Hugging Face API" 
      });
    }

    // Si la réponse est JSON (modèle en cours de chargement)
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      console.log("Hugging Face JSON response:", jsonData);
      
      if (jsonData.error) {
        return res.status(503).json({ 
          message: jsonData.error || "Model is loading, please retry" 
        });
      }
      
      return res.status(200).json({ 
        photo: null, 
        message: "Model loading or processing, please retry in a moment." 
      });
    }

    // Convertir l'image en base64
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    res.status(200).json({ 
      success: true,
      photo: `data:image/png;base64,${base64Image}` 
    });
    
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Error while generating image",
    });
  }
});

export default router;
