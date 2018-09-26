'use strict';

// Check local stroage for userId and create if needed
let happeningId;
function getUserId() {
  if (!localStorage.getItem('happeningId')) {
    happeningId = !!happeningId ? happeningId : createhappeningId();
    localStorage.setItem('happeningId', happeningId);
  } else {
    happeningId = !!happeningId ? happeningId : localStorage.getItem('happeningId');
  }
  createMyHappeningLink(happeningId);
};

function createhappeningId() {
  let str = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return str;
};

// Pass the proper query string to my happenings link
function createMyHappeningLink(id) {
  $('.my-happenings-link').attr('href', `/my-happenings?happeningId=${id}`);
}

// Call functions on page load
getUserId();

// Hamburger Menu Controls for nav.ejs
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

// Populate hidden field in create new form
function populateHiddenInput() {
  $('#hidden-input-for-id').val(happeningId);
}

// Refresh button on index page for getting different stories
$('#refresh').on('click', () => {
  window.location.href=window.location.href
});

//appends an "active" class to .popup and .popup-content when the "Instructions" button is clicked
$(".open").on("click", function() {
  $(".popup-overlay, .popup-content").addClass("active");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
$(".close, .popup-overlay").on("click", function(){
  $(".popup-overlay, .popup-content").removeClass("active");
});


