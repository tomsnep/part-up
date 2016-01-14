// Create and expose submenus
window.pagesSubmenu = new Submenu('pages');
window.documentationsSubmenu = new Submenu('documentations');

// Submenu constructor
function Submenu (name) {
    var _container = document.querySelector('[sg-submenu=' + name + ']');

    if (!_container) {
        throw new Error('no submenu found called "' + name + '"');
    }

    var _elements = {
        menu: {
            all: _container.querySelectorAll('[sg-submenu-overview], [sg-submenu-item]'),
            overview: _container.querySelector('[sg-submenu-overview]'),
            single: {},
        },
        title: _container.querySelector('[sg-submenu-title]')
    };

    Array().forEach.call(_container.querySelectorAll('[sg-submenu-item]'), function(itemMenu) {
        var name = itemMenu.getAttribute('sg-submenu-item');
        _elements.menu.single[name] = itemMenu;
    });

    var hideAll = function() {
        Array().forEach.call(_elements.menu.all, function(menu) {
            menu.classList.add('is-inactive');
        });
    };

    // Api: showItem(page)
    this.showItem = function(page) {
        hideAll();
        _elements.menu.single[page].classList.remove('is-inactive');
        _elements.title.innerText = '(' + page + ')';
    };

    // Api: showOverview()
    this.showOverview = function() {
        hideAll();
        _elements.menu.overview.classList.remove('is-inactive');
        _elements.title.innerText = '';
    };
};
