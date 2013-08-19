$(document).ready(function () {
    $("#login_formsss").validate({
        rules: {
            fname: {
                required: true,
                minlength: 4
            },
            password: {
                required: true
            }
        },
        messages: {
            fname: {
                required: "This field is required.",
                minlength: "Use at least 4 characters."
            },
            password: {
                required: "This field is required."
            }
        }
    });

});