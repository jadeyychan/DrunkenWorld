// object that will contain annual alcohol data for each country
consumption = { };
country_ids = { };

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

            // build object with annual data for each alc type
            var years = { };
            for (var j = 0; j < line.length - 3; j++) {
                years[2015 - j] = (line[j + 3] != "" ? line[j + 3] : "N/A");
            }
            consumption[country][alc_type] = years;
            consumption[country]["id"] = id;
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


