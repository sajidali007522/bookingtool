/*
$(document).ready(function () {
  if ($(window).width() > 1060) {
    $(".menu-icon").click (function () {
      if( $(this).hasClass('active') ){
        $(this).removeClass('active');
        $("body").removeClass('menu-fullwidth');
      }
      else{
        $(this).addClass('active');
        $("body").addClass('menu-fullwidth');
      }
      return false;
    });
  }
  if ($(window).width() < 1060) {
    $(".menu-icon").click (function () {
      if( $(this).hasClass('active') ){
        $(this).removeClass('active');
        $("body").removeClass('menu-active');
      }
      else{
        $(this).addClass('active');
        $("body").addClass('menu-active');
      }
      return false;
    });
  }

  $(".theme-light").click (function () {
      $("body").addClass('theme-light');
    return false;
  });
  $(".theme-dark").click (function () {
      $("body").removeClass('theme-light');
    return false;
  });

  // custom accordion
  $(".custom-accordion > h3 > a").click (function () {
    if( $(this).parent().hasClass('active') ){
      $(this).parent().removeClass('active');
      $(this).parent().next('.custom-accordion-content').slideUp();
    }
    else{
      $(this).parent().addClass('active');
      $(this).parent().next('.custom-accordion-content').slideDown();
    }
    return false;
  });

});*/
