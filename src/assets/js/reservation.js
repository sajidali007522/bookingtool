$(function () {

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

});
