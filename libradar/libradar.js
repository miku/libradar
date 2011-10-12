// Library Radar (Leipzig)
// =======================

// A small Google Chrome extension to check, whether a book is available
// at the local library, while browsing its Amazon page.
//
// Libraries can be added quite easily. Below are [some examples](#section-7),
// namely for the University Library Leipzig and the German National Library.
//
// ----



// A helper.
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

// Find the ISBN on the [Amazon page](view-source:www.amazon.de/Programming-Scala-Scalability-Functional-Objects/dp/0596155956). It is nested and is unfortunately
// nested like:
//
//     <li><b>ISBN-10:</b> 0596155956</li>
//     <li><b>ISBN-13:</b> 978-0596155957</li>
//
// so this is a bit hacky - as every scrape.
function _extract_isbn_from_details_page(text) {
    return $("li:has(b:contains(" + text + ":))")
    .html()
    .split("</b>")[1]
    .trim();
}

// Get the ISBNs off Amazon's page.
var isbn13 = _extract_isbn_from_details_page("ISBN-13");
var isbn10_compact = _extract_isbn_from_details_page("ISBN-10");
var isbn10 = ISBN.parse(isbn10_compact).asIsbn10(true);

// The ISBNs we need to lookup. Different libraries accept different
// ISBN formats or have only a subset of the ISBN actually associated with
// a library record. That's why we need to check them all.
var isbns = [isbn13, isbn10_compact, isbn10];

// Define some libraries to check.
//
// Each library should have

// * a `name` - this will be user-facing,
// * a `url` function, which takes an ISBN as an argument and returns the
//      URL to the search results page,
// * an `extractor` function, which knows how to extract the fact
//      "This book is available" from the search results page, returned by
//      the `url` function and
// * a unique target name (might be anything).
var libraries = {

    university_library: {
        name: "University Library",
        base: "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls",
        q: "?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=",
        url: function(isbn) {
            return this.base + this.q + isbn;
        },
        extractor: function(data) {
            var _result = $(".SubHeaderTop", data)
                .text()
                .replace(/\n/g, " ")
                .replace(/.*Ihre Suche nach ISBN= [-0-9]{10,15} ergibt/, "")
                .replace(/ Einträge Suchergebnisseite.*/, "").trim();
            return (Boolean(_result) == false) ? 0 : _result;
        },
        target: "libradar-ubl"
    },

    national_library: {
        name: "National Library",
        q: "https://portal.d-nb.de/opac.htm?method=simpleSearch&query=",
        url: function(isbn) {
            return this.q + isbn;
        },
        extractor: function(data) {
            return ($(".amount", data).length == 0) ? 0 : 1;
        },
        target: "libradar-dnb"
    },

}

// A poor man's progress bar.
function _dot_plus() {
    $("#libradar-status").html($("#libradar-status").html() + " &#x25FC; ");
}

function _dot_minus() {
    $("#libradar-status").html($("#libradar-status").html()
        .replace(" \u25FC ", ""));
}

// Initialize libradar, add a div on top of the page and prepare the
// library status placeholders.
function _init() {
    $("body").prepend( $("<div id='libradar'></div>") );
    var s = "<span id='libradar-status'>Library Radar <strong>Leipzig</strong></span>";
    for (var key in libraries) {
        s += "&nbsp;|&nbsp;<span id='" + libraries[key].target + "'>" +
            "<strike>" + libraries[key].name + "</strike></span>";
    }
    $("#libradar").html(s);
}

// If an ISBN is available in a library, we change the placeholder to
// an actual link to the libraries page; otherwise we leave the placeholder,
// indicating, that no match has been found.
function _check_availability(isbn, library) {
    var _result;
    _dot_plus();
    $.when( $.get(library.url(isbn)) )
    .then(function(data) {
        _result = library.extractor(data);
        if (_result > 0) {
            $("#" + library.target).html(
                "<a href='" + library.url(isbn) + "'>" + library.name + "</a>");
        }})
    .then(function() {
        _dot_minus();
    });
}

// Loop through all defined libraries and ISBNs.
// This could be optimized to stop, after a match was found. For now,
// we just check each ISBN.
function _main() {
    _init();
    for (var key in libraries) {
        for (var i = isbns.length - 1; i >= 0; i--) {
            _check_availability(isbns[i], libraries[key]);
        }
    }
}

_main();
