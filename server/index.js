import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from './mongodb/connect.js'; // si tu utilises MongoDB
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Route test de base
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

const startServer = async () => {
  try {
    // Connexion MongoDB si nécessaire
    if (process.env.MONGODB_URL) {
      await connectDB(process.env.MONGODB_URL);
      console.log("Connected to MongoDB");
    }

    app.listen(8080, () => {
      console.log('Server started on port 8080');
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
