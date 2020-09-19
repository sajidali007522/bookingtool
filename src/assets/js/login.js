$(function () {
  alert("included")
  $('#tabsCustom a').on('click',function(){
    var newContents = $(this).attr('href').slice(1);
    $('.tabs-content').hide();
    $('#'+newContents).show();

    $('#tabsCustom li').removeClass('active');
    $(this).parent().addClass('active');
    return false;
  });
  $('.js-forgetPass').on('click',function(){
    $(".login-nav li:nth-child(2) a").trigger('click');
    return false;
  });

  var classes = ['variation-1','variation-2', 'variation-3', 'variation-4', 'variation-5'];
  var randomnumber = Math.floor(Math.random()*classes.length);
  $('body').addClass(classes[randomnumber]);

});
