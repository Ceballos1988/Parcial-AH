import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';

// Agregar un comentario a una receta
export const addCommentToRecipe = async (req, res) => {
  try {
    const { recipeId, comment, rating } = req.body;

    // Asegúrate de que la receta exista
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    // Crea el nuevo comentario
    const newComment = new Comment({
      recipeId,
      user: req.user.userId,  // Capturamos el ID del usuario desde el token JWT
      comment,
      rating
    });

    await newComment.save();

    res.status(201).json({ message: 'Comentario agregado con éxito', newComment });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el comentario', error });
  }
};

// Obtener comentarios por receta
export const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const comments = await Comment.find({ recipeId }).populate('user', 'name');
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para esta receta' });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los comentarios', error });
  }
};
