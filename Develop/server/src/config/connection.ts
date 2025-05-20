import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';
console.log('🔗 Connecting to MongoDB at:', mongoUri); // ✅ Imprime lo que realmente se va a usar

mongoose.connect(mongoUri)
  .then(() => {
    console.log('🛢️ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // 🔥 Cierra si no conecta
  });

export default mongoose.connection;
