import { recipeSchema } from '../validators/recipeValidator.js';
import Recipe from '../models/Recipe.js';

// Función para traducir categorías y dificultades
const translateRecipeData = (data) => {

  const categoriesMap = {
    'Plato principal': 'Main Course',
    'Postre': 'Dessert',
    'Entrada': 'Appetizer'
  };

  const difficultyMap = {
    'Fácil': 'Easy',
    'Media': 'Medium',
    'Difícil': 'Hard'
  };

  return {
    ...data,
    categories: data.categories.map(cat => categoriesMap[cat]),
    difficulty: difficultyMap[data.difficulty]
  };
};



// Crear una nueva receta

export const createRecipe = async (req, res) => {
  // Valida la receta antes de intentar guardarla
  const { error } = recipeSchema.validate(req.body, { abortEarly: false });  // 'abortEarly' permite devolver todos los errores
  if (error) {
    return res.status(400).json({
      message: 'Error en la validación de la receta',
      details: error.details.map(err => err.message)  
    });
  }

  try {
    // traduce los datos a ingles antes de guardarlos
    const translatedData = translateRecipeData(req.body);

    const newRecipe = new Recipe(translatedData);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la receta' });
  }
};

// Actualizar una receta

export const updateRecipe = async (req, res) => {
  
  const { error } = recipeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Error en la validación de la receta',
      details: error.details.map(err => err.message)
    });
  }

  try {
   
    const translatedData = translateRecipeData(req.body);

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, translatedData, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la receta' });
  }
};


// Eliminar una receta

export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    res.json({ message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la receta' });
  }
};



// Obtener receta por ID 
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la receta' });
  }
};



// Obtener todas las recetas con búsqueda por nombre, ingredients y paginado

export const getRecipes = async (req, res) => {
  try {
    const { nombre, page = 1, limit = 10, ingredients } = req.query; 

    let query = {};

    // para consultas por nombre
    if (nombre) {
      query.title = { $regex: nombre, $options: 'i' }; // esto me ayuda a que no importe si es minuscula o mayuscula
    }

    // Realizamos la búsqueda inicial de recetas
    let recetas = await Recipe.find(query);

    // Si hay una búsqueda de ingredients, filtramos las recetas según las coincidencias de ingredients
    if (ingredients) { 
      const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase()); 
      
      recetas = recetas.map(recipe => {
        const matchedIngredients = recipe.ingredients.filter(ingredient => 
          ingredientList.includes(ingredient.name.toLowerCase())
        );
        
        return {
          ...recipe.toObject(),
          matchedIngredientsCount: matchedIngredients.length, 
        };
      });

      // filtra las recetas que tiene al menos una coincidencia
      recetas = recetas.filter(recipe => recipe.matchedIngredientsCount > 0);

      // Ordenamos las recetas por la cantidad de ingredients coincidentes, de mayor a menor
      recetas = recetas.sort((a, b) => b.matchedIngredientsCount - a.matchedIngredientsCount);
    }

    //  paginado
    const paginatedRecipes = recetas.slice((page - 1) * limit, page * limit);

    res.json(paginatedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar recetas' });
  }
};


// Obtener recetas por categoría
export const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({ categories: { $regex: new RegExp(category, 'i') } }); // Búsqueda insensible a mayúsculas/minúsculas
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron recetas en esta categoría' });
    }
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las recetas por categoría' });
  }
};

// Obtener recetas por dificultad
export const getRecipesByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const recipes = await Recipe.find({ difficulty: { $regex: new RegExp(difficulty, 'i') } }); // Búsqueda insensible a mayúsculas/minúsculas
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron recetas con esta dificultad' });
    }
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las recetas por dificultad' });
  }
};

