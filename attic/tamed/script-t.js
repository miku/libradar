var tame = require('tamejs').runtime;
var __tame_defer_cb = null;
var __tame_fn_0 = function (__tame_k) {
    tame.setActiveCb (__tame_defer_cb);
    String . prototype . trim =
    function  () {
        return this . replace ( / ^\s+|\s+$ / g , "" );
    }
    ;
    function _extract_isbn_from_details_page (text) {
        return $ ( "li:has(b:contains(" + text + ":))" ) . html ( ) . split ( "</b>" ) [ 1 ] . trim ( );
    }
    function _ubl_extractor (data) {
        var result = $ ( ".SubHeaderTop" , data ) . text ( ) . replace (
        / \n / g , " " ) . replace (
        / . *Ihre Suche nach ISBN = [ -0-9 ] { 10 , 13 } ergibt / , "" ) . replace (
        / Eintr äge Suchergebnisseite . * / , "" ) ;
        if (result == null || result == "" || result == 0) {
            return null;
        } else {
            return result;
        }
    }
    function _success (url) {
        $ ( "#libradar" ) . html ( "<span id='libradar-star'>&#9733;</span> <a href='" + url + "'>Oh great, this book is available at the UBL ...</a>" ) ;
    }
    function _miss () {
        $ ( "#libradar" ) . html ( "&#8709; We haven't found this book by ISBN, but you might want to <a href='" + base_url + "'>search manually</a>." ) ;
    }
    function _progress () {
        $ ( "#libradar" ) . html ( "&#8709; &mdash; Searching..." ) ;
    }
    var base_url = "http://ubdbs.ub.uni-leipzig.de/libero/WebopacOpenURL.cls"
    var q = "?ACTION=SEARCH&sid=LIBERO:UBL&searchby1=ISBN&TERM_1=" ;
    
    var isbn13 = _extract_isbn_from_details_page ( "ISBN-13" ) ;
    var isbn10 = ISBN . parse ( _extract_isbn_from_details_page ( "ISBN-10" ) ) . asIsbn10 ( true ) ;
    
    var url13 = base_url + q + isbn13 ;
    var url10 = base_url + q + isbn10 ;
    function _first_non_null_index (a) {
         for (var i = a . length - 1 ; i >= 0 ; i --) {
            if (null != a [ i ]) {
                return i;
            } else {
            }
        }
        ;
        return null;
    }
    function _check_url (cb, url, extractor) {
        $ ( "body" ) . prepend ( $ ( "<div id='libradar'>Checking availability of <a href='" + url + "'>this book</a>...</div>" ) ) ;
        $ . get ( url ,
        function  (data) {
            cb ( extractor ( data ) ) ;
        }
        ) ;
    }
    function _check_ubl (isbnlist) {
        var __tame_defer_cb = tame.findDeferCb ([isbnlist]);
        tame.setActiveCb (__tame_defer_cb);
        var __tame_this = this;
        var __tame_fn_13 = function (__tame_k) {
            tame.setActiveCb (__tame_defer_cb);
            var results = new Array ( ) ;
            var urls = new Array ( ) ;
            var __tame_fn_1 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_fn_2 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                     for (var i = isbnlist . length - 1 ; i >= 0 ; i --) {
                        urls [ i ] = base_url + q + isbnlist [ i ] ;
                    }
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                var __tame_fn_12 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    ;
                    var __tame_fn_3 = function (__tame_k) {
                        tame.setActiveCb (__tame_defer_cb);
                        var __tame_fn_4 = function (__tame_k) {
                            tame.setActiveCb (__tame_defer_cb);
                            var __tame_defers = new tame.Deferrals (__tame_k);
                            var __tame_fn_5 = function (__tame_k) {
                                tame.setActiveCb (__tame_defer_cb);
                                var __tame_fn_6 = function (__tame_k) {
                                    tame.setActiveCb (__tame_defer_cb);
                                     for (var i = urls . length - 1 ; i >= 0 ; i --) {
                                        _check_url (
                                        __tame_defers.defer ( { 
                                            assign_fn : 
                                                (function (__tame_slot_0, __tame_slot_1) {
                                                    return function () { 
                                                        __tame_slot_0[__tame_slot_1] = arguments[0];
                                                    }
                                                    ;
                                                }) (results, i),
                                            func_name : "_check_ubl",
                                            parent_cb : __tame_defer_cb,
                                            line : 84,
                                            file : "script-tamed.js"
                                        } )
                                        , urls [ i ] , _ubl_extractor ) ;
                                    }
                                    tame.callChain([__tame_k]);
                                    tame.setActiveCb (null);
                                };
                                var __tame_fn_7 = function (__tame_k) {
                                    tame.setActiveCb (__tame_defer_cb);
                                    ;
                                    tame.callChain([__tame_k]);
                                    tame.setActiveCb (null);
                                };
                                tame.callChain([__tame_fn_6, __tame_fn_7, __tame_k]);
                                tame.setActiveCb (null);
                            };
                            __tame_fn_5(tame.end);
                            __tame_defers._fulfill();
                            tame.setActiveCb (null);
                        };
                        var __tame_fn_11 = function (__tame_k) {
                            tame.setActiveCb (__tame_defer_cb);
                            idx = _first_non_null_index ( results ) ;
                            var __tame_fn_8 = function (__tame_k) {
                                tame.setActiveCb (__tame_defer_cb);
                                var __tame_fn_9 = function (__tame_k) {
                                    tame.setActiveCb (__tame_defer_cb);
                                    _success ( urls [ idx ] ) ;
                                    tame.callChain([__tame_k]);
                                    tame.setActiveCb (null);
                                };
                                var __tame_fn_10 = function (__tame_k) {
                                    tame.setActiveCb (__tame_defer_cb);
                                    _miss ( ) ;
                                    tame.callChain([__tame_k]);
                                    tame.setActiveCb (null);
                                };
                                if (idx != null) {
                                    tame.callChain([__tame_fn_9, __tame_k]);
                                } else {
                                    tame.callChain([__tame_fn_10, __tame_k]);
                                }
                                tame.setActiveCb (null);
                            };
                            tame.callChain([__tame_fn_8, __tame_k]);
                            tame.setActiveCb (null);
                        };
                        tame.callChain([__tame_fn_4, __tame_fn_11, __tame_k]);
                        tame.setActiveCb (null);
                    };
                    tame.callChain([__tame_fn_3, __tame_k]);
                    tame.setActiveCb (null);
                };
                tame.callChain([__tame_fn_2, __tame_fn_12, __tame_k]);
                tame.setActiveCb (null);
            };
            tame.callChain([__tame_fn_1, __tame_k]);
            tame.setActiveCb (null);
        };
        tame.callChain([__tame_fn_13, __tame_k]);
        tame.setActiveCb (null);
    }
    _check_ubl ( [ isbn10 , isbn13 ] ) ;
    tame.callChain([__tame_k]);
    tame.setActiveCb (null);
};
__tame_fn_0 (tame.end);