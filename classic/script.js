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
function _extract_results(data) {
    return $(".SubHeaderTop", data).text().replace(
            /\n/g, " ").replace(
                /.*Ihre Suche nach ISBN= [-0-9]{10,13} ergibt/, "").replace(
                    / Einträge Suchergebnisseite.*/, "");
}

// Just show a link to the actual OPAC page.
function _success(url) {
    $("#libradar").html("<span id='libradar-star'>&#9733;</span> \
    <a href='" + url + "'>Oh great, this book is \
    available at the UBL ...</a>");
}

// Just indicate, that no book with that ISBN was found.
function _miss() {
    $("#libradar").html("&#8709; We haven't found this book by ISBN, \
    but you might want to <a href='" + base_url + "'>search manually</a>.");
}

// Progress text.
function _progress() { $("#libradar").html("&#8709; &mdash; Searching..."); }

var base_url = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls"
var q = "?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=";

var isbn13 = _extract_isbn_from_details_page("ISBN-13");
var isbn10 = ISBN.parse(_extract_isbn_from_details_page("ISBN-10")).asIsbn10(true);

var url13 = base_url + q + isbn13;
var url10 = base_url + q + isbn10;

$("body").prepend( $("<div id='libradar'>Checking availability of \
        <a href='" + url13 + "'>" + isbn13 + "</a>...</div>") );

$.get(url13, function(data) {
    if (Boolean(_extract_results(data)) == false) {
        _progress();
        $.get(url10, function(data) {
            if (Boolean(_extract_results(data)) == false)
                _miss();
            else
                _success(url10);
        });
    } else {
        _success(url13);
    }
});
