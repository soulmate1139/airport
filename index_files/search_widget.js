var orgData = [];
var desData = [];
var ajaxRequestVariableDT = null;
let dtObj = null;
let dtObj_mob = null;
var triptype;

$(function () {
    $("#flight_from,#flight_from_mob").autocomplete({
        autoFocus: true,
        appendTo: "#" + getIdByDevice('from_div'),
        open: function () {
            $(".ui-autocomplete").css({ top: 60 });
        },
        source: function (request, response) {
            if (orgData.length > 0) {
                var newDataTmp = [];
                for (let index = 0; index < orgData.length; index++) {
                    var curVal = orgData[index];
                    if (curVal.status == false)
                        continue;
                    if (curVal.iata.includes(request.term.toUpperCase()))
                        newDataTmp.push(curVal);
                    else if (curVal.name.toLowerCase().includes(request.term.toLowerCase()))
                        newDataTmp.push(curVal);
                    else if (request.term.length <= 0)
                        newDataTmp.push(curVal);
                }
                response($.map(newDataTmp, function (val) {
                    return {
                        airport: val.airport,
                        label: val.name,
                        value: val.name,
                        code: val.iata
                    };
                }));
            } else {
                var datas = {
                    "action": "get_org_routes"
                };
                $.ajax({
                    url: ajaxurl,
                    type: "POST",
                    data: datas,
                    success: function (data) {
                        var ArrRoutes = JSON.parse(data);
                        orgData = $.map(ArrRoutes, function (val) {
                            var shortName = '';
                            if (val.city_name != null) {
                                shortName = val.city_name;
                            }
                            return {
                                airport: val.title,
                                iata: val.org,
                                name: shortName,
                                status: true
                            };
                        });
                        var ObjData = displayAscOrder(orgData);
                        response($.map(ObjData, function (val) {
                            return {
                                airport: val.airport,
                                label: val.name,
                                value: val.name,
                                code: val.iata
                            };
                        }));

                    },
                    error: function (jqXHR, textStatus, errorThrown) { }
                });

            }
        },
        messages: {
            noResults: '',
            results: function (amount) {
                return ''
            }
        },
        create: function () {
            $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                return $('<li>')
                    .append('<div><div>' + item.label + ' <span>' + item.airport + '</span></div><span class="airportcode_custom">' + item.code + '</span></div>')
                    .appendTo(ul);
            };
        },
        minLength: 0,
        select: function (event, ui) {
            event.preventDefault();
            flights_from_to_array[0] = [ui.item.label, ui.item.code];
            selectedAutoComplete("flight_from", flights_from_to_array[0]);
            flight_json_days = [];
            dateInit();
            desData = [];
        }
    });
    $("#flight_to,#flight_to_mob").autocomplete({
        autoFocus: true,
        appendTo: "#" + getIdByDevice('to_div'),
        open: function () {
            $(".ui-autocomplete").css({ top: 60 });
        },
        source: function (request, response) {
            if (desData.length > 0) {
                var newDataTmp = [];
                for (let index = 0; index < desData.length; index++) {
                    var curVal = desData[index];
                    if (curVal.status == false)
                        continue;
                    if (curVal.iata.includes(request.term.toUpperCase()))
                        newDataTmp.push(curVal);
                    else if (curVal.name.toLowerCase().includes(request.term.toLowerCase()))
                        newDataTmp.push(curVal);
                    else if (request.term.length <= 0)
                        newDataTmp.push(curVal);
                }
                response($.map(newDataTmp, function (val) {
                    return {
                        airport: val.airport,
                        label: val.name,
                        value: val.name,
                        code: val.iata
                    };
                }));
            } else {
                var datas = {
                    "action": "get_des_routes",
                    "org_code": flights_from_to_array[0][1]
                };
                $.ajax({
                    url: ajaxurl,
                    type: "POST",
                    data: datas,
                    success: function (data) {
                        var ArrRoutes = JSON.parse(data);
                        desData = $.map(ArrRoutes, function (val) {
                            var shortName = '';
                            if (val.city_name != null) {
                                shortName = val.city_name;
                            }
                            return {
                                airport: val.title,
                                iata: val.des,
                                name: shortName,
                                status: true
                            };
                        });
                        var ObjData = displayAscOrder(desData);
                        response($.map(ObjData, function (val) {
                            return {
                                airport: val.airport,
                                label: val.name,
                                value: val.name,
                                code: val.iata
                            };
                        }));

                    },
                    error: function (jqXHR, textStatus, errorThrown) { }
                });
            }
        },
        messages: {
            noResults: '',
            results: function (amount) {
                return ''
            }
        },
        create: function () {
            $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                return $('<li>')
                    .append('<div><div>' + item.label + ' <span>' + item.airport + '</span></div><span class="airportcode_custom">' + item.code + '</span></div>')
                    .appendTo(ul);
            };
        },
        minLength: 0,
        select: function (event, ui) {
            event.preventDefault();
            flights_from_to_array[1] = [ui.item.label, ui.item.code];
            selectedAutoComplete("flight_to", flights_from_to_array[1]);
            flight_json_days = [];
            dateInit();
        }
    });
    loadFromCookie();
    $(".seg-switch-oneway").removeClass('active');
    $(".seg-switch-roundtrip").removeClass('active');
    $(".seg-switch-" + triptype).addClass('active');
    if (triptype == 'oneway') {
        $(".date-sect-roundtrip").addClass('c-disabled');
    } else {
        $(".date-sect-roundtrip").removeClass('c-disabled');
    }
    dateInit();
});

$(".actions").click(function () {
    $(this).parent('.dropdown_toggle').find('.selected_options').children(":first").trigger('focus');
});

$(".label-block").click(function () {
    $(this).parent('.select-control').find('.selected_options').children(":first").trigger('focus');
});

$(".swap-block").click(function () {
    var flights_from_to_array_from = JSON.stringify(flights_from_to_array[0]);
    var flights_from_to_array_to = JSON.stringify(flights_from_to_array[1]);
    flights_from_to_array_from = JSON.parse(flights_from_to_array_from);
    flights_from_to_array_to = JSON.parse(flights_from_to_array_to);
    flights_from_to_array[0] = flights_from_to_array_to;
    flights_from_to_array[1] = flights_from_to_array_from;
    selectedAutoComplete("flight_from", flights_from_to_array[0]);
    selectedAutoComplete("flight_to", flights_from_to_array[1]);
    flight_json_days = [];
    dateInit();
});

function selectedAutoComplete(id, values) {
    var html = '';
    if (values[0] != '' && values[1] != '') {
        var html = '<div class="selected-autocomplete">' + values[0] + ' <span>' + values[1] + '</span></div>';
    }
    $("#" + id).html(html);
    $("#" + id + '_mob').html(html);
}

function loadFromCookie() {
    var code_from = getCookie('airport_code_from', '');
    var code_to = getCookie('airport_code_to', '');
    var name_from = getCookie(code_from, '');
    var name_to = getCookie(code_to, '');
    triptype = getCookie('triptype', 'roundtrip');
    var date_from = getCookie('date_from', '');
    var date_to = '';
    flights_from_to_array[0] = [name_from, code_from];
    flights_from_to_array[1] = [name_to, code_to];
    passenger_ctr_adult = parseInt(getCookie('passenger_ctr_adult', 1));
    passenger_ctr_child = parseInt(getCookie('passenger_ctr_child', 0));
    passenger_ctr_infant = parseInt(getCookie('passenger_ctr_infant', 0));
    date_to = getCookie('date_to', '');
    selectedAutoComplete("flight_from", flights_from_to_array[0]);
    selectedAutoComplete("flight_to", flights_from_to_array[1]);
    $("#dt_s_cus").val(date_from);
    $("#dt_e_cus").val(date_to);
    passenger_render();
}

var flight_routes = [];
var flights_from_to_array = [];
var flight_json_days = [];

function dateInit() {
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentDate = date.getDate();
    var currentYear = date.getFullYear();
    if (flight_json_days.length <= 0) {
        if (flights_from_to_array[0][1] != '' && flights_from_to_array[1][1] != '') {
            var duration = 6;
            var end_date = new Date(date.getTime() + (duration * 24 * 60 * 60 * 1000));
            var datas = {
                "action": "get_flight_availability",
                "minDate": moment().subtract(1, "days").format("DD/MM/YYYY"),
                "org_code": flights_from_to_array[0][1],
                "des_code": flights_from_to_array[1][1],
                "start_date": moment(new Date(currentYear, currentMonth, currentDate)).format("YYYY-MM-DD"),
                "end_date": moment(new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())).format("YYYY-MM-DD"),
                "duration": duration
            };
            if (ajaxRequestVariableDT != null) {
                if (ajaxRequestVariableDT.readyState > 0 && ajaxRequestVariableDT.readyState < 4) {
                    ajaxRequestVariableDT.abort();
                }
            }
            $('#dates_from,#dates_mob_from').prop('disabled', true).addClass('ui-autocomplete-loading');
            if (triptype != 'oneway') {
                $('#dates_to,#dates_mob_to').prop('disabled', true).addClass('ui-autocomplete-loading');
            }
            ajaxRequestVariableDT = $.ajax({
                url: ajaxurl,
                type: "POST",
                data: datas,
                success: function (data) {
                    $('#dates_from,#dates_mob_from').prop('disabled', false).removeClass('ui-autocomplete-loading');
                    if (triptype != 'oneway') {
                        $('#dates_to,#dates_mob_to').prop('disabled', false).removeClass('ui-autocomplete-loading');
                    }
                    var AvailableDates = JSON.parse(data);
                    if (AvailableDates['status'] == true) {
                        flight_json_days = AvailableDates['data'];
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) { }
            });
        }
    }
    var sdt = $("#dt_s_cus").val();
    if (sdt != '') {
        start = moment(sdt, 'DDMMMYYYY');
        var edt = $("#dt_e_cus").val();
        if (edt != '') {
            end = moment(edt, 'DDMMMYYYY');
        }
    }
    let dtOptions = {};
    let dtOptions_mob = {};
    let yesterdayDt = new Date();
    yesterdayDt.setDate(yesterdayDt.getDate() - 1);
    if (dtObj != null) {
        dtObj.destroy();
    }
    if (dtObj_mob != null) {
        dtObj_mob.destroy();
    }
    if (triptype == 'oneway') {
        dtOptions = {
            element: document.getElementById('dates_from'),
            minDate: yesterdayDt,
            format: "DD MMM YYYY",
            singleMode: true,
            autoApply: true,
            autoRefresh: true,
            buttonText: {
                "previousMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.636 6L8.27202 12.364L14.636 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>",
                "nextMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.36377 6L15.7277 12.364L9.36377 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>"
            },
            lockDaysFilter: (date1, date2, pickedDates) => {
                if (flight_json_days.hasOwnProperty('depart')) {
                    return !flight_json_days['depart'].includes(date1.format('YYYY-MM-DD'));
                }
                return false;
            },
            setup: (picker) => {
                picker.on('selected', (date1) => {
                    $("#dt_s_cus").val(date1.format('DDMMMYYYY'));
                    $("#dt_e_cus").val('');
                });
            }
        };
        dtOptions_mob = {
            element: document.getElementById('dates_from_mob'),
            minDate: yesterdayDt,
            format: "DD MMM YYYY",
            singleMode: true,
            autoApply: true,
            plugins: ['mobilefriendly'],
            mobilefriendly: {
                breakpoint: 576,
            },
            autoRefresh: true,
            buttonText: {
                "previousMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.636 6L8.27202 12.364L14.636 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>",
                "nextMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.36377 6L15.7277 12.364L9.36377 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>"
            },
            lockDaysFilter: (date1, date2, pickedDates) => {
                if (flight_json_days.hasOwnProperty('depart')) {
                    return !flight_json_days['depart'].includes(date1.format('YYYY-MM-DD'));
                }
                return false;
            },
            setup: (picker) => {
                picker.on('selected', (date1) => {
                    $("#dt_s_cus").val(date1.format('DDMMMYYYY'));
                    $("#dt_e_cus").val('');
                });
            }
        };
        if (sdt != '') {
            dtOptions.setDate = new Date(moment(sdt, 'DDMMMYYYY').format('YYYY-MM-DD'));
            dtOptions_mob.setDate = new Date(moment(sdt, 'DDMMMYYYY').format('YYYY-MM-DD'));
        }
    } else {
        dtOptions = {
            element: document.getElementById('dates_from'),
            elementEnd: document.getElementById('dates_to'),
            format: "DD MMM YYYY",
            singleMode: false,
            allowRepick: true,
            minDate: yesterdayDt,
            showTooltip: true,
            autoApply: true,
            autoRefresh: true,
            buttonText: {
                "previousMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.636 6L8.27202 12.364L14.636 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>",
                "nextMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.36377 6L15.7277 12.364L9.36377 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>"
            },
            lockDaysFilter: (date1, date2, pickedDates) => {
                if (flight_json_days.hasOwnProperty('depart')) {
                    if (pickedDates.length == 0) {
                        return !flight_json_days['depart'].includes(date1.format('YYYY-MM-DD'));
                    }
                    if (pickedDates.length == 1) {
                        let pickedStr = pickedDates[0].getFullYear() + '-' + (pickedDates[0].getMonth() + 1) + '-' + pickedDates[0].getDate();
                        let pickedMoment = moment(pickedStr, 'YYYY-MM-DD');
                        let date1Moment = moment(date1.format('YYYY-MM-DD'), 'YYYY-MM-DD');
                        if (date1Moment.isBefore(pickedMoment)) {
                            return true;
                        }
                        $("#dates_from").val(pickedMoment.format('DD MMM YYYY'));
                        return !flight_json_days['return'].includes(date1.format('YYYY-MM-DD'));
                    }
                    if (pickedDates.length == 2) {
                        return false;
                    }
                }
                return true;
            },
            setup: (picker) => {
                picker.on('show', () => {
                    picker.clearSelection();
                });
                picker.on('selected', (date1, date2) => {
                    $("#dt_s_cus").val(date1.format('DDMMMYYYY'));
                    $("#dt_e_cus").val(date2.format('DDMMMYYYY'));
                });
                picker.on('tooltip', (tooltip, day) => {
                    $(tooltip).text('Return Date');
                });
            }
        };
        dtOptions_mob = {
            element: document.getElementById('dates_from_mob'),
            elementEnd: document.getElementById('dates_to_mob'),
            format: "DD MMM YYYY",
            singleMode: false,
            allowRepick: true,
            minDate: yesterdayDt,
            showTooltip: true,
            plugins: ['mobilefriendly'],
            mobilefriendly: {
                breakpoint: 576,
            },
            autoApply: true,
            autoRefresh: true,
            buttonText: {
                "previousMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14.636 6L8.27202 12.364L14.636 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>",
                "nextMonth": "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.36377 6L15.7277 12.364L9.36377 18.7279' stroke='#0B294B' stroke-linejoin='round'/></svg>"
            },
            lockDaysFilter: (date1, date2, pickedDates) => {
                if (flight_json_days.hasOwnProperty('depart')) {
                    if (pickedDates.length == 0) {
                        return !flight_json_days['depart'].includes(date1.format('YYYY-MM-DD'));
                    }
                    if (pickedDates.length == 1) {
                        $("#dates_from_mob").val(pickedMoment.format('DD MMM YYYY'));
                        return !flight_json_days['return'].includes(date1.format('YYYY-MM-DD'));
                    }
                    if (pickedDates.length == 2) {
                        return false;
                    }
                }
                return true;
            },
            setup: (picker) => {
                picker.on('show', () => {
                    picker.clearSelection();
                });
                picker.on('selected', (date1, date2) => {
                    $("#dt_s_cus").val(date1.format('DDMMMYYYY'));
                    $("#dt_e_cus").val(date2.format('DDMMMYYYY'));
                });
                picker.on('tooltip', (tooltip, day) => {
                    $(tooltip).text('Return Date');
                });
            }
        };
    }
    dtObj = new Litepicker(dtOptions);
    dtObj_mob = new Litepicker(dtOptions_mob);
}

$(".find_tickets_btn").click(function () {
    if (flights_from_to_array[0][1].length < 3) {
        $("#flight_from").focus();
        msg('Missing', 'Choose departure airport', 'info');
        return;
    }
    if (flights_from_to_array[1][1].length < 3) {
        $("#flight_to").focus();
        msg('Missing', 'Choose arrival airport', 'info');
        return;
    }
    if (flights_from_to_array[0][1] == flights_from_to_array[1][1]) {
        $("#flight_to").focus();
        msg('Missing', 'Departure & Arrival airport cannot be same', 'info');
        return;
    }
    var dts = $("#dt_s_cus").val();
    var dte = $("#dt_e_cus").val();
    if (dts.length <= 0) {
        msg('Missing', 'Please select depature date', 'info');
        return;
    }
    if (triptype == 'roundtrip') {
        if (dte.length <= 0) {
            msg('Missing', 'Please select arrival date', 'info');
            return;
        }
    }
    setCookie(flights_from_to_array[0][1], flights_from_to_array[0][0]);
    setCookie(flights_from_to_array[1][1], flights_from_to_array[1][0]);
    setCookie('airport_name_from', flights_from_to_array[0][0]);
    setCookie('airport_name_from', flights_from_to_array[0][0]);
    setCookie('airport_name_to', flights_from_to_array[1][0]);
    setCookie('airport_code_from', flights_from_to_array[0][1]);
    setCookie('airport_code_to', flights_from_to_array[1][1]);
    setCookie('passenger_ctr_adult', passenger_ctr_adult);
    setCookie('passenger_ctr_child', passenger_ctr_child);
    setCookie('passenger_ctr_infant', passenger_ctr_infant);
    setCookie('date_from', $("#dt_s_cus").val());
    setCookie('date_to', $("#dt_e_cus").val());
    setCookie('passenger_ctr_total', getPassengerTotal());
    setCookie('triptype', triptype);
    if (getPassengerTotal() <= 0) {
        msg('Passenger Seat', 'At least 1 passenger is required.', 'info');
        return;
    }
    var redirect = siteurl + '/flight-search/' + flights_from_to_array[0][1] + '-' + flights_from_to_array[1][1] + '/' + dts;
    if (triptype == 'roundtrip') {
        if (dte != dts)
            redirect += '-' + dte;
    }
    var isFlexChecked = 'yes';
    // if ($("#" + getIdByDevice('dtF_cb')).is(':checked'))
    //     isFlexChecked = 'yes';
    redirect += '/A-' + passenger_ctr_adult + '-C-' + passenger_ctr_child + '-I-' + passenger_ctr_infant + '/USD/?flex=' + isFlexChecked;
    redirect += '&v=' + Math.random();
    window.location.href = redirect;
});

var passenger_ctr_adult = 1;
var passenger_ctr_child = 0;
var passenger_ctr_infant = 0;

function getPassengerTotal() {
    return (parseInt(passenger_ctr_adult) + parseInt(passenger_ctr_child) + parseInt(passenger_ctr_infant));
}

function getPassengerTotalTxt() {
    var tmp = getPassengerTotal();
    var ret = "";
    if (tmp > 1) {
        ret = tmp + " Passengers";
    } else {
        ret = tmp + " Passenger";
    }
    return ret;
}

function passenger_render() {
    $("#passengers-ctr-btn").html(getPassengerTotalTxt());
    $("#passengers-ctr-btn_mob").html(getPassengerTotalTxt());
    $("#passenger_ctr_adult").html(passenger_ctr_adult);
    $("#passenger_ctr_adult_mob").html(passenger_ctr_adult);
    $("#passenger_ctr_child").html(passenger_ctr_child);
    $("#passenger_ctr_child_mob").html(passenger_ctr_child);
    $("#passenger_ctr_infant").html(passenger_ctr_infant);
    $("#passenger_ctr_infant_mob").html(passenger_ctr_infant);
    $(".adult_name").html((passenger_ctr_adult > 1) ? 'Adults' : 'Adult');
    $(".child_name").html((passenger_ctr_child > 1) ? 'Children' : 'Child');
    $(".infant_name").html((passenger_ctr_infant > 1) ? 'Infants' : 'Infant');
}

$("#passenger_dd_menu,#passenger_dd_menu_mob").click(function (e) {
    e.stopPropagation();
});

function passenger_min(type) {
    if (type == 'adult') {
        curVal = passenger_ctr_adult;
    } else if (type == 'child') {
        curVal = passenger_ctr_child;
    } else if (type == 'infant') {
        curVal = passenger_ctr_infant;
    }
    if ((curVal - 1) >= 0) {
        curVal--;
    } else {
        return;
    }
    if (type == 'adult') {
        if (curVal < passenger_ctr_infant) {
            passenger_ctr_infant = curVal;
        }
    }
    if (type == 'adult') {
        passenger_ctr_adult--;
        if (passenger_ctr_adult == 0)
            passenger_ctr_adult++;
    } else if (type == 'child') {
        passenger_ctr_child--;
    } else if (type == 'infant') {
        passenger_ctr_infant--;
    }
    passenger_render();
}

function passenger_plus(type) {
    var curVal = 0;
    if (type == 'adult') {
        curVal = passenger_ctr_adult;
    } else if (type == 'child') {
        curVal = passenger_ctr_child;
    } else if (type == 'infant') {
        curVal = passenger_ctr_infant;
    }
    curVal++;
    /*if (curVal > 7 && type == 'adult') {
        msg('Passenger Seat', 'Max 7 adults allowed', 'info');
        return;
    } else*/
    if (curVal > 9 || (getPassengerTotal() + 1) > 9) {
        msg('Passenger Seat', 'Max 9 passengers are allowed', 'info');
        return;
    } else if (type == 'child' && curVal > 4) {
        msg('Passenger Seat', 'Max 4 children are allowed', 'info');
        return;
    } else if (type == 'infant' && curVal > passenger_ctr_adult) {
        msg('Passenger Seat', 'Max 1 infant per adult', 'info');
        return;
    }
    if (type == 'adult') {
        passenger_ctr_adult = curVal;
    } else if (type == 'child') {
        passenger_ctr_child = curVal;
    } else if (type == 'infant') {
        passenger_ctr_infant = curVal;
    }
    passenger_render();
}

$("#flight_to,#flight_to_mob").focus(function () {
    if (flights_from_to_array[0][1].length <= 1) {
        $("#" + getIdByDevice("flight_from")).trigger('focus');
    } else {
        $(this).html('');
        $(this).autocomplete('search', '');
    }
});

$("#flight_from,#flight_from_mob").focus(function () {
    $(this).html('');
    $(this).autocomplete('search', '');
});

$("#flight_from,#flight_from_mob").blur(function () {
    selectedAutoComplete("flight_from", flights_from_to_array[0]);
});

$("#flight_to").blur(function () {
    selectedAutoComplete("flight_to", flights_from_to_array[1]);
});

function displayAscOrder(data) {
    data.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    return data;
}

$(".seg-switch button").click(segSwticher);

function segSwticher() {
    if (triptype == 'roundtrip' && $('#dates_to').hasClass('ui-autocomplete-loading')) {
        $('#dates_to,#dates_mob_to').prop('disabled', true).removeClass('ui-autocomplete-loading');
    } else {
        $('#dates_to,#dates_mob_to').prop('disabled', false);
    }
    $(".seg-switch-oneway").removeClass('active');
    $(".seg-switch-roundtrip").removeClass('active');
    let triptypeT = $(this).data('type');
    triptype = triptypeT;
    if (triptypeT == 'oneway') {
        $(".date-sect-roundtrip").addClass('c-disabled');
    } else {
        $(".date-sect-roundtrip").removeClass('c-disabled');
    }
    $(".seg-switch-" + triptypeT).addClass('active');
    dateInit();
}