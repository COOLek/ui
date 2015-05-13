/**
 * @module form-field
 */
modules.define('form-field',
    ['validation_email', 'objects'],
    function(provide, validate_email, objects, FormField) {

/**
 * E-mail form-field validation

 * @exports
 * @class form-field
 * @bem
 */
FormField.decl({ modName : 'validate', modVal : 'email' }, /** @lends form-field.prototype */{

    onSetMod : {
        'js' : {
            'inited' : function() {
                this.__base.apply(this, arguments);

                if (!this.hasMod('has-validate')) {
                    console.error('mod "validate" should only be used with "has-validate"!');
                } else {
                    this.getValidator().push(validate_email(this.params.email));
                }
            }
        }
    }

});

provide(FormField);

});
