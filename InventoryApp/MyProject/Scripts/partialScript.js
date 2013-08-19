
var dialog = $("#view_dialog").dialog({ autoOpen: false,
    modal: false,
    show: "slow",
    width: 637,
    height: 270,
    title: "View Address"
});



$("a.linkAjax").click(function (e) {

    var n = $(this).attr("href");
    var m = n.lastIndexOf("/");

    var p = n.substring(m + 1, n.length);

    //alert($(this).text());
    //alert($(this).data());
    e.preventDefault();

    var url = "/InventoryApp/view_entry"; // the script where you handle the form input.
    $.ajax({
        type: "GET",
        url: url,
        data: { id: p }, // serializes the form's elements.
        success: function (data) {
            //alert(data); // show response from the php script.
            $("#view_dialog").html(data);
            dialog.dialog("open");
        }
    });
});

function getAjaxCode() {

    $("a.linkAjax").click(function (e) {

        var n = $(this).attr("href");
        var m = n.lastIndexOf("/");

        var p = n.substring(m + 1, n.length);

        //alert($(this).text());
        //alert($(this).data());
        e.preventDefault();

        var url = "/InventoryApp/view_entry"; // the script where you handle the form input.
        $.ajax({
            type: "GET",
            url: url,
            data: { id: p }, // serializes the form's elements.
            success: function (data) {
                //alert(data); // show response from the php script.
                $("#view_dialog").html(data);
                dialog.dialog("open");
            }
        });
    });
}
