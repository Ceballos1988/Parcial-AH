import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// Verificar si la URI se carga correctamente
console.log('URI:', process.env.MONGODB_URI); // Verifica si la URI está bien cargada

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB correctamente');
    mongoose.connection.close(); // Cierra la conexión
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB', error);
    mongoose.connection.close();
  });

