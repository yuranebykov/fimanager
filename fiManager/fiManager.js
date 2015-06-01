(function(window, document) { 'use strict';
    var fiManager = {},
        baseUrl,
        jQuery;

    baseUrl = (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1].src.split('/').slice(0, -1).join('/') + '/';
    })();
    
    if(window['jQuery'] === undefined) loadJQuery(init);
    else init();

    /* Load jQuery */
    function loadJQuery(init) {
        var _xmlHttp = new XMLHttpRequest();
        _xmlHttp.open('GET', baseUrl + 'lib/jquery-1.11.3.min.js', true);
        _xmlHttp.onload = function() {
            (new Function(_xmlHttp.response))();
            init();
        };
        _xmlHttp.send();
    }

    /* Bootstrap */
    function init() {
        jQuery = window['jQuery'];
        jQuery.get(baseUrl+'config.json', function(result) {
            fiManager.config = result;
            fiManager.config.baseUrl = baseUrl;
            jQuery(document).ready(run());
        });

        function run() {
            if(window.opener) {
                fiManager.parent = window.opener.fiManager;
                fiManager.thatDomClickFiManager = fiManager.parent.listDomClick[window['fiManagerId']];
                if(fiManager.thatDomClickFiManager) {
                    renderWindow();
                }
            } else {
                getClicksFiManager();
            }
        }
    }

    /* Element button, opens window of files manager  */
    function DomClickFiManager(dom, id) {
        var _url = dom.getAttribute('fim-url');

        jQuery(dom).click(function() {
            windowFiManager(id);
        });

        this.url = function() {
            return _url;
        };

        this.resultKey = dom.getAttribute('fim-setRes');
    }

    DomClickFiManager.prototype.setResult = function(src) {
        var _listDomResult = jQuery('[fim-showRes="' + this.resultKey + '"]');

        for(var i = 0, l = _listDomResult.length; i < l; i++) {
            appendSrc(_listDomResult[i], src);
        }
    };

    function appendSrc(dom, src) {
        switch (dom.tagName) {
            case 'IMG': dom.src = src; break;
            case 'INPUT': dom.value = src; break;
            default : dom.innerHTML = src;
        }
    }

    /* Get all elements with name attributes 'fim-url' */
    function getClicksFiManager() {
        var _listDomClick = jQuery('[fim-url]');

        fiManager.listDomClick = [];

        for(var i = 0, l = _listDomClick.length; i < l; i++)
            fiManager.listDomClick.push(new DomClickFiManager(_listDomClick[i], i));
    }

    /* Create and open window of files manager */
    function windowFiManager(id) {
        var _wFiManager = window.open('', '', 'width='+(screen.width - 500)+', height='+(screen.height - 550));

        _wFiManager.document.open();
        _wFiManager.document.write(
            '<html>' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<title>fiManager</title>' +
            '<link rel="stylesheet" href="'+ baseUrl +'styles.css"/>' +
            '<script>fiManagerId = ' + id + '</script>' +
            '<script src="'+ baseUrl +'lib/jquery-1.11.3.min.js"></script>' +
            '<script src="'+ baseUrl +'fiManager.js"></script>' +
            '</head>' +
            '<body></body>' +
            '</html>'
        );
        _wFiManager.document.close();
    }

    /* Get object from GET method */
    function urlSearch() {
        var _arr= window.location.search.substring(1).split('&'),
            _obj = {};

        for(var i = 0, l = _arr.length; i < l; i++) {
            var _arrSearch = _arr[i].split('=');
            _obj[_arrSearch[0]] = _arrSearch[1];
        }

        return _obj;
    }

    function renderWindow() {
        jQuery.get(fiManager.thatDomClickFiManager.url(), function(result) {
            fiManager.listDom = [];

            for(var i = 0, l = result.length; i < l; i++) {
                fiManager.listDom[i] = document.createElement('img');
                fiManager.listDom[i].src = result[i];
                jQuery(fiManager.listDom[i]).click(function(e) {
                    fiManager.thatDomClickFiManager.setResult(e.target.src);
                    window.close();
                });
                jQuery('body').append(jQuery(fiManager.listDom[i]));
            }
        })
    }

    window.fiManager = fiManager;
})(window, document);