function sidebar(d, year) {
    country = country_ids[String(d.id)];
    sidebar_append(d, year);
    sidebar_remove(d);
}

function sidebar_append(d, year) {
    var info;

    if (consumption[country]) { 
        info = country + " | Alcohol: " + get_consumption(country, alc_types, year).toFixed(2) + " liters in " + year; 
    } else {
        info = country + " | Alcohol: N/A";
    }

    if(!$("#"+d.id).length) { // country is not already selected
    	$(".sidebar").append("<div class='sidebar_item' id='"+d.id+"'>"+info+"</div>");
    };
}

function sidebar_remove(d) {
    /* Removing sidebar item */
	$("#"+d.id).click(function() {
		$("#"+d.id).remove();
	});
}

function sidebar_clear() {
	$(".sidebar_item").remove();
}
