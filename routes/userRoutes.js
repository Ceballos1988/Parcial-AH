import express from 'express';
import { register, login, getUsers } from '../controllers/userController.js';
import { authenticateJWT, isAdmin } from '../middleware/auth.js'; 


const router = express.Router();

// Ruta para obtener todos los usuarios (solo para administradores)
router.get('/users', authenticateJWT, isAdmin, getUsers);

// Rutas de registro e inicio de sesión
router.post('/register', register);
router.post('/login', login);

export default router;
