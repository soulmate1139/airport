$(".find-my-booking").click(function() {
    var book_no = $("#" + getIdByDevice('confirm_no')).val();
    var full_name = $("#" + getIdByDevice('full_name')).val();
    if (book_no.length < 3) {
        msg('Missing', 'Please enter valid confirm number code', "error");
    } else if (full_name.length <= 0) {
        msg('Missing', 'Please enter valid last name', "error");
    } else {
        $(this).html('<img src="' + flightLoadings[1] + '" />');
        $(this).addClass('disabled');
        var datas = {
            action: 'get-my-reservation-booking-details',
            nonce: $("#nonce").val(),
            confirm_no: book_no,
            full_name: full_name
        };
        $.ajax({
            url: ajaxurl,
            type: "POST",
            data: datas,
            success: function(response) {
                response = JSON.parse(response);
                if (response.status) {
                    window.location.href = response.url;
                } else {
                    $(".find-my-booking").removeClass('disabled');
                    $(".find-my-booking").html(ogTextOnButton);
                    msg('Error', response.msg, 'error');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                msg('Error', 'Something really bad happened', 'error');
                $(".find-my-booking").removeClass('disabled');
                $(".find-my-booking").html("Find my booking");
            }
        });
    }
});

$(document).ready(function() {
    ogTextOnButton = $(".find-my-booking").html();
    $("#confirm_no").mask('Z', { translation: { 'Z': { pattern: /[a-zA-Z0-9]/, recursive: true } } });
    $("#confirm_no_mob").mask('Z', { translation: { 'Z': { pattern: /[a-zA-Z0-9]/, recursive: true } } });
    $("#full_name").mask('Z', { translation: { 'Z': { pattern: /[a-zA-Z 0-9 ]/, recursive: true } } });
    $("#full_name_mob").mask('Z', { translation: { 'Z': { pattern: /[a-zA-Z 0-9 ]/, recursive: true } } });
    //callForOrderRetrive();
    isDoneOrderCall = "yes";
});

function callForOrderRetrive() {
    var oid = $("#oid").val();
    if ($.trim(oid).length <= 0)
        return;
    var datas = { "action": "order-Retrive", "oid": oid };
    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: datas,
        success: function(response) {
            isDoneOrderCall = "yes";
        },
        error: function(a, b, c) {
            isDoneOrderCall = "error";
        }
    });
}

$("#confirm_no,#confirm_no_mob").blur(function() {
    var obj = $(this);
    obj.val(obj.val().toUpperCase());
});

var ogTextOnButton = '';
var isDoneOrderCall = "no";

function isDoneCallOrderCanGo() {
    var canGo = false;
    if (isDoneOrderCall == "error") {
        msg("Error", "Oops! Please refresh page and later again later.", "error");
    } else if (isDoneOrderCall == "yes")
        canGo = true;
    else
        msg("Please wait", "We are getting latest information.", "info");
    return canGo;
}

function showTicket(oid) {
    var win = window.open(siteurl + '/flight-ticket/?oid=' + oid, '_blank');
    win.focus();
}

$('.downloadBtn').click(function() {
    if (!isDoneCallOrderCanGo())
        return;
    var oid = $(this).data('oid');
    var token = $(this).data('token');
    var isloading = $(this).data('isloading');
    if (isloading)
        return;
    $(this).data('isloading', true);
    $(this).html('<img src="' + flightLoadings[2] + '" />');
    var datas = { "action": "download-pdf", "oid": oid, "key": token, "nonce": $("#donwloadNonce").val() };
    $.ajax({
        "url": ajaxurl,
        "type": "POST",
        "data": datas,
        success: function(response) {
            $('.downloadBtn').data('isloading', false);
            $('.downloadBtn').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
            response = JSON.parse(response);
            if (response.status) {
                msg('Download', response.msg, 'success');
                var link = document.createElement('a');
                link.href = response.downloadUrl;
                link.download = response.name;
                link.dispatchEvent(new MouseEvent('click'));
            } else {
                msg('Download', response.msg, 'error');
            }
        },
        error: function(a, b, c) {
            $('.downloadBtn').data('isloading', false);
            $('.downloadBtn').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
        }
    });
});

$('.select-seat').click(function() {
    if (!isDoneCallOrderCanGo())
        return;
    var oid = $(this).data('oid');
    var token = $(this).data('token');
    var isloading = $(this).data('isloading');
    if (isloading)
        return;
    $(this).data('isloading', true);
    $(this).find('img').attr('src', flightLoadings[2]);
    var datas = { "action": "start-seat-reshop", "oid": oid, "key": token, "nonce": $("#seatNonce").val() };
    $.ajax({
        "url": ajaxurl,
        "type": "POST",
        "data": datas,
        success: function(response) {
            $('.select-seat').data('isloading', false);
            $('.select-seat').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
            response = JSON.parse(response);
            if (response.status) {
                window.location.href = response.url;
            } else {
                msg('Assign Seat', response.msg, 'error');
            }
        },
        error: function(a, b, c) {
            $('.select-seat').data('isloading', false);
            $('.select-seat').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
        }
    });
});


$('.select-ancillary').click(function() {
    if (!isDoneCallOrderCanGo())
        return;
    var oid = $(this).data('oid');
    var token = $(this).data('token');
    var isloading = $(this).data('isloading');
    if (isloading)
        return;
    $(this).data('isloading', true);
    $(this).find('img').attr('src', flightLoadings[2]);
    var datas = { "action": "start-ancillary-reshop", "oid": oid, "key": token, "nonce": $("#ancillaryNonce").val() };
    $.ajax({
        "url": ajaxurl,
        "type": "POST",
        "data": datas,
        success: function(response) {
            $('.select-ancillary').data('isloading', false);
            $('.select-ancillary').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
            response = JSON.parse(response);
            if (response.status) {
                window.location.href = response.url;
            } else {
                msg('Add-Ons', response.msg, 'error');
            }
        },
        error: function(a, b, c) {
            $('.select-ancillary').data('isloading', false);
            $('.select-ancillary').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
        }
    });
});

$(".reshop-select").click(function() {
    if (!isDoneCallOrderCanGo())
        return;
    var isLoading = $(this).data('isloading');
    if (isLoading)
        return;
    $(this).data('isloading', true);
    $(this).html('<img src="' + flightLoadings[2] + '" />');
    var datas = {
        'action': 'reshop-start-check',
        'nonce': $("#nonce").val(),
        'oid': $(this).data('oid'),
        'token': $(this).data('token')
    };
    $.ajax({
        url: ajaxurl,
        type: "POST",
        data: datas,
        success: function(response) {
            response = JSON.parse(response);
            if (response.status) {
                window.location.href = response.url;
            } else {
                msg('Oops!', response.msg, 'error');
            }
            $(".reshop-select").data('isloading', false);
            $('.reshop-select').find('img').attr("src", get_template_directory_uri + '/assets/img/arrow_yellow.svg');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            msg('Error', 'Something really bad happened', 'error');
            $(".reshop-select").data('isloading', false);
            $(".reshop-select").html('Select');
        }
    });
});