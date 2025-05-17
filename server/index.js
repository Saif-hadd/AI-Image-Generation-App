import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from './mongodb/connect.js'; // Connexion à la base de données MongoDB
import postRoutes from './routes/postRoutes.js'; // Routes pour les posts
import dalleRoutes from './routes/dalleRoutes.js'; // Routes pour DALL-E

dotenv.config();

const app = express();
app.use(cors()); // Activer CORS pour éviter les problèmes de politique de même origine
app.use(express.json({ limit: "50mb" })); // Limiter la taille des requêtes JSON

// Définir les routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Route de base pour vérifier le bon fonctionnement du serveur
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Vérification de l'URL MongoDB
    if (!process.env.MONGODB_URL) {
      throw new Error("MongoDB URL is missing in environment variables.");
    }

    // Connexion à la base de données MongoDB
    await connectDB(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Démarrer le serveur uniquement si la connexion à la base de données est réussie
    app.listen(8080, () => {
      console.log('Server started on port 8080');
    });
  } catch (error) {
    // Logguer les erreurs s'il y a un problème avec la connexion ou le démarrage du serveur
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Fermer le processus si une erreur survient
  }
};

// Démarrer le serveur
startServer();
