import express from 'express';
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, getRecipesByCategory, getRecipesByDifficulty } from '../controllers/recipeController.js';
import { authenticateJWT, isAdmin } from '../middleware/auth.js'; // Importa los middleware

const router = express.Router();

// Obtener todas las recetas (sin autenticación, acceso público)
router.get('/recipes', getRecipes);

// Obtener receta por ID (sin autenticación, acceso público)
router.get('/recipes/:id', getRecipeById);

// Obtener recetas por categoría (sin autenticación, acceso público)
router.get('/recipes/category/:category', getRecipesByCategory);

// Obtener recetas por dificultad (sin autenticación, acceso público)
router.get('/recipes/difficulty/:difficulty', getRecipesByDifficulty);

// Crear nueva receta (solo administradores)
router.post('/recipes', authenticateJWT, isAdmin, createRecipe);

// Actualizar una receta (solo administradores)
router.put('/recipes/:id', authenticateJWT, isAdmin, updateRecipe);

// Eliminar una receta (solo administradores)
router.delete('/recipes/:id', authenticateJWT, isAdmin, deleteRecipe);

export default router;
