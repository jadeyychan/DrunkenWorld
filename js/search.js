function search_bar () {
    /* Formatting data */
    searchbar_data = []; 
    Object.keys(country_ids).map(function(d) {
        searchbar_data.push({id: d, text: country_ids[d]});
    });
    
    /* Appending to div */
    $(".searchbar").select2({
        placeholder: "Search",
        data: searchbar_data
    });

    $(".searchbar").on("select2:select", function (e) { 
        var year = 1990,
            d    = e.params.data;
        country_selected(d);

        /* Clearing search bar */
        $(this).data("timeout", setTimeout(function () {
            $(".searchbar").val('').trigger("change");
        }, 1000));
    });
}