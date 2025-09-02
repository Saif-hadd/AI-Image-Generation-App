import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./mongodb/connect.js"; 
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const app = express();

// Sécurité headers HTTP
app.use(helmet());

// CORS restreint au frontend officiel
app.use(cors({
  origin: ["https://ai-image-generation-app-gray.vercel.app"], 
}));

// Limitation du nombre de requêtes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 requêtes par IP
  message: "Trop de requêtes depuis cette IP, réessayez dans 1 minute"
});

// Middleware
app.use(express.json({ limit: "50mb" }));

// Routes avec rate limiting sur endpoints critiques
app.use("/api/v1/dalle", apiLimiter, dalleRoutes);
app.use("/api/v1/post", apiLimiter, postRoutes);

// Route test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running securely!" });
});

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is missing in .env file");
    }
    await connectDB(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
