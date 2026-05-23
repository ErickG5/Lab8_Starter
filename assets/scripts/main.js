// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

window.addEventListener('DOMContentLoaded', init);

async function init() {
  initializeServiceWorker();
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  addRecipesToDocument(recipes);
}

function initializeServiceWorker() {
  // B1. Check if serviceWorker is supported
  if ('serviceWorker' in navigator) {
    // B2. Listen for the 'load' event on window
    window.addEventListener('load', () => {
      // B3. Register sw.js as a service worker
      navigator.serviceWorker.register('./sw.js')
        // B4. Log success
        .then((registration) => {
          console.log('Service worker registered successfully:', registration);
        })
        // B5. Log failure
        .catch((err) => {
          console.log('Service worker registration failed:', err);
        });
    });
  }
}

async function getRecipes() {
  // A1. Check localStorage first — if recipes exist, return them
  const stored = localStorage.getItem('recipes');
  if (stored) {
    return JSON.parse(stored);
  }

  // A2. Empty array to hold fetched recipes
  const recipes = [];

  // A3. Return a new Promise
  return new Promise((resolve, reject) => {
    // A4. Loop through each URL
    RECIPE_URLS.forEach(async (url) => {
      // A5. try/catch for async work
      try {
        // A6. Fetch the URL
        const response = await fetch(url);
        // A7. Parse JSON from response
        const recipe = await response.json();
        // A8. Add recipe to array
        recipes.push(recipe);
        // A9. If all recipes fetched, save and resolve
        if (recipes.length === RECIPE_URLS.length) {
          saveRecipesToStorage(recipes);
          resolve(recipes);
        }
      } catch (err) {
        // A10. Log error
        console.error(err);
        // A11. Reject the promise
        reject(err);
      }
    });
  });
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}