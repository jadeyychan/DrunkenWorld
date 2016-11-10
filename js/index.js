// object that will contain annual alcohol data for each country
consumption = { };

// pull in data from CSV file
$.ajax({
    type: "GET",
    url: "data/consumption-allyears.csv",
    dataType: "text",
    success: function(data) {
        var lines = data.split(/\r\n|\n/);
        for (var i = 1; i < lines.length; i++) {
            var line     = lines[i].split(',');
            var country  = line[0];
            var alc_type = line[1];

            // add country to data object if not already in it
            if (!consumption[country]) consumption[country] = { };

            // build object with annual data for each alc type
            var years = { };
            for (var j = 0; j < line.length - 2; j++) {
                years[2015 - j] = line[j + 2];
            }
            consumption[country][alc_type] = years;
        }
        console.log('all data loaded...')
    }
});
