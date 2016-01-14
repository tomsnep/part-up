/**
 * Generic attribute-controlled toggle system
 *
 * In the following example clicking the <button> will toggle the 'is-open'
 * class on the <nav>:
 *
 * <button sg-toggle-button="navigation">Toggle navigation</button>
 *
 * <nav sg-toggle-class="navigation;is-open">
 *     ....
 * </nav>
 */

var KEY_SEPARATOR = ';';
var CLASS_SEPARATOR = ',';

// Create navtoggles
var toggles = document.querySelectorAll('[sg-toggle-button]');
for (var i = 0; i < toggles.length; i ++) {
    if (toggles[i]) {
        bindToggle(toggles[i]);
    }
}

// bind toggler
function bindToggle (toggle) {
    var _key = toggle.getAttribute('sg-toggle-button');

    toggle.addEventListener('click', function(event) {
        event.preventDefault();

        // Find elements attribute "sg-toggle-class" with the same key
        var sel = '[sg-toggle-class^="' + _key + ';"]';
        var nodeList = document.querySelectorAll(sel);

        for (var i = 0; i < nodeList.length; ++i) {
            var node = nodeList[i];

            node.getAttribute('sg-toggle-class')
                .split(KEY_SEPARATOR)[1]
                .split(CLASS_SEPARATOR)
                .forEach(function(className) {
                    node.classList.toggle(className);
                });
        }
    });
};
