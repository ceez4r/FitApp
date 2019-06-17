/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMainHelper.js
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    doInit: function(cmp) {
        this.showElement(cmp, 'spinner');
        this.retrieveContactDetails(cmp);
    },

    retrieveContactDetails: function(cmp) {
        this.callServer(cmp, 'c.getContact', {},
            this.processGetContactResult.bind(this, cmp)
        );
    },

    processGetContactResult: function(cmp, result) {
        this.hideElement(cmp, 'spinner');
        cmp.set('v.contact', result);
    },

    saveCustomer: function(cmp) {
        let contact = cmp.get('v.contact');

        this.showElement(cmp, 'spinner');
        this.callServer(cmp, 'c.saveCustomer', {contactJson: JSON.stringify(contact)},
            this.processSaveCustomer.bind(this, cmp)
        );
    },

    processSaveCustomer: function(cmp) {
        this.hideElement(cmp, 'spinner');
    }


})