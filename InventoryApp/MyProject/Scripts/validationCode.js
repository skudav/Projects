$(document).ready(function () {
    $("#new_organisation").click(function (e) {
        e.preventDefault();
        var window1 = window.open("/InventoryApp/orgForm", "new_win", 'width=780,height=650,menubar=no,scrollbars,resizable=off,status,dialog=yes');
    });

    $("#new_master").click(function (e) {
        e.preventDefault();
        var window1 = window.open("/InventoryApp/MasterForm", "new_win", 'width=780,height=650,menubar=no,scrollbars,resizable=off,status,dialog=yes');
    });

    $("#new_store").click(function (e) {
        e.preventDefault();
        var window1 = window.open("/InventoryApp/StoreForm", "new_win", 'width=780,height=650,menubar=no,scrollbars,resizable=off,status,dialog=yes');
    });

    $("#new_challan").click(function (e) {
        e.preventDefault();
        var window1 = window.open("/InventoryApp/ChallanForm", "new_win", 'width=780,height=650,menubar=no,scrollbars,resizable=off,status,dialog=yes');
    });


    var d = new Date();
    var strDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    $(".tcal").val(strDate);
    $("#datepic1").val(strDate);

    $("#temporary").tokenInput('/InventoryApp/auto/' + $(this).val(), {
        hintText: "Type to search",
        searchingText: "Searching...",
        classes: {
            dropdown: "token-input-dropdown-facebook",
            highlightedToken: "token-input-highlighted-token"
        }

    });

    $("#resetDialog").click(function () {
        $("form#add_id > table > tbody > tr > td > div.message").hide();
    });
    //    $(".temporary1").each(function () {
    //        var el = $(this);
    //        var ex = el.tokenInput(el.data("url"), {
    //            preventDuplicates: true
    //        });
    //        
    //    });

    $("#temporary1").tokenInput('/InventoryApp/city/' + $(this).val(), {
        hintText: "Type to search",
        searchingText: "Searching...",
        classes: {
            dropdown: "token-input-dropdown-twitter",
            highlightedToken: "token-input-highlighted-token"
        }
    });



    $("#contactDetails").click(function (e) {
        e.preventDefault();
        var x = window.location;
        x = x.toString();
        if (x.length > 43) {
            var send1 = $(".organi_id").val();
            var url = "/InventoryApp/contactRetrieve?id=" + send1;
            $.ajax({
                type: "POST",
                url: url,
                data: null, // serializes the form's elements.
                success: function (data) {

                    $("#contact_replace").show("slow");
                    $("#contact_replace").html(data);
                }
            });
        }
    });

    $('#search_form').validate({ // initialize the plugin
        rules: {
            search: {
                required: true,
                minlength: 2
            }
            //            search_loc: {
            //                required: true,
            //                minlength: 2,
            //                number: true
            //            },
            //            search_dept: {
            //                required: true,
            //                minlength: 2
            //            }
        },
        submitHandler: function (form) {
            var url = "/InventoryApp/SearchResults"; // the script where you handle the form input.


            $.ajax({
                type: "POST",
                url: url,
                data: $('#search_form').serialize(), // serializes the form's elements.
                success: function (data) {
                    $("#search_replace").html(data);
                }
            });
            return false; // blocks redirect after submission via ajax
        },
        errorElement: "div",
        wrapper: "div",  // a wrapper around the error message
        errorPlacement: function (error, element) {
            offset = element.offset();
            error.insertBefore(element)
            error.addClass('message');  // add a class to the wrapper
            error.css('position', 'absolute');
            error.css('left', offset.left - 320);
            error.css('top', offset.top + 12);
        }
    });

    $('#add_id').validate({ // initialize the plugin
        rules: {
            a_id: {
                required: true,
                minlength: 2,
                number: true
            },
            a_date: {
                required: true,
                date: true
            },
            a_ownerID: {
                required: true,
                minlength: 2,
                number: true
            },
            address_line1: {
                required: true,
                minlength: 10
            },
            add_city: {
                required: true
            },
            add_state: {
                required: true
            },
            add_country: {
                required: true
            },
            add_pincode: {
                required: true,
                number: true,
                minlength: 6
            },
            department: {
                required: true
            }

        },
        submitHandler: function (form) {
            var url = "/InventoryApp/add_Partial"; // the script where you handle the form input.


            $.ajax({
                type: "GET",
                url: url,
                data: null, // serializes the form's elements.
                success: function (data) {
                    // alert(data); // show response from the php script.
                    $("#add_show").html(data);
                    $("#add_show").show("slow");
                    $("#add_id input:text").val("");
                    dialog2.dialog("close");
                }
            });
            /*
            $.ajax({
            dataType: 'html',
            type: 'post',
            url: 'mail.php',
            data: $(form).serialize(),
            success: function (responseData) {
            $('#contact-submit').remove();
            $('#messageResponse').fadeIn(1000);
            $('#messageResponse').html(responseData);
            },
            error: function (responseData) {
            console.log('Ajax request not recieved!');
            }
            });
            // resets fields
            $('input#full-name').val("");
            $('input#email').val("");
            $('textarea#message').val("");
            */
            return false; // blocks redirect after submission via ajax
        },
        errorElement: "div",
        wrapper: "div",  // a wrapper around the error message
        errorPlacement: function (error, element) {
            offset = element.offset();
            error.insertBefore(element)
            error.addClass('message');  // add a class to the wrapper
            error.css('position', 'absolute');
            error.css('left', offset.left - 194);
            error.css('top', offset.top - 25);
        },
        showErrors: function (errorMap, errorList) {
            if (errorList.length) {
                var s = errorList.shift();
                var n = [];
                n.push(s);
                this.errorList = n;
            }
            this.defaultShowErrors();
        }
    });


    $('#itemform_id').validate({ // initialize the plugin
        rules: {
            item_id: {
                required: true,
                minlength: 2,
                number: true
            },
            asset_code: {
                required: true,
                number: true
            },
            serial_no: {
                required: true,
                minlength: 2,
                number: true
            },
            part_name: {
                required: true
            },
            part_description: {
                required: true
            },
            model: {
                required: true
            },
            type: {
                required: true
            },
            manufacturer: {
                required: true
            },
            warranty_start: {
                required: true
            },
            warranty_end: {
                required: true
            },
            amc_manufacturer: {
                required: true
            },
            contract_no: {
                required: true
            }

        },

        errorElement: "div",
        wrapper: "div",  // a wrapper around the error message
        errorPlacement: function (error, element) {
            offset = element.offset();
            error.insertBefore(element)
            error.addClass('message');  // add a class to the wrapper
            error.css('position', 'absolute');
            error.css('left', offset.left - 190);
            error.css('top', offset.top + 14);
        },
        showErrors: function (errorMap, errorList) {
            if (errorList.length) {
                var s = errorList.shift();
                var n = [];
                n.push(s);
                this.errorList = n;
            }
            this.defaultShowErrors();
        }
    });

    $(".first_disable").css("opacity", 0.4);

    $("#save_organisation").click(function (e) {
        e.preventDefault();

        if ($("#itemform_id").valid()) {
            var url = "/InventoryApp/OrgInfo"; // the script where you handle the form input.
            $.ajax({
                type: "GET",
                url: url,
                data: $("#itemform_id").serialize(), // serializes the form's elements.
                success: function (data) {
                    alert("Saved Successfully"); // show response from the php script.
                    $(".first_disable").css("opacity", 1).attr("disabled", false);
                    createUser();
                    //$("#org_id input:text").val("");
                }
            });
        }
    });

    //    $("#add_id").submit(function (ev) {
    //        ev.preventDefault();
    //        var url = "/InventoryApp/add_Partial"; // the script where you handle the form input.


    //        $.ajax({
    //            type: "GET",
    //            url: url,
    //            data: null, // serializes the form's elements.
    //            success: function (data) {
    //                // alert(data); // show response from the php script.
    //                $("#add_show").html(data);
    //                $("#add_show").show("slow");
    //                $("#add_id input:text").val("");
    //                $("#alert_dialog").dialog("close");
    //            }
    //        });
    //    });
    function createUser() {
        $("#createuser").click(function (e) {
            e.preventDefault();
            $("#add_id input:text").val("");
            $(".error").html("");
            $(".error").removeClass("error");
            $(".message").removeClass("message");
            dialog2.dialog("open");
            dateDisplay();
        });
    }
    var dialog2 = $("#alert_dialog").dialog({
        autoOpen: false,
        modal: false,
        show: "slow",
        width: 637,
        height: 270,
        title: "Movement Log"
    });


    function dateDisplay() {
        var d = new Date();
        var strDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        $("#datepic").val(strDate);
    }
});
