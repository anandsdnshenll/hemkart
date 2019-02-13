
      $('.cta-open').on('click', function() {
        $('.toggle-form, .formwrap, .toggle-bg').addClass('active');
        $('.icon-close').addClass('open');
        $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
        $('.icon-close1').removeClass('open');
    });
   $('.icon-close').on('click', function() {
        $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
        $('.icon-close').removeClass('open');
    });
      $('.toggle-bg').on('click', function() {        
        $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
        $('.icon-close').removeClass('open');
    });
      $('.toggle-bg1').on('click', function() {
        $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
        $('.icon-close1').removeClass('open');
    });
      $('.cta-open1').on('click', function() {
        $('.toggle-form1, .formwrap1, .toggle-bg1').addClass('active');
        $('.icon-close1').addClass('open');
         $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
        $('.icon-close').removeClass('open');
    });
   $('.icon-close1').on('click', function() {
        $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
        $('.icon-close1').removeClass('open');
    });
   $('.cta-open3').on('click', function() {
        $('.toggle-form3, .formwrap3, .toggle-bg3').addClass('active');
        $('.icon-close3').addClass('open');
         $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
        $('.icon-close').removeClass('open');
    });
   $('.icon-close3').on('click', function() {
        $('.toggle-form3, .formwrap3, .toggle-bg3').removeClass('active');
        $('.icon-close3').removeClass('open');
    });
   $('.cta-open4').on('click', function() {
        $('.toggle-form4, .formwrap4, .toggle-bg4').addClass('active');
        $('.icon-close4').addClass('open');
         $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
        $('.icon-close').removeClass('open');
    });
   $('.icon-close4').on('click', function() {
        $('.toggle-form4, .formwrap4, .toggle-bg4').removeClass('active');
        $('.icon-close4').removeClass('open');
    });

$(document).scroll(function(){

     $('.formwrap').toggleClass('scrolled', $(this).scrollTop() > 50);
     $('.formwrap1').toggleClass('scrolled', $(this).scrollTop() > 50);
     $('.formwrap4').toggleClass('scrolled', $(this).scrollTop() > 50);
     $('.footer_container').toggleClass('scrolled', $(this).scrollTop() > 50);
 });