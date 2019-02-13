$(function () {
    $(document).scroll(function () {
        var $nav = $(".navbar-fixed-top");
        $nav.toggleClass('scrolled1', $(this).scrollTop() > $nav.height());
    });
    $("#myBtn").click(function () {
        $("#myModal").modal();
    });
    $('.myDiv').toggleClass('scrolled', $(this).scrollTop() > 50);
    $("#navbar-left-brand").click(function () {
        $("#locate-search").toggle();
        $("#locate-me").toggle();
    });
    $("#navbar-left-brand-tab").click(function () {
        $("#locate-search-tab").toggle();
        $("#locate-me-tab").toggle();
    });
    $("#navbar-left-brand-mob").click(function () {
        $("#locate-search-mob").toggle();
        $("#locate-me-mob").toggle();
    });
    $('#input_geo_location').blur(function () {
        if ($('#input_geo_location').val() != '') {
            $('#input_geo_location').attr('value', $('#input_geo_location').val());
        } else {
            $('#input_geo_location').attr('value', '');
        }
    });
});


// $(window).scroll(function () {
//     if (parseInt($(window).scrollTop()) > 50) {
//         $('.nav-desktop').find('a.navbar-brand').find('img').attr('src', '../assets/images/1428568091-Attachment-1.png');
//         //$('.nav-desktop').find('img').attr('height','22px !important');
//         //change src
//         //$('#custom-nav').addClass('affix');
//         $(".navbar-fixed-top").addClass("top-nav-collapse");

//     } else {
//         //$('#custom-nav').removeClass('affix');
//         $(".navbar-fixed-top").removeClass("top-nav-collapse");
//         $('.navbar-brand').find('img').attr('src', '../assets/images/w_logo.png');
//         // $('.nav-desktop').find('img').attr('height','33px');
//     }
// });
// $(window).scroll(function () {
//     if ($(".nav-mob").offset().top > 50) {
//         //$('#custom-nav').addClass('affix');
//         $(".navbar-fixed-top").addClass("top-nav-collapse");
//         $('.nav-mob').find('.navbar-brand img').attr('src', '../assets/images/1428568091-Attachment-1.png'); //change src
//         // $('.nav-desktop').find('img').attr('height','22px !important');
//     } else {
//         // $('#custom-nav').removeClass('affix');
//         $(".navbar-fixed-top").removeClass("top-nav-collapse");
//         $('.nav-mob').find('.navbar-brand img').attr('src', '../assets/images/w_logo.png');
//         // $('.nav-desktop').find('img').attr('height','33px !important');
//     }
// });
