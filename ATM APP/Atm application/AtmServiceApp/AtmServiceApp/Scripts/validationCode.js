$(document).ready(function () {

    String.prototype.lpad = function (padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    }

    $("#login_form_submit").click(function (e) {
        var tp = $("#user_name").val();
        var tp1 = $("#password3").val();
        var tp2 = $("#client_id").val();

        if (tp == "" || tp1 == "" || tp2 == "") {
            if (tp == "")
                alert("please enter username");
            if (tp1 == "")
                alert("please enter password");
            if (tp2 == "")
                alert("please enter client id");
            e.preventDefault();
        }

    });

    $("#atm_form").submit(function (e) {
        e.preventDefault();

        var tp = $("#atm_ID").val();
        var tp1 = $("#error_code_select").val();
        var tp2 = $("#comments").val();

        if (tp == "" || tp1 == "" || tp2 == "") {
            if (tp == "")
                alert("please enter Atm Id");
            if (tp1 == "")
                alert("please select a error code");
            if (tp2 == "")
                alert("please enter some comment");
        }
        else {
            $('#loading1').html('<img src="/Images/loading1.gif" height="23px" width="23px">');
            var url = "/Home/save"; // the script where you handle the form input.

            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(), // serializes the form's elements.
                success: function (data) {
                    if (data == "") {
                        alert("Some error occurred");
                    }
                    $.each(data, function (i, object) {
                        $.each(object, function (property, value) {
                            $("#reference_no").val(value);
                            $("#after_save").html("<h3>Locked at reference no : " + value + "</h3>");
                        });
                    });
                    setTimeout(function () {
                        $('#loading1').html("");
                    }, 10);
//                    $.ajax({
//                        type: "POST",
//                        url: "/home/Counter",
//                        data: null, // serializes the form's elements.
//                        success: function (data) {
//                            var d = new Date();
//                            var x = d.getFullYear();
//                            var y = d.getMonth() + 1;
//                            var z = d.getDate();


//                            x = x.toString();
//                            y = y.toString();
//                            z = z.toString();

//                            if (y.length == 1)
//                                y = "0" + y;
//                            if (z.length == 1)
//                                z = "0" + z;
//                            var str = data;
//                            str = str.lpad("0", 4);
//                            $("#reference_no").val(x + y + z + str);
//                            var txt = $("#reference_no").val();
//                            $("#after_save").html("<h3>Locked at reference no : " + txt + "</h3>");

//                            setTimeout(function () {
//                            $('#loading1').html("");
//                        }, 10);
//                        }
//                    });

                }
            });
        }
    });

    $("#atm_ID").blur(function () {

        if ($(this).val() == "") {
            alert("Please Enter ATM ID");
            $("#hub_state").val("");
            $("#hub_city").val("");
            $(this).focus();
        }
        if ($(this).val() != "") {
            var url = "/Home/retrieveDetails"; // the script where you handle the form input.
            $('#loading').html('<img src="/Images/loading1.gif" height="23px" width="23px">');

            $.ajax({
                type: "POST",
                url: url,
                data: { value: $(this).val() }, // serializes the form's elements.
                success: function (data) {
                    if (data == "") {
                        $("#hub_state").val("");
                        $("#hub_city").val("");
                        alert("Please Enter Valid ATM ID");
                        $("#atm_ID").val("");
                    }
                    $.each(data, function (i, object) {
                        $.each(object, function (property, value) {
                            if (property == "city") {
                                $("#hub_city").val(value);
                                valid = "true";
                            } if (property == "state") {
                                $("#hub_state").val(value);
                            }
                            if (property == "new_atmId") {
                                $("#atm_GUID").val(value);
                            }
                        });
                    });

                    setTimeout(function () {
                        $('#loading').html("");
                    }, 10);
                }
            });
        }
    });
});