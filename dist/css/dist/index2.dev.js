"use strict";

//set up Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyCJ8rFpMai7DJRexW_0Up9sAjwMDRNST0o',
  authDomain: 'recipewebsite-6c3a8.firebaseapp.com',
  databaseURL: 'https://recipewebsite-6c3a8.firebaseio.com',
  projectId: 'recipewebsite-6c3a8',
  storageBucket: 'recipewebsite-6c3a8.appspot.com',
  messagingSenderId: '103916854940',
  appId: '1:103916854940:web:defd27ef83a5db46f41759'
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('user is signed in!');
    document.getElementById('login-div').style.display = 'none';
    document.getElementById('user-div').style.display = 'block';
    document.querySelector(".btn-navbar-users").innerHTML = "Sign Out <i class=\"fas fa-user-circle\" aria-hidden=\"true\"></i>";
    document.querySelector(".welcome-user").innerHTML = "Welcome ".concat(getUserEmail(), "!");
  } else {
    console.log('no user!');
    document.getElementById('login-div').style.display = 'block';
    document.getElementById('user-div').style.display = 'none';
    document.querySelector(".btn-navbar-users").innerHTML = "Sign In/Register <i class=\"fas fa-user-circle\" aria-hidden=\"true\"></i>";
  }
}); //get email from the user to display on the screen

getUserEmail = function getUserEmail() {
  var user = firebase.auth().currentUser;
  var userEmail;

  if (user != null) {
    userEmail = user.email;
  }

  return userEmail;
}; //user actions: log in, sign up, and sign out


login = function login() {
  var userEmail = document.getElementById('emailField').value;
  var userPassword = document.getElementById('passwordField').value;
  console.log(userEmail, userPassword);
  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)["catch"](function (error) {
    var errorMessage = error.message;
    window.alert('Unable to login. Make sure you entered the right email and the right password. Error: ', error);
    console.log(errorMessage);
  });
  document.querySelector(".welcome-user").innerHTML = "Welcome user! You have successfully logged in!";
};

signup = function signup() {
  var userEmail = document.getElementById('emailField').value;
  var userPassword = document.getElementById('passwordField').value;
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)["catch"](function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert('Unable to signup. Make sure you entered a valid email address and your password is at least 6 characters long. Error: ', error);
    console.log(errorMessage);
  });
  document.querySelector(".welcome-user").innerHTML = "Welcome user! You have successfully signed up!";
};

signout = function signout() {
  firebase.auth().signOut().then(function () {
    document.getElementById('login-div').style.display = 'block';
    document.getElementById('user-div').style.display = 'none';
  })["catch"](function (error) {
    window.alert('Error signing out due to server or connectivity problems.', error);
  });
};

document.querySelector(".signin-btn").addEventListener('click', function (e) {
  e.preventDefault();
  login();
});
document.querySelector(".signup-btn").addEventListener('click', function (e) {
  e.preventDefault();
  signup();
});
document.querySelector(".signout-btn").addEventListener('click', function (e) {
  e.preventDefault();
  signout();
});