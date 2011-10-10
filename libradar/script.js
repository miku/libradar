String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

var text13 = $("b:contains(ISBN-13:)").parent().html();
var isbn13_re = /.*([0-9]{3}-[0-9]{10})/g;
var isbn13 = isbn13_re.exec(text13)[1];

var text10 = $("b:contains(ISBN-10:)").parent().html();
var isbn10_re = /.*([0-9]{10})/g;
var isbn10_compact = isbn10_re.exec(text10)[1]
var ii = isbn10_compact.split("")
var isbn10 = ii[0] + "-" + ii[1] + ii[2] + ii[3] + ii[4] + "-" + ii[5] + ii[6] + ii[7] + ii[8] + "-" + ii[9]; 

$("body").prepend($("<div id='libradar'>Checking availability of " + isbn13 + " ...</div>"));

var url13 = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" + isbn13;
var url10 = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" + isbn10;

var title = $("#btAsinTitle").text().replace(/\n/g, " ").replace(/\[.*\]/g, "").replace(/[,;:\-.!\?\*\+]/g, " ").replace(/[ \t]+/g, " ").trim().replace(/[ ]/g, "+");	
var urlTitle = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ANYW&TERM_1=" + title;

// console.log(url13);
$.get(url13, function(data13) {
	
	var results13 = $(".SubHeaderTop", data13).text().replace(
			/\n/g, " ").replace(
				/.*Ihre Suche nach ISBN= [-0-9]{13,14} ergibt/, "").replace(
					/ Einträge Suchergebnisseite.*/, "");
	if ((results13 == undefined || results13 == null || results13 == "")) {
		$("#libradar").html("&#8709; &mdash; This book (" + isbn13 + ") isn't available. Search <a href='http://ubdbs.ub.uni-leipzig.de/libero/WebOpac.cls'>manually</a>. Meanwhile we check the ISBN10 ...");	

		// console.log(url10);
		$.get(url10, function(data10) {
			var results10 = $(".SubHeaderTop", data10).text().replace(
					/\n/g, " ").replace(
						/.*Ihre Suche nach ISBN= [-0-9]{10,13} ergibt/, "").replace(
							/ Einträge Suchergebnisseite.*/, "");
			if ((results10 == undefined || results10 == null || results10 == "")) {
				$("#libradar").html("&#8709; &mdash; This book (" + isbn10 + ") isn't available. Search <a href='http://ubdbs.ub.uni-leipzig.de/libero/WebOpac.cls'>manually</a>. Meanwhile we check the title ...");	
				
				// find by title
				// console.log(urlTitle);
				$.get(urlTitle, function(data) {
					var results = $(".SubHeaderTop", data).text().replace(
							/\n/g, " ").replace(
								/.*Ihre Suche nach .* ergibt/, "").replace(
									/ Einträge Suchergebnisseite.*/, "");
					if ((results == undefined || results == null || results == "")) {
						$("#libradar").html("&#8709; &mdash; This book (" + title + ") isn't available. Search <a href='http://ubdbs.ub.uni-leipzig.de/libero/WebOpac.cls'>manually</a>.");	
					} else {
						$("#libradar").html("<span id='libradar-star'>&#9733;</span> &mdash; <a href='" + urlTitle + "'>Oh great, this book is available at the UBL ...</a>");	
					}
				});	
				
				
			} else {
				$("#libradar").html("<span id='libradar-star'>&#9733;</span> &mdash; <a href='" + url10 + "'>Oh great, this book is available at the UBL ...</a>");	
			}
		});	

	} else {
		$("#libradar").html("<span id='libradar-star'>&#9733;</span> &mdash; <a href='" + url13 + "'>Oh great, this book is available at the UBL ...</a>");	
	}
});	
