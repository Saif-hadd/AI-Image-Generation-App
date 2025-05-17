import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route pour vérifier que le service fonctionne
router.route('/').get((req, res) => {
  res.send('Hello from DALL-E!');
});

// Route pour générer des images
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Log du prompt reçu
    console.log("Received prompt:", prompt);

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
    });

    // Vérifiez si la réponse contient des données
    if (!aiResponse.data || aiResponse.data.length === 0 || !aiResponse.data[0].b64_json) {
      return res.status(500).json({ message: 'No image data received from OpenAI' });
    }

    const image = aiResponse.data[0].b64_json; // Utiliser la clé b64_json
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      message: error?.message || 'An error occurred while generating the image',
    });
  }
});

export default router;
