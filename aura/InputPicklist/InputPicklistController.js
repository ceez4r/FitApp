/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   InputPicklistController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    doInit: function(cmp, event, helper) {
        cmp.set('v.validity', {valid: true});
        helper.setDefaultOnChangeIfNotSet(cmp);
    },

    showHelpMessageIfInvalid: function(cmp, event) {
        var selectInput = cmp.find('selectInput');
        var valid = true;

        if(selectInput.isValid() && typeof selectInput.showHelpMessageIfInvalid === 'function' &&
            !$A.util.isUndefinedOrNull(selectInput.get('v.validity'))) {
            selectInput.showHelpMessageIfInvalid();
            valid = selectInput.get('v.validity').valid;
        }

        cmp.set('v.validity', {valid: valid});
    },

    defaultOnChange: function(cmp, event, helper) {
        //needed in case onchange attribute is empty to avoid errors in console
    }
})