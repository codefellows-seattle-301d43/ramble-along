'use strict';

// Check local storage and populate myHapsIds array
let myHapsIds = [];
function populateMyHaps() {
  if (localStorage.getItem('myHapsArr')) {
    myHapsIds = JSON.parse(localStorage.getItem('myHapsArr'));
  }
}
populateMyHaps();

// Hamburger Menu Controlls for nav.ejs
$( '.cross' ).hide();
$( '.menu' ).hide();
$( '.hamburger' ).on('click', function() {
  $( '.menu' ).slideToggle( 'slow', function() {
    $( '.hamburger' ).hide();
    $( '.cross' ).show();
  });
});

$( '.cross' ).on('click', function() {
  $( '.menu' ).slideToggle( 'slow', function() {
    $( '.cross' ).hide();
    $( '.hamburger' ).show();
  });
});

// Function that fires on loading my-happenings.ejs
function pushToMyHaps(id) {
  myHapsIds.push(id);
  const myHapsStr = JSON.stringify(myHapsIds);
  localsStorage.setItem('myHapsArr', myHapsStr);
};

// Function that populates hidden inputs with id numbers
// function populateHiddenInput() {
  
// }