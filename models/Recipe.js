import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  isRequired: Boolean
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  prepTime: Number,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  servings: Number,
  ingredients: [ingredientSchema],
  categories: [String],
  steps: [String],
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Recipe', recipeSchema);
