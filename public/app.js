'use strict';

// $( document ).ready(function() {

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

//});