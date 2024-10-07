import express from 'express';
import { addCommentToRecipe, getCommentsByRecipe } from '../controllers/commentController.js';
import { authenticateJWT } from '../middleware/auth.js'; 

const router = express.Router();

// Ruta para agregar un comentario a una receta (requiere autenticación)
router.post('/comments', authenticateJWT, addCommentToRecipe);

// Ruta para obtener comentarios por receta (sin autenticación)
router.get('/comments/:recipeId', getCommentsByRecipe);

export default router;