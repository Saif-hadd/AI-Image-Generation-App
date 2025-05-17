import mongoose from 'mongoose';

const connectDB = async (url) => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,// Ajoute l'indexation automatique
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB');
    console.error(err);
  }
};

export default connectDB;
