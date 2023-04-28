const apiURL = 'https://fa8b-81-214-56-69.ngrok-free.app/api/cargo-collections';
function cargoCollectionsAjax(httpUrl, query = '') {
    $('.loading').css("display", "block");
    httpUrl = httpUrl + query;
    // console.log(httpUrl);

    let cargoFilterArray = [];
    $(".filter-button").prop('disabled', true); //Pasif Hale Getirir.

    // Kargo Filter 
    $('button.filter-button-cargo.active').each(function (index, item) {
        cargoFilterArray.push($(this).attr('cargo'));
    });

    let firstStatusDates = getFirstStatusDates();
    let startDateVal = $('#ContentPlaceHolder1_datePickerStart').val();
    let endDateVal = $('#ContentPlaceHolder1_datePickerEnd').val();

    let startDate = firstStatusDates.beforeAWeek;
    let today = firstStatusDates.today;

    let collect_shipment = $('#collected-shipment-button').hasClass('active') ? 1 : 0;
    let uncollected_shipment = $('#uncollected-shipment-button').hasClass('active') ? 1 : 0;
    let error_desi = $('#error-desi-count-button').hasClass('active') ? 1 : 0;
    let error_city = 0;
    let error_district = 0;

    let search_text = $('#search-text').val();
    // let trackingNumber = $('#cargo-tracking-number').val();

    // console.log(startDate);
    let filterData = {
        'cargo': cargoFilterArray,
        'collected_shipment': collect_shipment,
        'uncollected_shipment': uncollected_shipment,
        'error_desi': error_desi,
        'error_city': error_city,
        'error_district': error_district,
        'start_date': startDate,
        'end_date': today
    }

    if(collect_shipment == 1 && uncollected_shipment == 1){
        filterData.collected_shipment = 0;
        filterData.uncollected_shipment = 0;
        $('#collected-shipment-button').removeClass('active');
        $('#uncollected-shipment-button').removeClass('active');
    }

    if (search_text != '') {
        let search_text_to_upper_case = search_text.toUpperCase();
        filterData.search_text = search_text_to_upper_case;
    }

    if (startDateVal != startDate) {

        filterData.start_date = startDateVal;
        // console.log(startDateVal);
    }

    if (endDateVal != today) {
        filterData.end_date = endDateVal;
        // console.log(endDateVal);
    }

    // let orders = [];

    // $('img.isOrder.order').each(function (index, item) {
    //     orders.push($(this).attr('order'));
    // });
    // console.log(orders);
    // filterData.sorting = orders;
    

    $.ajax(
        {
            url: httpUrl,
            method: 'post',
            headers: { "ngrok-skip-browser-warning": "any" },
            data: filterData,
            success: function (response) {
              
                const data_length = response[0].data.length;
                if (data_length == 1) {
                    let myData = response[0].data[0];
                    // console.log(myData);
                    $('.filter-button-cargo').removeClass('active');
                    const cargoId = myData.cargo_id;
                    $(`button.filter-button-cargo[cargo=${cargoId}]`).addClass('active');
                }

                if (data_length == 0) {
                    toastr.warning('Böyle Bir Sipariş Numarası Bulunamadı.')
                }

                // if ((order_code !== '' || trackingNumber !== '') && response[0].data.length != 1) {
                //     $('.filter-button-cargo').removeClass('active');
                // }


                if (search_text != '' && response[0].data.length != 1) {
                    $('.filter-button-cargo').removeClass('active');
                }

                // console.log(response);
                const current_page = response[0].current_page;
                const last_page = response[0].last_page;
                let tableRow = "";
                let total = response[0].total;
                // console.log(" total " + total);
                $("#total").html(total);
                $('.pagination').empty();

                // var ptt_cargo = response.counter.ptt_data;
                // var mng_cargo = response.counter.mng_data;
                // var kargoist_data = response.counter.kargoist_data;
                // var aras_data = response.counter.aras_data;

                // $("#ptt-cargo").html(ptt_cargo);
                // $("#mng-cargo").html(mng_cargo);
                // $("#kargo-ist").html(kargoist_data);
                // $("#aras-cargo").html(aras_data);

                // var total_order_price = response.counter.total_price;
                // total_order_price = formatMoney(total_order_price);
                // $("#total-order-price").html(total_order_price);
                var collect_shipment_price = response.counter.collect_shipment_price;
                // collect_shipment_price = formatMoney(collect_shipment_price);
                $("#collect-shipment-price").html(collect_shipment_price);

                var collect_shipment_count = response.counter.collect_shipment_count;
                // let numAfterThirdDigit = collect_shipment_count.toString().substring(0, 3) + "." + collect_shipment_count.toString().substring(3);
                $("#collect-shipment-count").html(collect_shipment_count);

                // var uncollect_shipment_price = response.counter.uncollect_shipment_price;
                // uncollect_shipment_price = formatMoney(uncollect_shipment_price);
                // $("#uncollect-shipment-price").html(uncollect_shipment_price);

                var uncollect_shipment_count = response.counter.uncollect_shipment_count;
                // let unnumAfterThirdDigit = uncollect_shipment_count.toString().substring(0, 3) + "." + uncollect_shipment_count.toString().substring(3);
                $("#uncollect-shipment-count").html(uncollect_shipment_count);

                var err_desi_count = response.counter.err_desi_count;
                // let err_desi_count_num = err_desi_count.toString().substring(0, 3) + "." + err_desi_count.toString().substring(3);
                $("#error-desi-count").html(err_desi_count);



                // console.log(response[0].prev_page_url == null);
                // console.log(response[0].next_page_url == null);


                let pagination_box = `<li class="page-item"> <button class="page-link" disabled="disabled"></button> </li>`;

                if (current_page - 1 == 0) {
                    pagination_box = `<li class="page-item"> <button class="page-link" disabled="disabled">«</button> </li>`;
                    $('.pagination').append(pagination_box);

                } else {
                    pagination_box = `<li class="page-item"> <button class="page-link" page-count="${current_page - 1}">«</button> </li>`;
                    $('.pagination').append(pagination_box);

                }


                $.each(response[0].links, function (index, item) {
                    pagination_box = `<li class="page-item"> <button class="page-link" page-count="${item.label}">${item.label}</button> </li>`;
                    let altStr = "Previous";
                    let rightStr = "Next";
                    // if (pagination_box.includes(altStr)) {
                    //     pagination_box = pagination_box.replace(altStr, "");

                    // }
                    // if (pagination_box.includes(rightStr)) {
                    //     pagination_box = pagination_box.replace(rightStr, "");
                    // }
                    if ((!pagination_box.includes(altStr) && !pagination_box.includes(rightStr))) {
                        $('.pagination').append(pagination_box);
                    }

                    if (item.active == true) {
                        $('.pagination li').removeClass("active");
                        $('.pagination li:nth-child(' + (index + 1) + ')').addClass("active");
                    }
                });

                if (current_page + 1 > last_page) {
                    pagination_box = `<li class="page-item"> <button class="page-link" disabled="disabled">»</button> </li>`;
                    $('.pagination').append(pagination_box);

                } else {
                    pagination_box = `<li class="page-item"> <button class="page-link" page-count="${current_page + 1}">»</button> </li>`;
                    $('.pagination').append(pagination_box);

                }


                $('button.page-link').on('click', function () {
                    let query = "?page=" + $(this).attr('page-count');
                    // console.log(query);
                    cargoCollectionsAjax(apiURL, query);
                });

                // response[0].data.shift();
                $.each(response[0].data, function (index, item) {


                    // console.log(item.order_code);
                    // console.log(" +search_text " + search_text);

                    // console.log(item.order.currency);
                    let currency = item.order?.currency;
                    // console.log(currency);
                    let order_status = item.order_status[0];
                    //console.log(order_status);

                    var is_equal_desi_cargo;
                    var is_equal_city;
                    var is_equal_town;
                    var is_equal_payment_type;
                    var is_equal_total_price_cargo;
                    var order_code = item.order_code;
                    var order_total_price_cargo = item.order_total_price_cargo;
                    var is_collection;
                    var cargo_company_name = item.cargo_company;
                    // console.log(cargo_company_name);

                    // DESİ KARGOLARININ KARSILASTIRILMASI
                    if (item.get_order_cargo) {
                        if (item.get_order_cargo.desi == item.desi_cargo) {
                            is_equal_desi_cargo = `<i class="fa-sharp fa-regular fa-square-check" ></i>`;
                        } else {
                            is_equal_desi_cargo = `<i class="fa-sharp fa-solid fa-x" ></i>`;
                        }
                    } else {
                        is_equal_desi_cargo = "Desi Verisi Bulunamadı"
                    }

                    // SİPARİŞ TUTARININ KARSILASTIRILMASI
                    if (item.order) {
                        var to_fixed_item_order_order_total_price = Number(item.order.order_total_price).toFixed(2);
                        // console.log(" item.order_total_price_cargo" + item.order_total_price_cargo);
                        // console.log("to_fixed_item_order_order_total_price "  + to_fixed_item_order_order_total_price);
                        if (item.order_total_price_cargo == to_fixed_item_order_order_total_price) {
                            is_equal_total_price_cargo = `<i class="fa-sharp fa-regular fa-square-check" ></i>`;
                        } else {
                            is_equal_total_price_cargo = `<i class="fa-sharp fa-solid fa-x"></i>`;
                        }
                    } else {
                        //console.log('data yok');
                    }

                    if (!(item.status_id == 1224)) {
                        if ((item.order && (item.payment_type == 0 && (item.order.payment_type_id == -2 || item.order.payment_type_id == 50)))) {
                            //console.log(  item.payment_type + " 1. kosul vs " +  item.order.payment_type_id);
                            is_collection = 'Tahsilatsız'
                            //console.log(is_collection);
                            
                            is_equal_payment_type = `<i class="fa-sharp fa-regular fa-square-check"></i>`;

                        } else if (item.payment_type == 1 && (item.order.payment_type_id != -2 || item.order.payment_type_id != 50)) {
                           // console.log(  item.payment_type + " 2. kosul vs " +  item.order.payment_type_id);
                            // console.log(item.order.payment_type_id);
                            is_collection = 'Tahsilatlı'
                            // console.log(is_collection);
                            is_equal_payment_type = `<i class="fa-sharp fa-regular fa-square-check"></i>`;
                        } else {
                            console.log(item);
                            // console.log(item.payment_type);
                            // console.log(item.order.payment_type_id);
                            // is_collection = "bos"
                            //console.log("cargo " + item.payment_type );
                            //console.log("entegra " + item.order.payment_type_id );
                            is_equal_payment_type = `<i class="fa-sharp fa-solid fa-x"></i>`;
                        }
                    }
                    else {
                        is_equal_payment_type = `<i class="fa-sharp fa-regular fa-square-check"></i>`;
                        is_collection = 'Tahsilatsız'
                    }

                    // ŞEHİRLERİN KARŞILAŞTIRILMASI
                    if (item.order_delivery) {
                        if (item.order_delivery.delivery_city) {
                            var string_item_order_delivery_delivery_city = String(item.order_delivery.delivery_city).toUpperCase();
                            var string_item_cargo_city = String(item.city).toUpperCase();
                            //console.log(string_item_order_delivery_delivery_city);

                            string_item_cargo_city = clearInput(string_item_cargo_city);
                            string_item_order_delivery_delivery_city = clearInput(string_item_order_delivery_delivery_city);

                            // console.log('string_item_order_delivery_delivery_city ' + string_item_order_delivery_delivery_city);
                            // console.log("string_item_cargo_city  " + string_item_cargo_city);
                            if (string_item_order_delivery_delivery_city == string_item_cargo_city) {
                                is_equal_city = `<i class="fa-sharp fa-regular fa-square-check" ></i>`;
                            } else {
                                is_equal_city = `<i class="fa-sharp fa-solid fa-x"></i>`;
                            }
                        } else {
                            is_equal_city = "Şehir Bulunamadı";
                        }

                    } else {
                        is_equal_city = "Şehir Bulunamadı";
                    }

                    // İLÇELERİN KARŞILAŞTIRILMASI
                    if (item.order_delivery) {
                        if (item.order_delivery.delivery_town) {

                            var string_item_order_delivery_delivery_town = String(item.order_delivery.delivery_town).toUpperCase();
                            var string_item_cargo_district = String(item.town).toUpperCase();

                            string_item_order_delivery_delivery_town = clearInput(string_item_order_delivery_delivery_town);
                            string_item_cargo_district = clearInput(string_item_cargo_district);

                            if (string_item_order_delivery_delivery_town == string_item_cargo_district) {
                                is_equal_town = `<i class="fa-sharp fa-regular fa-square-check"></i>`;
                            } else {
                                is_equal_town = `<i class="fa-sharp fa-solid fa-x"></i>`;
                            }
                        } else {
                            is_equal_town = "ilçe Bulunamadı";
                        }

                    } else {
                        is_equal_town = "ilçe Bulunamadı";
                        //console.log("ORDERDELIVERY NOT FOUND") ;
                    }
                    // 

                    if (item.order) {
                        tableRow += `
                    <tr class="table-row-data"> 
                        <th scope="row" data-bs-toggle="modal" data-bs-target="#exampleModal" data-cargocompanyname="${cargo_company_name}"  data-currency=${currency} data-ordercode="${order_code}" data-paymenttype=${is_collection} data-ordertotalpricecargo="${order_total_price_cargo}" data-entegraordertotalprice="${to_fixed_item_order_order_total_price}" data-cargotown=${string_item_cargo_district} data-cargodesi=${item.desi_cargo} data-entegradesi=${item.get_order_cargo.desi}  data-cargocity=${string_item_cargo_city} data-entegradesi=${item.desi_cargo}  data-entegracity=${string_item_order_delivery_delivery_city} data-entegratown=${string_item_order_delivery_delivery_town} class="open-modal text-order-no" style="padding-left:3em">${order_code}</th>
                        <td class="text-center">${order_status}</td>
                        <td class="text-center"> <span style="position:absolute; margin-left:-38.5em; color:#89375F;" class="copy" data-ordercode="${order_code}"> <i class="fa-sharp fa-solid fa-copy"></i> </span> ${is_equal_payment_type}</td>
                        <td class="text-center">${is_equal_total_price_cargo}</td>
                        <td class="text-center">${is_equal_desi_cargo}</td>
                        <td class="text-center">${is_equal_city}</td>
                        <td class="text-center">${is_equal_town}</td>
                    </tr>`;
                    }
                });

                $('#result').html(tableRow);
                $('.loading').css("display", "none");
                $(".filter-button").prop('disabled', false); //Pasif Hale Getirir.

            },
            error: function (xhr, ajaxOptions, thrownError) {
                toastr.error(xhr.responseJSON.message);
                setTimeout(function () {
                    location.reload();
                }, 5000);
                //$('.loading').css("display", "none");
            }
        }
    );
}

function getFirstStatusDates() {
    // bugünün tarihini al
    let today = new Date();

    // bir hafta öncesinin tarihini hesapla
    let lastWeek = new Date(today.getTime() - 56 * 24 * 60 * 60 * 1000);

    // tarihleri Y-m-d formatında biçimlendir
    let todayFormatted = today.toISOString().slice(0, 10);
    let lastWeekFormatted = lastWeek.toISOString().slice(0, 10);

    // sonuçları yazdır

    return {
        today: todayFormatted,
        beforeAWeek: lastWeekFormatted
    }
}

function myDatePicker() {
    return {
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
        language: 'TR',
        todayBtn: 'linked',
        // startDate: new Date(2023,4,17),
        //daysOfWeekHighlighted: "0",
        //daysOfWeekDisabled: [0]
    }
}

function clearInput(str) {

    /*
     Türkçe karakterlerin değiştirilecekleri karşılıklarını tanımlıyoruz.
     */
    var charMap = { Ç: 'C', Ö: 'O', Ş: 'S', İ: 'I', I: 'I', Ü: 'U', Ğ: 'G', ç: 'C', ö: 'O', ş: 'S', ı: 'I', ü: 'U', ğ: 'G' };

    /*
     Inputa girilen Türkçe karakterleri yukarıda tanımladığımız değerlerle değiştiriyoruz.
     Bu zahmete katlanmamızın nedeni JavaScript ile Türkçe karakterleri sağlıklı biçimde,
     herhangi bir bug oluşmasına mahal vermeden değiştirebilmek.
     */
    str_array = str.split('');

    for (var i = 0, len = str_array.length; i < len; i++) {
        str_array[i] = charMap[str_array[i]] || str_array[i];
    }

    str = str_array.join('');

    /*
     Alfanumerik olmayan özel karakterlerin temizlendiği yeni bir value oluşturuyoruz:
     1. replace(" ","-") ile boşlukları tire (-) işaretiyle değiştiriyoruz.
     2. replace("--","-") ile iki tane yan yana (--) tire işareti oluşmasının önüne geçiyoruz
     3. replace(/[^a-z0-9-.]/gi,"") ile temizlik işlemini gerçekleştiriyor, - ve . gibi karakterlerin
     temizlenme işleminden hariç tutulmasını sağlıyoruz.
     4. toLowerCase() ile değişkeni tamamen küçük harflere çeviriyoruz.
     */
    var clearStr = str.replace(" ", "-").replace("--", "-").replace(/[^a-z0-9-.çöşüğı]/gi, "");

    return clearStr;
}

Number.prototype.formatMoney = function (fractionDigits, decimal, separator) {
    fractionDigits = isNaN(fractionDigits = Math.abs(fractionDigits)) ? 2 : fractionDigits;

    decimal = typeof (decimal) === "undefined" ? "." : decimal;

    separator = typeof (separator) === "undefined" ? "," : separator;

    var number = this;

    var neg = number < 0 ? "-" : "";

    var wholePart = parseInt(number = Math.abs(+number || 0).toFixed(fractionDigits)) + "";

    var separtorIndex = (separtorIndex = wholePart.length) > 3 ? separtorIndex % 3 : 0;

    return neg +

        (separtorIndex ? wholePart.substr(0, separtorIndex) + separator : "") +

        wholePart.substr(separtorIndex).replace(/(\d{3})(?=\d)/g, "$1" + separator) +

        (fractionDigits ? decimal + Math.abs(number - wholePart).toFixed(fractionDigits).slice(2) : "");

};

function formatMoney(raw) {
    return Number(raw).formatMoney(2, ',', '.');
}