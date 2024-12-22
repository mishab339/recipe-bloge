const express = require('express');
const router = express.Router();
const recipeControllers = require('../controllers/recipeController');

/**
 * App Router
 */
 
router.get('/',recipeControllers.homepage);
router.get('/recipe/:id',recipeControllers.exploreRecipe);
router.get('/categories',recipeControllers.exploreCategories);
router.get('/categories/:id',recipeControllers.exploreCategoriesById);
router.post('/search',recipeControllers.searchRecipe);
router.get('/explore-latest',recipeControllers.exploreLatest);
router.get('/explore-random',recipeControllers.exploreRandom);
router.get('/submit-recipe',recipeControllers.submitRecipe);
router.post('/submit-recipe',recipeControllers.submintRecipeOnPost);

module.exports = router;