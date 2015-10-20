modules.define('dropdown',
    function(provide, Dropdown) {

provide(Dropdown.decl({ modName: 'mode', modVal: 'hover' }, {
    onSetMod: {
        'js': {
            'inited': function() {
                this.__base.apply(this, arguments);

                var _this = this,
                    switcher = this.getSwitcher(),
                    popup = this.getPopup();

                switcher.on({ modName: 'hovered', modVal: '*' }, function(e, data) {
                    _this.setMod('opened', data.modVal);
                });
            }
        }
    }
}));

});
