/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppProductController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
18.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    toggleEdit: function(cmp, event, helper) {
        let editMode = cmp.get('v.editMode');
        cmp.set('v.editMode', !editMode);
    },

    validate: function (cmp, event, helper) {
        return helper.validateAllInputs(cmp, 'form');
    }
})