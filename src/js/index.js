// Global app controller
//import models to manage data
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
//import views to manage UI
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
//import DOM elements and loaders
import { elements, renderLoader, clearLoader } from './views/base';

//set up Firebase
var firebaseConfig = {
  //private info
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.localStorage.clear();
    document.querySelector(
      `.btn-navbar-users`
    ).innerHTML = `<a href="css/signin.html">Sign Out<i class="fa fa-shopping-cart" aria-hidden="true"></i></a>`;
  }
});

//functions to write user data
const addUserLikes = (likes) => {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    firebase
      .database()
      .ref('users/' + user.uid + '/likes/')
      .set({
        likes: likes,
      });
  }
};
const addUserList = (list) => {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    firebase
      .database()
      .ref('users/' + user.uid + '/list/')
      .set({
        list: list,
      });
  }
};

const state = {};
window.state = state;

//add event listeners for when the window loads
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.list = new List();
  state.likes.readStorage();
  state.list.readStorage();
  var isClicked1 = false;
  var isClicked2 = false;

  //Likes button is clicked: show liked recipes
  //Likes button is unlciked: hide liked recipes
  elements.likesButton.addEventListener('click', () => {
    if (firebase.auth().currentUser !== null) {
      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/likes/')
        .on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            console.log('childData: ', childData);
            state.likes.likes = childData;
          });
        });
      console.log(state.likes.likes);
    }
    if (isClicked1 === true) {
      isClicked1 = false;
      isClicked2 = false;
      likesView.hideLikes();
      listView.hideList();
      elements.likesButton.style.backgroundColor = '#e26d5c';
      document.querySelector(`.likes-shopping-heading`).innerHTML = '';
    } else if (isClicked1 === false) {
      document.querySelector(`.likes-shopping-heading`).innerHTML =
        'Liked Recipes';
      isClicked1 = true;
      isClicked2 = true;
      elements.likesButton.style.backgroundColor = '#C9CBA3';
      elements.shoppingButton.style.backgroundColor = '#e26d5c';
      listView.hideList();
      if (state.likes.likes !== null) {
        state.likes.likes.forEach((like) => {
          likesView.renderLike(like);
        });
      }
    }
  });
  //Shoppinh button is clicked: show shopping list
  //Shopping button is unlciked: hide shopping list
  elements.shoppingButton.addEventListener('click', () => {
    if (firebase.auth().currentUser !== null) {
      firebase
        .database()
        .ref('users/' + firebase.auth().currentUser.uid + '/list/')
        .on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            state.list.items = childData;
          });
        });
      console.log(state.list.items);
    }
    if (isClicked2 === true) {
      isClicked2 = false;
      isClicked1 = false;
      listView.hideList();
      likesView.hideLikes();
      document.querySelector(`.likes-shopping-heading`).innerHTML = '';
      elements.shoppingButton.style.backgroundColor = '#e26d5c';
    } else if (isClicked2 === false) {
      isClicked2 = true;
      isClicked1 = true;
      likesView.hideLikes();
      elements.shoppingButton.style.backgroundColor = '#C9CBA3';
      elements.likesButton.style.backgroundColor = '#e26d5c';
      document.querySelector(`.likes-shopping-heading`).innerHTML =
        'Shopping List';
      state.list.items.forEach((item) => {
        listView.renderItem(item);
      });
    }
  });
});

//Search Controller: loads data from the database then renders it
const controlSearch = async () => {
  const query = searchView.getInput();
  if (query) {
    state.search = new Search(query);
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    await state.search.getResults();
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
//page buttons
elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//Recipe Controller loads recipe and buttons
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if (id) {
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    state.recipe = new Recipe(id);
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert(
        'Error loading the recipe. There could be an issue with the recipe API or connection.',
        error
      );
    }
  }
};

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//Like Controller takes a recipe and if it's liked then it's added to the "liked recipes" array
//If the recipe isn't liked, it is not included in the "liked recipes" array
const controlLike = async () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeBtn(true);
    addUserLikes(state.likes.likes);
  } else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
    //add liked recipes to user database if there is a user
    addUserLikes(state.likes.likes);
  }
};
//List Controller takes ingredients and adds them to the array
const controlList = () => {
  if (!state.list) {
    state.list = new List();
  }
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
  });
  listView.toggleListBtn(true);
  //add ingredients from shopping list to the database
  addUserList(state.list.items);
};

//call controllers on button click to add a liked recipe or ingredients
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
  if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
});

//delete items from both object arrays, database, and UI on "delete" button click
elements.likesList.addEventListener('click', (e) => {
  const id = e.target.closest('.likes__item').dataset.likeid;
  if (e.target.matches('.likes__delete, .likes__delete *')) {
    state.likes.deleteLike(id);
    likesView.deleteLike(id);
    addUserLikes(state.likes.likes);
  }
});
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
    addUserList(state.list.items);
  }
});
