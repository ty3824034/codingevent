
var searchbox = $('#searchtext')
searchbox.keyup(function () {
    if (searchbox.val() == '') {
        $('#searchdata').empty()
    } else {
        $.get("/search", { name: searchbox.val()},
            function (result) {
                $('#searchdata').empty()
                if (result.length == 0) {
                    $('#searchdata').append('<tr><td>No Record found</td></tr>')
                } else {
                    $.each(result, function (index, item) {
                        $('#searchdata').append(`<tr><td><img width="50" height="50" src="/productimage/${item.image}"</td><td>${item.name}</td><td>${item.price}</td><td>${item.category}</td></tr>`)
                    })
                }

            }
        );
    }
})