var expect = chai.expect;

modules.define('spec',
    ['jquery', 'spec__utils', 'input', 'popup', 'calendar', 'moment'],
    function(provide, $, helper, input, popup, calendar, moment) {

var build = helper.buildBlock;

describe('input_has-calendar', function() {

    var block,
        bemjson;

    beforeEach(function() {
        bemjson = {
            block: 'input',
            mods: { 'has-calendar': true, 'has-addon': true }
        };
    });

    afterEach(function() {
        helper.destruct(block);
    });

    it('should have `control` and `box` elements', function() {
        block = build('input', bemjson);
        expect(block.elem('box')).to.not.be.null;
        expect(block.elem('control')).to.not.be.null;
    });

    it('should add `calendar` block to `box` element', function() {
        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar');

        expect(calendar).to.not.be.null;
    });

    it('should pass `theme`, `bkg` and `size` mods to `calendar`', function() {
        bemjson.mods.theme = 'xxx';
        bemjson.mods.bkg = 'yyy';
        bemjson.mods.size = 'm';
        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar');

        calendar.getMod('theme').should.equal('xxx');
        calendar.getMod('bkg').should.equal('yyy');
        calendar.getMod('size').should.equal('m');
    });

    it('should not to install `bkg` mods to `popup`', function() {
        bemjson.mods.bkg = 'yyy';
        block = build('input', bemjson);
        var popup = block.findBlockInside('calendar')._popup;

        popup.getMod('bkg').should.equal('');
    });

    it('should set popup`s anchor', function() {
        block = build('input', bemjson);

        var popup = block.findBlockInside('calendar')._popup;

        block.elem('control').trigger('focus');
        block.getMod('focused').should.be.true;

        popup._anchor.should.equal(block.domElem);
    });

    it('should add elems block `calendar` in `popup`', function() {
        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar');

        expect(calendar.findElem('container')).to.not.be.null;
        expect(calendar.findElem('title')).to.not.be.null;
    });

    it('should show calendar', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.showCalendar();
        popup.getMod('visible').should.be.true;
        block.showCalendar();
        popup.getMod('visible').should.be.true;
    });

    it('should close calendar when item selected', function() {

        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar'),
            popup = calendar._popup;

        block.elem('control').trigger('focus');
        popup.getMod('visible').should.be.true;
        // click on day
        calendar.findElem('day').click();

        popup.getMod('visible').should.equal('');
    });

    it('should set val calendar when item selected', function() {

        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar');

        block.elem('control').trigger('focus');
        calendar.findElem('day').eq(10).click();

        (block.getDate().toString() === calendar.getVal().toString()).should.be.true;
    });

    it('should get `Date`', function() {
        block = build('input', bemjson);
        var calendar = block.findBlockInside('calendar');

        block.elem('control').trigger('focus');
        calendar.findElem('day').eq(10).click();

        (moment.isDate(calendar.getVal())).should.be.true;
        (moment.isDate(block.getDate())).should.be.true;

    });

    it('should toggle calendar when clicked switcher element', function() {

        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        expect(block.findElem('calendar')).to.not.be.null;

        block.findElem('calendar').trigger(new $.Event('pointerclick'));
        popup.getMod('visible').should.be.true;

        block.findElem('calendar').trigger(new $.Event('pointerclick'));
        popup.getMod('visible').should.equal('');
    });

    it('should not open calendar when input desabled', function() {

        bemjson.mods.disabled = true;

        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.findElem('calendar').trigger(new $.Event('pointerclick'));
        popup.getMod('visible').should.be.fale;
    });

    it('should emit event `change` on calendar when day selected', function() {
        block = build('input', bemjson);
        block.setVal('');
        var calendar = block._calendar,
            eventCatched = false;

        block.elem('control').trigger('focus');

        calendar.on('change', function(_, item) {
            eventCatched = true;
        });

        // click on item
        calendar.findElem('day').eq(10).click();

        eventCatched.should.be.true;
    });

    it('should not visible the popup when user set blur on input', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;

        block.elem('control').blur();
        popup.getMod('visible').should.equal('');
    });

    it('should visible the popup when user pointerdown event on input or calendar', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.domElem.trigger(new $.Event('pointerdown'));
        block._calendar._popup.getMod('visible').should.equal('');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;
        block._calendar.domElem.trigger(new $.Event('pointerdown'));
        popup.getMod('visible').should.be.true;
        block._ignoreBlur.should.be.true;
        block.elem('control').blur();
        block._ignoreBlur.should.be.false;
    });

    it('should hide popup when user pointerdown event outside', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;
        $('body').trigger(new $.Event('pointerdown'));
        block._calendar._popup.getMod('visible').should.equal('');
    });

    it('should close the popup when user clicked outside', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;

        block.elem('control').blur();

        var x = popup.domElem.position().left - 10, y = popup.domElem.position().top - 10;
        $(document).trigger(new $.Event('pointerpress', { pageX: x, pageY: y }));
        $(document).trigger(new $.Event('pointerrelease', { pageX: x, pageY: y }));
        popup.getMod('visible').should.equal('');
    });

    it('should not close the popup when user clicked inside', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;

        var x = popup.domElem.position().left + 10, y = popup.domElem.position().top + 10;
        popup.domElem.trigger(new $.Event('pointerpress', { pageX: x, pageY: y }));
        popup.domElem.trigger(new $.Event('pointerrelease', { pageX: x, pageY: y }));

        popup.getMod('visible').should.be.true;
    });

    it('should not close the popup when user clicked on input', function() {
        block = build('input', bemjson);
        var popup = block.findBlockInside('popup');

        block.elem('control').focus();
        popup.getMod('visible').should.be.true;

        var x = block.domElem.position().left + 1, y = block.domElem.position().top + 1;
        block.domElem.trigger(new $.Event('pointerpress', { pageX: x, pageY: y }));
        block.domElem.trigger(new $.Event('pointerrelease', { pageX: x, pageY: y }));

        popup.getMod('visible').should.be.true;
    });

    it('should emit "pick-date" event on calendar changed', function() {
        block = build('input', bemjson);

        var calendar = block.getCalendar();
        var shouldBeCalled = false;
        block.on('pick-date', function() {
            shouldBeCalled = true;
        });

        calendar.emit('change', { formated: 'hi there' });

        shouldBeCalled.should.be.true;
    });

    it('should be set readable format date', function() {
        bemjson.mods['readable-date'] = true;
        block = build('input', bemjson);

        var formatedDate = '24.06.2015';
        var readableDate = '24 июня 2015';

        block.hasMod('readable-date').should.be.true;

        block.elem('control').trigger('focus');
        block.setVal(formatedDate);
        block.getVal().should.be.equal(formatedDate);

        block.elem('control').trigger('blur');
        block.getVal().should.be.equal(readableDate);

    });

    it('should be set date when pressed ENTER', function() {
        block = build('input', bemjson);

        block.elem('control').trigger('focus');
        block.setVal('24.06.2015');
        block.domElem.trigger(new $.Event('keydown', { keyCode: 13 })); // ENTER
        (block._calendar.getVal().toString() === block.getDate().toString()).should.be.true;

        block.domElem.trigger(new $.Event('keydown', { keyCode: 40 })); // DOWN

    });

});

provide();

});
