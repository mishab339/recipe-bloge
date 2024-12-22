require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
/**
 * GET
 * home page
 */

module.exports = {
    homepage: async(req,res)=>{
        try {
            const limitNumber = 5;
            const categories = await Category.find({}).limit(limitNumber);    
            const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
            const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
            const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
            const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
            const food = { latest, thai, american, chinese };

            res.render('index', { title: 'Cooking Blog - Home', categories,food} );
        } catch (error) {
            res.status(500).send({message: error.message || "Error Occured" });
        }
       
    },
    /**
 * GET  /categories
 *  categories
 */

    exploreCategories:async(req,res)=>{
        try {
            const limitNumber = 20;
            const categories = await Category.find({}).limit(limitNumber);
            console.log(categories);    
            res.render('category', { title: 'Cooking Blog - Categories', categories} );
        } catch (error) {
            res.status(500).send({message: error.message || "Error Occured" });
        }
    },
/**
 * GET  /recipe/:id
 *  recipes
 */

    exploreRecipe:async (req,res)=>{
        try {
            let recipeId = req.params.id;
            const recipe = await Recipe.findById(recipeId);
            res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
        } catch (error) {
            res.status(500).send({message: error.message || "Error Occured" });
        }
    },
/**
 * GET  /categories/:id
 *  CategoryById
 */
    exploreCategoriesById:async (req,res)=>{
        try {
            const categoryId = req.params.id;
            const limitNumber = 20;
            const categoryById = await Recipe.find({'category':categoryId}).limit(limitNumber);   
            res.render('category', { title: 'Cooking Blog - Categories', categoryById} );
        } catch (error) {
            res.status(500).send({message: error.message || "Error Occured" });
        }
    },
/**
 * POST /search
 *  Search
 */
    searchRecipe:async (req,res)=>{
        try {
            let searchTerm = req.body.searchTerm;
            let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
            res.render('search', { title: 'Cooking Blog - Search', recipe } );
          } catch (error) {
            res.status(500).send({message: error.message || "Error Occured" });
          }
    },
/**
 * GET /explore-latest
 *  explore-latest
 */
    exploreLatest:async (req,res)=>{
        try {
            const limitNumber = 20;
            const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
            res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
          } catch (error) {
            res.satus(500).send({message: error.message || "Error Occured" });
          }
    },
    /**
 * GET /explore-latest
 *  explore-latest
 */
    exploreRandom:async (req,res)=>{
        try {
            let count = await Recipe.find().countDocuments();
            let random = Math.floor(Math.random() * count);
            let recipe = await Recipe.findOne().skip(random).exec();
            res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
          } catch (error) {
            res.satus(500).send({message: error.message || "Error Occured" });
          }
    },
/**
 * GET /submit-recipe
 *  Submit Recipe
 */
    submitRecipe:async (req,res)=>{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe',infoErrorsObj,infoSubmitObj} );
    },
/**
 * POST /submit-recipe
 *  Submit Recipe On Post
 */
    submintRecipeOnPost:async (req,res)=>{
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where uploaded.');
          } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.satus(500).send(err);
            })
          }
        try {
            const newRecipe = new Recipe({
                name: req.body.name,
                description: req.body.description,
                email: req.body.email,
                ingredients: req.body.ingredients,
                category: req.body.category,
                image: newImageName
              });
              
              await newRecipe.save();
             

            req.flash('infoSubmit', 'Recipe has been added.')
            res.redirect('/submit-recipe');
        } catch (error) {
            req.flash('infoErrors', error);
            res.redirect('/submit-recipe');
        }
    }
}
// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "southern friend chicken",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "chinese steak tofu stew",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "chinese-steak-tofu-stew.jpg"
//       },
//       { 
//         "name": "Chocolate Banoffe Whoopie Pies",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "chocolate-banoffe-whoopie-pies.jpg"
//       },
//       { 
//         "name": "Grilled Lobster Rolls",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "grilled-lobster-rolls.jpg"
//       },
//       { 
//         "name": "Key Lime Pie",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "key-lime-pie.jpg"
//       },
//       { 
//         "name": "Spring Rolls",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "spring-rolls.jpg"
//       },
//          { 
//             "name": "Stir Fried Vegitables",
//             "description": `Recipe Description Goes Here`,
//             "email": "recipeemail@raddy.co.uk",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "American", 
//             "image": "stir-fried-vegetables.jpg"
//           },
//             {    "name": "Thai Chinese Inspired Pinch Salad",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "thai-chinese-inspired-pinch-salad.jpg"
//               },
//                 {    "name": "Thai Green Curry",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "thai-green-curry.jpg"
//               },
//                 {    "name": "Thai Inspired Vegetable Broth",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "thai-inspired-vegetable-broth.jpg"
//               },
//                 {    "name": "Thai Red Chicken Soup",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "thai-red-chicken-soup.jpg"
//               },
//                         {    "name": "Thai Style Mussels",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "thai-style-mussels.jpg"
//               },
//                         {    "name": "Tom Daley",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "tom-daley.jpg"
//               },
//                         {    "name": "Veggie Pad Thai",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "recipeemail@raddy.co.uk",
//                 "ingredients": [
//                   "1 level teaspoon baking powder",
//                   "1 level teaspoon cayenne pepper",
//                   "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American", 
//                 "image": "veggie-pad-thai.jpg"
//               },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
