// Global app controller
//use axios instead of fetch
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';

var firebaseConfig = {
  apiKey: 'AIzaSyCJ8rFpMai7DJRexW_0Up9sAjwMDRNST0o',
  authDomain: 'recipewebsite-6c3a8.firebaseapp.com',
  databaseURL: 'https://recipewebsite-6c3a8.firebaseio.com',
  projectId: 'recipewebsite-6c3a8',
  storageBucket: 'recipewebsite-6c3a8.appspot.com',
  messagingSenderId: '103916854940',
  appId: '1:103916854940:web:defd27ef83a5db46f41759',
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.localStorage.clear();
    console.log('from index js: user is signed in!');
    console.log(user.uid);
    document.querySelector(
      `.btn-navbar-users`
    ).innerHTML = `<a href="css/signin.html">Sign Out<i class="fa fa-shopping-cart" aria-hidden="true"></i></a>`;
    /*loadUserItems('likes');
    loadUserItems('list');*/

  } else {
    console.log('no user!');
  }
});



const loadUserItems = (items) => {
 if (firebase.auth().currentUser !== null) {
   console.log('loading user items!');
    var user = firebase.auth().currentUser;
    if (items === 'likes') {
      firebase
        .database()
        .ref('users/' + user.uid + '/likes/')
        .on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
         var childData = childSnapshot.val();
            console.log(childData)
              return childData;
          });
        });
    } else if (items === 'list') {
      firebase
        .database()
        .ref('users/' + user.uid + '/list/')
        .on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            console.log(childData);
            return childData;
          });
        });
    }
  
}
};
//works
const addUserLikes = async(likes) => {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    firebase
      .database()
      .ref('users/' + user.uid + '/likes/')
      .push({
        likes: likes,
      });
    //console.log('added to the likes database : ', likes);
  }
};
//works
const addUserList = (list) => {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    firebase
      .database()
      .ref('users/' + user.uid + '/list/')
      .push({
        list: list,
      });
    //console.log('added to the list database : ', list);
  }
};
//State of the app: Search Object, Current Recipe Object, Shopping List Object, Liked Recepes
const state = {};
window.state = state;

window.addEventListener('load', () => {
  state.likes = new Likes();
  state.list = new List();
  if(firebase.auth().currentUser === null){
  state.likes.readStorage();
  state.list.readStorage();
  }
  var isClicked1 = false;
  var isClicked2 = false;

  elements.likesButton.addEventListener('click', async() => {
    if(firebase.auth().currentUser !== null) {
      window.localStorage.clear();
      await firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/likes/').on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
       var childData = childSnapshot.val();
       //console.log("childData: ", childData)
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
      isClicked1 = true;
      isClicked2 = true;
      elements.likesButton.style.backgroundColor = '#C9CBA3';
      elements.shoppingButton.style.backgroundColor = '#e26d5c';
      listView.hideList();
      document.querySelector(`.likes-shopping-heading`).innerHTML =
        'Liked Recipes';
      state.likes.likes.forEach((like) => {
          likesView.renderLike(like);
      });
      addUserLikes(state.likes.likes);
    }
  });
  elements.shoppingButton.addEventListener('click', async() => {
    if(firebase.auth().currentUser !== null) {
      window.localStorage.clear();
      await firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/list/').on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
       var childData = childSnapshot.val();
       //console.log("childData: ", childData)
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
      addUserList(state.list.items);
    }
  });
});
/**
 * Search Controller
 */
const controlSearch = async () => {
  //1) Get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) new search obj, add to state
    state.search = new Search(query);

    //3) Prepare UI for reslults, clear input and reulsts
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    //4) Search for recipes
    await state.search.getResults();

    //5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * Recipe Controller
 */
//works
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    //prepae UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //new recipe obj
    state.recipe = new Recipe(id);

    //get recipe data
    try{
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    //CalcTime and CalcServings
    state.recipe.calcTime();
    state.recipe.calcServings();
    
    //Render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)
    );
  }catch(error){
    console.log(error);
    alert('Error loading the recipe. There could be an issue with the recipe API or connection.', error)
  }
  }
}

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
/**
 * LIKE CONTROLLER
 */

const controlLike = async() => {
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
    addUserLikes(state.likes.likes);
  }
};
/**
 * LIST CONTROLLER
 */
const controlList = () => {
  //create a new list if there isn't one yet
  if (!state.list) {
    state.list = new List();
  }
  //add each igredient to list and ui
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
  });

  listView.toggleListBtn(true)
  addUserList(state.recipe.ingredients);
};
// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
  if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    listView.deleteItem(id);
    addUserList(state.list.items);
  }
});

elements.likesList.addEventListener('click', (e) => {
  const id = e.target.closest('.likes__item').dataset.likeid;

  if (e.target.matches('.likes__delete, .likes__delete *')) {
    // Delete from state
    state.likes.deleteLike(id);
    likesView.deleteLike(id);
    addUserLikes(state.likes.likes);
  }
});

const returnLikes = () => {
  return state.likes;
};

const returnList = () => {
  return state.list;
};
