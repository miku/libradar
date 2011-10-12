String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

// Find the ISBN on the Amazon page. It is nested and is unfortunately
// nested like:
// 
// <li><b>ISBN-10:</b> 0596155956</li>
// <li><b>ISBN-13:</b> 978-0596155957</li>
// 
// so this is a bit hacky - as every scrape.
function _extract_isbn_from_details_page(text) {
	return $("li:has(b:contains(" + text + ":))").html().split("</b>")[1].trim();
}

// Extract the line "Your search yielded x results from OPAC" and find the
// number which indicates that some books exists. The HTML doesn't
// look like that beautiful either:
// 
// <h2><span class='SearchMsg1'>Ihre Suche nach </span>
// <span class='SearchMsg2'>ISBN= 9780981531601 </span>
// <span class='SearchMsg1'>ergibt</span><span class='SearchMsg3'> 2 </span>
// <span class='SearchMsg1'>Einträge</span></h2>
function _ubl_extractor(data) {
    var result = $(".SubHeaderTop", data).text().replace(
            /\n/g, " ").replace(
                /.*Ihre Suche nach ISBN= [-0-9]{10,13} ergibt/, "").replace(
                    / Einträge Suchergebnisseite.*/, "");
	if (result == null || result == "" || result == 0) {
		return null;
	} else {
		return result;
	}
}

// Just show a link to the actual OPAC page.
function _success(url) {
    $("#libradar").html("<span id='libradar-star'>&#9733;</span> <a href='" + url + "'>Oh great, this book is available at the UBL ...</a>");
}

// Just indicate, that no book with that ISBN was found.
function _miss() {
    $("#libradar").html("&#8709; We haven't found this book by ISBN, but you might want to <a href='" + base_url + "'>search manually</a>.");
}

// Progress text.
function _progress() { $("#libradar").html("&#8709; &mdash; Searching..."); }

var base_url = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls"
var q = "?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=";

var isbn13 = _extract_isbn_from_details_page("ISBN-13");
var isbn10 = ISBN.parse(_extract_isbn_from_details_page("ISBN-10")).asIsbn10(true);

var url13 = base_url + q + isbn13;
var url10 = base_url + q + isbn10;

function _first_non_null_index(a) {
	for (var i = a.length - 1; i >= 0; i--){
		if (null != a[i]) {
			return i;
		}
	};
	return null;
}

function _check_url(cb, url, extractor) {
	$("body").prepend( $("<div id='libradar'>Checking availability of <a href='" + url + "'>this book</a>...</div>") );
	$.get(url, function(data) {
		cb(extractor(data));
	});
}

function _check_ubl(isbnlist) {
	
	var results = new Array();
	var urls = new Array();
	
	for (var i = isbnlist.length - 1; i >= 0; i--){
		urls[i] = base_url + q + isbnlist[i];
	};
	await {
		for (var i = urls.length - 1; i >= 0; i--){
			_check_url(defer(results[i]), urls[i], _ubl_extractor);
		};
	}
	idx = _first_non_null_index(results);
	if (idx != null) {
		_success(urls[idx]);
	} else {
		_miss();
	}
}

_check_ubl([isbn10, isbn13]);
