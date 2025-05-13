var isShowHideAlready = true;
var url = window.location.href;
var tmpVersion = new Date().getMonth() + '' + new Date().getFullYear();

function getIdByDevice(key) {
    var int = $(window).width();
    var isMob = false;
    if (int < 992)
        isMob = true;
    return key + (isMob ? '_mob' : '');
}
var isMobile = false;
$(document).ready(function () {
    $(window).resize(function () {
        if ($(window).width() < 992) {
            $("html").addClass("vc_mobile");
            isMobile = true;
        } else {
            $("html").removeClass("vc_mobile");
            isMobile = false;
        }
        isShowHideAlready = !isShowHideAlready;
        $(window).scroll();
    });
    $(this).trigger('resize');
    if (navigator.appVersion.indexOf("Mac") != -1) {
        if (navigator.userAgent.search("Chrome") >= 0) {
            $("body").addClass('macos');
        }
        if (navigator.userAgent.search("Safari") >= 0) {
            $("body").addClass('safari');
        }
        if (navigator.userAgent.search("Firefox") >= 0) {
            $("body").addClass('macos');
        }
    }
    let xlang = $("html").attr('lang');
    $.ajaxSetup({ cache: false, headers: { 'x-lang': xlang } });
    $(window).bind('scroll', function () {
        if ($(window).scrollTop() > 80) {
            if (isShowHideAlready)
                return;
            $('nav').addClass('fixed-nav');
            $('.navbar-wrapper').addClass('fixed-nav-wrapper');
            $('.header-wrapper.mobile-hide').addClass('menu-sticky');
            $('.navbar-light .navbar-toggler').addClass('fixed-nav-btn');
            if ($("html").hasClass('vc_mobile')) {
                $(".mobile-show .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo.svg?v=' + tmpVersion);
            } else if (!$("html").hasClass('vc_mobile')) {
                $(".mobile-hide .white-bg-navbar .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo.svg?v=' + tmpVersion);
            }
            isShowHideAlready = true;
        } else {
            if (!isShowHideAlready)
                return;
            $('.navbar-wrapper').removeClass('fixed-nav-wrapper');
            $('.header-wrapper.mobile-hide').removeClass('menu-sticky');
            $('nav').removeClass('fixed-nav');
            $('.navbar-light .navbar-toggler').removeClass('fixed-nav-btn');
            if ($("html").hasClass('vc_mobile')) {
                if ($('.navbar-wrapper.mobile-show').hasClass('blue-background') || $('.navbar-wrapper.mobile-show').hasClass('whiet_logo_for_mob'))
                    $(".mobile-show .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo.svg?v=' + tmpVersion);
                else
                    $(".mobile-show .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo-color.svg?v=' + tmpVersion);
            } else if (!$("html").hasClass('vc_mobile')) {
                // if ($("body").hasClass('search') || $("body").hasClass('single-post'))
                //     $(".mobile-hide .white-bg-navbar .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo.svg?v=' + tmpVersion);
                // else
                //     $(".mobile-hide .white-bg-navbar .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo-color.svg?v=' + tmpVersion);
                $(".mobile-hide .white-bg-navbar .ulogoc").attr('src', get_template_directory_uri + '/assets/img/logo-color.svg?v=' + tmpVersion);
            }
            isShowHideAlready = false;
        }
    });
    $(window).scroll();
    try {
        $('.lazy').Lazy();
    } catch (error) { }
    // try {
    //     $('.magnify-img').zoom({
    //         'on': 'mouseover',
    //         'touch': true,
    //         'magnify': 1.5
    //     });
    // } catch (error) {
    // }
    var js_extra_owl_autoload = $(".js-extra-owl-autoload");
    js_extra_owl_autoload.each(function (index) {
        var navi = $(this).data('showarrow');
        var isLoop = $(this).data('loop');
        isLoop = (isLoop == 'no') ? false : true;
        navi = (typeof (navi) != 'undefined' && navi == 'no') ? false : true;
        var itemLength = $(this).find('.item').length;
        try {
            $(this).owlCarousel({
                loop: isLoop,
                margin: 20,
                autoplay: true,
                nav: navi,
                navText: [
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.636 18L8.27203 11.636L14.636 5.27208" stroke="#F7A637" stroke-linejoin="round"/></svg>',
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.36401 18L15.728 11.636L9.36401 5.27208" stroke="#FFFFFE" stroke-linejoin="round"/></svg>'
                ],
                items: itemLength,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1024: {
                        items: 2
                    },
                    1366: {
                        items: 3
                    }
                }
            });
        } catch (error) { }
    });
    $('.mob-menu-close').on('click', function () {
        if ($('.mobile-navbar .navbar-collapse').hasClass('show')) {
            $('.mobile-navbar .navbar-collapse').removeClass('show');
        }
    });
    if (window.location.hash != '') {
        $('.nav-tabs a[href="' + window.location.hash + '"]').tab('show');
    }
    try {
        $(".initToolTips").tooltip({ 'animation': true, 'placement': 'auto' });
    } catch (error) { }
    $(".logout").click(logout);
});

// $(window).on('resize scroll', function () {
//     let objV = $('#video-section');
//     if (objV.length <= 0) {
//         return;
//     }
//     if (objV.isInViewport()) {
//         $(".play-btn").trigger('click')
//     }
// });

function setCookie(cname, cvalue) {
    $.cookie(cname, cvalue, { path: '/' });
}

function getCookie(name, defaultVal = null) {
    if (name == '') {
        return defaultVal;
    }
    var val = $.cookie(name);
    if (val != undefined)
        return val;
    else
        return defaultVal;
}



function scrollToCustom(id) {
    var MinHeight = 0;
    try {
        var MinHeight = $(".navbar-wrapper").height();
    } catch (e) { }
    var aTag = $("#" + id);
    $('html,body').animate({ scrollTop: aTag.offset().top - MinHeight }, 'slow');
}

$(".scrollToCustom").click(function () {
    var id = $(this).data('scrollto-id');
    scrollToCustom(id);
});

$(".datahref").click(datahrefFunc);

function datahrefFunc() {
    var url = $(this).data('href');
    let target = '_self';
    if ($(this).data('target') != undefined)
        target = $(this).data('target');
    window.open(url, target);
}

$(".showTaxBreakUp").click(function () {
    $(".taxbreakdowns").toggleClass('hide');
    $(".showTaxBreakUp").toggleClass('hide-tax');
    $('.payment-container').toggleClass('taxes-fix-mob');
});

function block(id) {
    $(id).block({ message: null, overlayCSS: { backgroundColor: 'transparent' } });
}

function unblock(id) {
    $(id).unblock();
}

function msg(title, desc, type, showConsole = false) {
    if (showConsole)
        console.log(title + " - " + desc + " - " + type);
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "10000",
        "extendedTimeOut": "5000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    if (type == 'error') {
        toastr.error(desc, title);
    } else if (type == 'success') {
        toastr.success(desc, title);
    } else {
        toastr.info(desc, title);
    }
}

if (url.includes('contract-of-carriage')) {
    $(".vc_tta-tabs-list").find('a').on("click", function (e) {
        e.preventDefault();
        setTimeout(function () {
            window.history.pushState({}, "", url);
        }, 100);
    });
} else if (url.includes('about-us')) {
    $(".vc_tta-panel").find('a').on("click", function (e) {
        e.preventDefault();
        setTimeout(function () {
            window.history.pushState({}, "", url);
        }, 100);
    });
}

$("img.open-on-new-tab-img").click(function (e) {
    window.open($(this).attr('src'), '_blank');
});

let logoutVar = '';

function logout() {
    logoutVar.html = $(this).html();
    $(this).find('p').text('Logging Out');
    $.ajax({
        url: ajaxurl,
        type: "POST",
        data: { 'action': 'logout' },
        success: function (response) {
            response = JSON.parse(response);
            if (response.status) {
                window.location.href = response.url;
            } else {
                $(".logout").html(logoutVar.html);
                msg('Logout', response.msg, 'warning');
            }
        },
        error: function () {
            $(".logout").html(logoutVar.html);
            msg('Logout', 'It\'s not you, it\'s internet fault.', 'error');
        }
    });
}