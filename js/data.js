max_year = 2014;

// object that will contain annual alcohol data for each country
consumption = { };
country_ids = { };

function aggregate_annual_data(line) {
    var years = { };
    var searchForNull = false;

    for (var j = 0; j < line.length; j++) {
        // if data found, add to object and turn on searching
        if (line[j] != "") {
            years[max_year - j] = line[j];
            searchForNull       = true;

        // data is blank but not searching
        } else if (searchForNull == false) {
            years[max_year - j] = null;

        // data is blank and searching
        } else {
            // mark where data was last found
            var start_y = max_year - (j - 1);
            var start_v = line[j - 1];

            // loop until we find data again
            while (line[j] == "") {
                years[max_year - j] = null;
                j++;
            }

            years[max_year - j] = null;

            if (j < line.length) {
                var end_y = max_year - (j + 1);
                var end_v = line[j + 1];
                var inc_v = (end_v - start_v) / (end_y - start_y);

                for (var k = 1; k < start_y - end_y; k++) {
                    years[start_y - k] = String(parseFloat(start_v) + (inc_v * k));
                }
            }
            searchForNull = false;
            j--;
        }
    }
    return years;
}

// pull in consumption data from CSV file
$.ajax({
    type: "GET",
    url: "data/consumption/consumption-allyears.csv",
    dataType: "text",
    success: function(data) {
        var lines = data.split(/\r\n|\n/);
        for (var i = 1; i < lines.length; i++) {
            var line     = lines[i].split(',');
            var country  = line[0];
            var alc_type = line[1];
            var id       = line[2];

            // add country to data object if not already in it
            if (!consumption[country]) consumption[country] = { };
            
            // aggregate annual data for each alc type
            consumption[country][alc_type] = aggregate_annual_data(line.slice(3,line.length));
        }
        console.log("consumption data loaded...");
    }
});

// pull in country ids from CSV file
$.ajax({
    type: "GET",
    url: "data/map/country-codes.csv",
    dataType: "text",
    success: function(data) {
        var lines = data.split(/\r\n|\n/);
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].split(',');
            country_ids[String(line[1])] = line[0];
        }
        console.log("country code data loaded...");
    }
})


