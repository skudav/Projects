
$("a.orglinkAjax").click(function (e) {
    var n = $(this).attr("href");
    var m = n.lastIndexOf("/");

    var p = n.substring(m + 1, n.length);

    //alert($(this).text());
    //alert($(this).data());
    e.preventDefault();
    
    //    var url = "/InventoryApp/view_org"; // the script where you handle the form input.
    //    $.ajax({
    //        type: "GET",
    //        url: url,
    //        data: { id: p }, // serializes the form's elements.
    //        success: function (data) {

     var w = window.open("/InventoryApp/view_org?id=" + p, "new_win", 'width=800,height=650,menubar=no,scrollbars,resizable=off,status,dialog=yes');
    //put what controller gave in the new tab or win 
    //            $(w.document.body).html(data);
    //        }
    // });
});