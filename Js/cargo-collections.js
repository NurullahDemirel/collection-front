
        // var  modal = document.getElementById("myModal");
        // var btn = document.getElementById("myBtn");
        // var span = document.getElementsByClassName("close")[0];

        // btn.onclick = function() {
        //     modal.style.display = "block";
        // }

        // span.onclick = function() {
        // modal.style.display = "none";
        // }

        // window.onclick = function(event) {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        // }

$(function () {

    $("#ContentPlaceHolder1_datePickerStart").datepicker(myDatePicker());
    $("#ContentPlaceHolder1_datePickerEnd").datepicker(myDatePicker());

    $('#ContentPlaceHolder1_datePickerStart').datepicker("setDate", getFirstStatusDates().beforeAWeek);
    $('#ContentPlaceHolder1_datePickerEnd').datepicker("setDate", getFirstStatusDates().today);

    cargoCollectionsAjax(apiURL);

    $('.filter-button').on('click', function () {
        $(this).toggleClass('active');
    });

    // $('.filter-button, button#search-button').on('click', function () {
    //     cargoCollectionsAjax(apiURL);
    // });

    $('button#search-button').on('click', function () {
        cargoCollectionsAjax(apiURL);
    });

    $("#search-text").on('keyup', function (e) {
        if (e.key === 'Enter') {
            $('.filter-button').removeClass('active');
            cargoCollectionsAjax(apiURL);
        }
    });

    $(".filter-button").on('keyup', function (e) {
        if (e.key === 'Enter') {
            cargoCollectionsAjax(apiURL);
        }
    });




    $(document).on('click', '.open-modal', function () {
        // $(this).data('ordercode');
        // console.log($(this).data('ordercode'));

        // $(".text-center").html($(this).data('entegra-order-total-price'));
        let order_total_price_cargo = $(this).data('ordertotalpricecargo');
        let entegra_order_total_price = $(this).data('entegraordertotalprice')
        let cargo_desi = $(this).data('cargodesi');
        let entegra_desi = $(this).data('entegradesi');
        let cargo_city = $(this).data('cargocity');
        let entegra_city = $(this).data('entegracity');
        let cargo_town = $(this).data('cargotown');
        let entegra_town = $(this).data('entegratown');
        let currency = $(this).data('currency');
        console.log(currency);

        var add_currency_order_cargo = order_total_price_cargo + ' ' + currency;
        var add_currency_order_entegra = entegra_order_total_price + ' ' + currency;

        $(".order-code").html($(this).data('ordercode'));
        $(".is-collection").html($(this).data('paymenttype'));

        $("#cargo-data-payment-total").html(add_currency_order_cargo);
        $("#entegra-data-payment-total").html(add_currency_order_entegra);
        $("#cargo-desi").html(cargo_desi);
        $("#entegra-desi").html(entegra_desi);

        $("#cargo-city").html(cargo_city);
        $("#entegra-city").html(entegra_city);
        $("#cargo-town").html(cargo_town);
        $("#entegra-town").html(entegra_town);
        $("#cargo-name").html($(this).data('cargocompanyname'));

        if (order_total_price_cargo != entegra_order_total_price) {
            $('.payment-associations-row').addClass('unplugged-data');
        } else {
            $('.payment-associations-row').removeClass('unplugged-data');
            // $('.payment-associations-row').addClass('plugged-data');
        }

        if (order_total_price_cargo == entegra_order_total_price) {
            $('.payment-associations-row').addClass('plugged-data');
        } else {
            $('.payment-associations-row').removeClass('plugged-data');
        }

        if (cargo_desi != entegra_desi) {
            $('.desi-row').addClass('unplugged-data');
        } else {
            console.log('esit');
            $('.desi-row').removeClass('unplugged-data');
            // $('.desi-row').addClass('plugged-data');
        }

        if (cargo_desi == entegra_desi) {
            $('.desi-row').addClass('plugged-data');
        } else {
            console.log('esit');
            $('.desi-row').removeClass('plugged-data');
            // $('.desi-row').addClass('plugged-data');
        }

        if (cargo_city != entegra_city) {
            $('.city-row').addClass('unplugged-data');
        } else {
            $('.city-row').removeClass('unplugged-data');
            // $('.city-row').addClass('plugged-data');
        }

        if (cargo_city == entegra_city) {
            $('.city-row').addClass('plugged-data');
        } else {
            $('.city-row').removeClass('plugged-data');
            // $('.city-row').addClass('plugged-data');
        }

        if (cargo_town != entegra_town) {
            $('.town-row').addClass('unplugged-data');
        } else {
            $('.town-row').removeClass('unplugged-data');
            // $('.town-row').addClass('plugged-data');
        }

        if (cargo_town == entegra_town) {
            $('.town-row').addClass('plugged-data');
        } else {
            $('.town-row').removeClass('plugged-data');
            // $('.town-row').addClass('plugged-data');
        }

    });

    $(document).on('click', 'span.copy', function () {
        var copyText = $(this).data('ordercode')
        var tempElement = $("<input>");
        $("body").append(tempElement);
        tempElement.val(copyText).select();
        document.execCommand("copy");
        tempElement.remove();
        toastr.success(`${copyText} Kopyalandı`);

    });

    // $('img.isOrder').on('click', function () {
    //     $(this).toggleClass('order');
    //     cargoCollectionsAjax(apiURL);
    // });

})
