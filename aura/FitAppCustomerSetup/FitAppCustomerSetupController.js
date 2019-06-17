/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppCustomerSetupController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
06.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    save: function(cmp, event, helper) {
        helper.sendComponentEvent(cmp, 'fitAppSaveEvent', {
            "cmpName" : "FitAppCustomerSetup"
        });
    }
})