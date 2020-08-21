import { elements } from './base';
export const getInput = () => elements.searchInput.value;
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};
export const clearInput = () => {
  elements.searchInput.value = '';
};

const shortenRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
  if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
        if(acc + cur.length <= limit){
            newTitle.push(cur);
        }
        return acc + cur.length;
      }, 0);

      //return resilt
      return `${newTitle.join(' ')} ...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
<li class="list-group-item">
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="#${recipe.title}">
                        </figure>
                        <div class="results-data">
                            <h6 class="h6">${shortenRecipeTitle(recipe.title)}</h6>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
`;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type = 'prev' or 'next'
const createButton = (page, type) => {
  if(type==='prev'){
    return `<button class="btn-inline results__btn--prev page-button-prev btn" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <p><i class="fa fa-caret-left" aria-hidden="true"></i>Page ${type === 'prev' ? page - 1 : page + 1}</p>
</button>`;
  }
  if(type===`next`){
    return `<button class="btn-inline results__btn--next page-button-next btn" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <p>Page ${type === 'prev' ? page - 1 : page + 1}<i class="fa fa-caret-right" aria-hidden="true"></i></p>
</button>`;
  }
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1){
        //button go next
        button = createButton(page, 'next');
    }else if(page < pages){
        //both button next and pevious button
        button = `${createButton(page, 'prev')}
        ${createButton(page, 'next')}` 
        
    }
    else if (page === pages && pages > 1){
        //button go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  //render buttons
  renderButtons(page, recipes.length, resPerPage);
};
