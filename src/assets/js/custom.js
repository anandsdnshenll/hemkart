$(function () {
    $(document).scroll(function () {
        var $nav = $(".navbar-fixed-top");
        $nav.toggleClass('scrolled1', $(this).scrollTop() > $nav.height());
    });
    $("#myBtn").click(function () {
        $("#myModal").modal();
    });
    $('.myDiv').toggleClass('scrolled', $(this).scrollTop() > 50);
    // $("#navbar-left-brand").click(function () {
    //     $("#locate-search").toggle();
    //     $("#locate-me").toggle();
    // });
    // $("#navbar-left-brand-tab").click(function () {
    //     $("#locate-search-tab").toggle();
    //     $("#locate-me-tab").toggle();
    // });
    // $("#navbar-left-brand-mob").click(function () {
    //     $("#locate-search-mob").toggle();
    //     $("#locate-me-mob").toggle();
    // });
    $('#input_geo_location').blur(function () {
        if ($('#input_geo_location').val() != '') {
            $('#input_geo_location').attr('value', $('#input_geo_location').val());
        } else {
            $('#input_geo_location').attr('value', '');
        }
    });
});

