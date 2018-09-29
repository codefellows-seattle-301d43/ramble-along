'use strict';

// Check local stroage for userId and create if needed
let happeningId;
// It's weird to me that you call this getUserId, but it also has the effect of modifying the link on the page. I'd rather not give this function a "get" name, because then I expect it not to have a large side effect like that.
function getUserId() {
  if (!localStorage.getItem('happeningId')) {
    // you might want to know about ||=
    // i.e. happeningId ||= createhappeningId();
    happeningId = happeningId ? happeningId : createhappeningId();
    localStorage.setItem('happeningId', happeningId);
  } else {
    happeningId = happeningId ? happeningId : localStorage.getItem('happeningId');
  }
  createMyHappeningLink(happeningId);
}

// would prefer to capitalize this createHappeningId()
function createhappeningId() {
  let str = '';
  // this is simultaneously horrifying and beautiful.
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return str;
}

// Pass the proper query string to my happenings link
function createMyHappeningLink(id) {
  $('.my-happenings-link').attr('href', `/my-happenings?happeningId=${id}`);
}

// Call functions on page load
getUserId();

// Hamburger Menu Controls for nav.ejs
const $menu = $('.menu');
$menu.hide();
$( '.hamburger' ).on('click', function() {
  $menu.slideToggle( 'slow', function() {
    $( '.hamburger' ).hide();
  });
});

$( '.cross' ).on('click', function() {
  $menu.slideToggle( 'slow', function() {
    $( '.hamburger' ).show();
  });
});

$(window).on('scroll', function (e) {
  if ($(window).width() < 768 && !$menu.is(e.target) && $menu.has(e.target).length === 0){
    $menu.hide();
    $( '.hamburger' ).show();
  }
});
// Really like all of the comments on these!

// Populate hidden field in create new form
// could use an eslint-ignore, since you won't call it in this file
function populateHiddenInput() {
  $('#hidden-input-for-id').val(happeningId);
}

// Refresh button on index page for getting different stories
$('#refresh').on('click', () => {
  window.location.href=window.location.href;
});

//appends an "active" class to .popup and .popup-content when the "Instructions" button is clicked
$('.open').on('click', function() {
  $('.popup-overlay, .popup-content').addClass('active');
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked
$('.close, .popup-overlay').on('click', function(){
  $('.popup-overlay, .popup-content').removeClass('active');
});


