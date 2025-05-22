$(function(){
  /*=================================================
  ハンバーガーメニュー
  ===================================================*/
  $('.hamburger').click(function() {
    if ($('#header').hasClass('open')) {
      $('#header').removeClass('open');
    } else {
      $('#header').addClass('open');
    }
  });

  $('.mask').click(function() {
    $('#header').removeClass('open');
  });

  /*=================================================
  スムーススクロール
  ===================================================*/
  $('a[href^="#"]').click(function(){
    let href= $(this).attr("href");
    let target = $(href == "#" || href == "" ? 'html' : href);
    let position = target.offset().top;
    $("html, body").animate({scrollTop:position}, 600, "swing");
    return false;
  });

  /*=================================================
  企業情報（サイドメニュー）
  ===================================================*/
  $(window).scroll(function() {
    if($('div').hasClass('side-menu')){
      let mission = $('#mission').offset().top - $(window).scrollTop();
      let summary = $('#summary').offset().top - $(window).scrollTop();
      let history = $('#history').offset().top - $(window).scrollTop();
      let organization = $('#organization').offset().top - $(window).scrollTop();
      let access = $('#access').offset().top - $(window).scrollTop();

      if(mission < 100) {
        $('.side-menu li').removeClass('active');
        $('.side-menu .menu-mission').addClass('active');
      }
      if(summary < 100) {
        $('.side-menu li').removeClass('active');
        $('.side-menu .menu-summary').addClass('active');
      }
      if(history < 100) {
        $('.side-menu li').removeClass('active');
        $('.side-menu .menu-history').addClass('active');
      }
      if(organization < 100) {
        $('.side-menu li').removeClass('active');
        $('.side-menu .menu-organization').addClass('active');
      }
      if(access < 100) {
        $('.side-menu li').removeClass('active');
        $('.side-menu .menu-access').addClass('active');
      }
    }
  });

  /*=================================================
  カルーセルスライダー（現在未使用）
  ===================================================*/
  if($('ul').hasClass('slider')){
    $('.slider').slick({
      slidesToScroll: 1,
      centerMode: true,
      variableWidth: true,
      arrows: true,
      prevArrow:'<div class="prev"></div>',
      nextArrow:'<div class="next"></div>'
    });
  }
});