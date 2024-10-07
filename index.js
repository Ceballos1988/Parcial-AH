import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


dotenv.config();
const app = express();

// Conectarme a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Rutas
app.use('/api', recipeRoutes);
app.use('/api', userRoutes);
app.use('/api', commentRoutes);

// Página principal de la API
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Escuchar en el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
