/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMainController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    doInit: function(component, event, helper) {
        helper.doInit(component);
    },

    handleSaveEvent: function(component, event, helper) {
        var cmpName = event.getParam("cmpName");

        if(cmpName === 'FitAppCustomerSetup') {
            helper.saveCustomer(component);
        }
    }
})