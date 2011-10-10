String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

var text13 = $("b:contains(ISBN-13:)").parent().html();
var isbn13_re = /.*([0-9]{3}-[0-9]{10})/g;
var isbn13 = isbn13_re.exec(text13)[1];

console.log(isbn13);

var text10 = $("b:contains(ISBN-10:)").parent().html();
var isbn10_re = /.*([0-9A-Z]{10})/g;
var isbn10_compact = isbn10_re.exec(text10)[1];
var isbn10 = ISBN.parse(isbn10_compact).asIsbn10(true);

console.log(isbn10);

var url13 = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" + isbn13;
var url10 = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" + isbn10;

$("body").prepend($("<div id='libradar'>Checking availability of <a href='" + url13 + "'>" + isbn13 + "</a>...</div>"));

// console.log(url13);
$.get(url13, function(data13) {
	
	var results13 = $(".SubHeaderTop", data13).text().replace(
			/\n/g, " ").replace(
				/.*Ihre Suche nach ISBN= [-0-9]{13,14} ergibt/, "").replace(
					/ Einträge Suchergebnisseite.*/, "");
	if ((results13 == undefined || results13 == null || results13 == "")) {
		$("#libradar").html("&#8709; &mdash; We haven't found this book (" + isbn13 + ") by ISBN yet. You can search <a href='http://ubdbs.ub.uni-leipzig.de/libero/WebOpac.cls'>manually</a> &mdash; Meanwhile we check the ISBN10...");	

		// console.log(url10);
		$.get(url10, function(data10) {
			var results10 = $(".SubHeaderTop", data10).text().replace(
					/\n/g, " ").replace(
						/.*Ihre Suche nach ISBN= [-0-9]{10,13} ergibt/, "").replace(
							/ Einträge Suchergebnisseite.*/, "");
			if ((results10 == undefined || results10 == null || results10 == "")) {
				$("#libradar").html("&#8709; &mdash; We haven't found this book (<a href='" + url10 + "'>" + isbn10 + "</a>) by ISBN. You can search <a href='http://ubdbs.ub.uni-leipzig.de/libero/WebOpac.cls'>manually</a>.");	
			} else {
				$("#libradar").html("<span id='libradar-star'>&#9715;</span> &mdash; <a href='" + url10 + "'>Oh great, this book is available at the UBL ...</a>");	
			}
		});	

	} else {
		$("#libradar").html("<span id='libradar-star'>&#9715;</span> &mdash; <a href='" + url13 + "'>Oh great, this book is available at the UBL ...</a>");	
	}
});	
