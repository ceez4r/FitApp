/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   COM_InputLookupCtrl
History
<Date>      <Authors Name>     <Brief Description of Change>
07/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public class COM_InputLookupCtrl {
    private static COM_InputLookupService service = new COM_InputLookupService();

    @AuraEnabled
    public static List<COM_InputLookupService.LookupRecord> searchSObjectsByName(String sObjectType, String searchTerm) {
        try {
            return service.searchSObjectsByName(sObjectType, searchTerm);
        } catch (Exception e) {
            AuraHandledException ex = new AuraHandledException(e.getMessage());
            ex.initCause(e);
            throw ex;
        }
    }

    @AuraEnabled
    public static COM_InputLookupService.LookupRecord getSObjectById(String sObjectType, String searchId) {
        try {
            return service.getSObjectById(sObjectType, searchId);
        } catch (Exception e) {
            AuraHandledException ex = new AuraHandledException(e.getMessage());
            ex.initCause(e);
            throw ex;
        }
    }
}