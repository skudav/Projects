$(document).ready(function () {
    $("#delete_contact").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to delete the selected contact(s)?")) {
            $('#grider tr').each(function () {
                if ($(this).find("input[id*='assignChkBx']").length > 0) {
                    if ($(this).find("input[id*='assignChkBx']")[0].checked == true) {
                        var userID = $(this).find("input[id*='assignChkBx']").attr("value");

                        var data = { id: userID };
                        var temp = $(this);
                        $.getJSON("/InventoryApp/DeleteContact", data, function (response) {
                            $.each(response, function (i, object) {
                                $.each(object, function (property, value) {
                                    if (value == true) {
                                        temp.remove();
                                    }
                                });
                            });
                        });
                    }
                }
            });
        }
    });
});