var text = $("b:contains(ISBN-13:)").parent().html();
var isbn13_re = /.*([0-9]{3}-[0-9]{10})/g;
var isbn13 = isbn13_re.exec(text)[1];
$("body").prepend($("<div id='libradar'>Checking availability of " + isbn13 + " ...</div>"));

var ub_url = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" + isbn13;
$.get(ub_url, function(data) {
	var result_re = /.*(([0-9]) Einträge).*/g;
	// var line = result_re.exec($(".SubHeaderTop", data).text());
	var results = $(".SubHeaderTop", data).text().replace(/\n/g, " ").replace(
			/.*Ihre Suche nach ISBN= [0-9]{13} ergibt/, "").replace(
				/ Einträge Suchergebnisseite.*/, "");
	console.log(results);
	if (results == undefined || results == null || results == "") {
		$("#libradar").html("&#8709; &mdash; This book isn't available.");	
	} else {
		$("#libradar").html("<span id='libradar-star'>&#9733;</span> &mdash; <a href='" + ub_url + "'>Oh great, this book is available at the UBL ...</a>");	
	}
	
});