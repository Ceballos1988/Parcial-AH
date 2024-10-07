import Joi from 'joi';

// Esquema de validación para las recetas

export const recipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El título es obligatorio',
    'string.min': 'El título debe tener al menos 3 caracteres',
    'string.max': 'El título no puede tener más de 100 caracteres'
  }),
  prepTime: Joi.number().integer().min(1).required().messages({
    'number.base': 'El tiempo de preparación debe ser un número entero',
    'number.min': 'El tiempo de preparación debe ser mayor a 0'
  }),
  difficulty: Joi.string().valid('Fácil', 'Media', 'Difícil').required().messages({
    'any.only': 'La dificultad debe ser: Fácil, Media o Difícil',
    'string.empty': 'La dificultad es obligatoria'
  }),
  servings: Joi.number().integer().min(1).required().messages({
    'number.base': 'Las porciones deben ser un número entero',
    'number.min': 'Las porciones deben ser al menos 1'
  }),
  categories: Joi.array().items(Joi.string().valid('Plato principal', 'Postre', 'Entrada')).required().messages({
    'any.only': 'La categoría debe ser: Plato principal, Postre o Entrada',
    'string.empty': 'La categoría es obligatoria'
  }),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'El nombre del ingrediente es obligatorio',
      }),
      quantity: Joi.number().required().messages({
        'number.base': 'La cantidad debe ser un número',
      }),
      unit: Joi.string().required().messages({
        'string.empty': 'La unidad del ingrediente es obligatoria'
      }),
      isRequired: Joi.boolean().required().messages({
        'boolean.base': 'El campo "isRequired" debe ser verdadero o falso'
      })
    })
  ).required().messages({
    'array.base': 'Los ingredientes deben estar en una lista'
  }),
  steps: Joi.array().items(Joi.string().required().messages({
    'string.empty': 'Cada paso de la receta es obligatorio'
  })).required().messages({
    'array.base': 'Los pasos deben estar en una lista'
  }),
  image: Joi.string().required().messages({
    'string.empty': 'La imagen es obligatoria'
  })
});
