/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMainController
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public with sharing class FitAppMainController {
    private static FitAppMainService service = new FitAppMainService();

    @AuraEnabled
    public static FitAppMainService.ContactWrapper getContact() {
        return service.getContact();
    }

    @AuraEnabled
    public static void saveCustomer(String contactJson) {

        if(String.isEmpty(contactJson)) {
            throw new AuraHandledException('Something went wrong. Please contact administrator.');//TODO add label
        }

        FitAppMainService.ContactWrapper contact = (FitAppMainService.ContactWrapper) JSON.deserialize(contactJson,
            FitAppMainService.ContactWrapper.class);

        service.saveContact(contact);
    }
}