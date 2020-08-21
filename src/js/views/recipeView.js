import { elements } from './base';

export const clearRecipe = () => {
elements.recipe.innerHTML = '';
}
const createIngredient = ingredient => 
  `<li class="recipe-item">
                            <i class="fa fa-cutlery" aria-hidden="true"></i>
                            <p class="recipe-ingredient-info">${ingredient.count} ${ingredient.unit} ${ingredient.ingredient}</p>
                    </li>`
                    ;

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
<figure class="recipe-fig">
                <h2 class="recipe-title h2 justify-content-center">${recipe.title}</h2>
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe-img">
            </figure>
            <div class="recipe-details justify-content-around">
                <div class="recipe-info">
                    <p class="recipe-info-item recipe-info-data recipe-info-data-minutes">                        <i class="fa fa-clock-o recipe-info-item" aria-hidden="true"></i>${recipe.time} minutes</p>
                </div>
                <div class="recipe-info">
                    <p class="recipe-info-item recipe-info-data recipe-info-data-people">
                        <i class="fa fa-users recipe-info-item" aria-hidden="true"></i>${recipe.servings} servings</p>
                </div>
                <div class="recipe-content-buttons d-flex justify-content-center">
                <button type="button" class="btn recipe-like-button">
                    <p>Add to Liked Recipes
                        <i class="fa fa-heart${isLiked ? '' : '-o'} recipe__love" aria-hidden="true"></i>
                    </p>
                </button>
                <button type="button" class="btn recipe-shop-button recipe__btn--add">
                    <p>Add to Shopping List
                    <i class="far fa-check-square recipe__list"></i>
                </p>
                </button>
            </div>
            </div>

            <div class="recipe-ingredients container">
                <h3 class="h3">Ingredients:</h3>
                <div class="recipe-ingredient-list list-group">
                <ul class="recipe-row">
            ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>
                </div>
            </div>
            <h3 class="h3">Cooking Instructions:</h3>
            <div class="recipe-directions">
            <p class="recipe-directions-text">
            This recipe was carefully designed and tested by: <strong>${recipe.author}</strong>. Please check out directions at their website:</p>
        <button class="btn recipe-button" href=""${recipe.url}" target="_blank">
            <p>Directions</p>
        </button>
            </div>
    `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};
