//contain all DOm elements
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search-field'),
  searchResList: document.querySelector('.results-list'),
  searchRes: document.querySelector('.results'),
  searchResPages: document.querySelector('.results-page-buttons'),
  recipe: document.querySelector('.recipe'),
  shoppingButton: document.querySelector('.shopping-list-button'),
  shopping: document.querySelector('.shopping-list'),
  shoppingList: document.querySelector('.shopping-list'),
  likesButton: document.querySelector('.likes-list-button'),
  likesMenu: document.querySelector('.likes-list'),
  likesList: document.querySelector('.likes-list')
};

export const elementStrings = {
    loader: 'loader'
}
export const renderLoader = (parent) => {
  const loader = `
    <div class="${elementStrings.loader}">
    <i class="fa fa-spinner" aria-hidden="true"></i>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader);
    }
};
