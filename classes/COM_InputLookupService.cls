/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   COM_InputLookupService
History
<Date>      <Authors Name>     <Brief Description of Change>
07/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public with sharing class COM_InputLookupService {
    public final static Integer MAX_LOOKUP_RESULTS = 15;

    public List<LookupRecord> searchSObjectsByName(String sObjectType, String searchTerm) {
        return querySObjects(
                'SELECT Id, Name FROM ' + String.escapeSingleQuotes(sObjectType) + ' ' +
                        'WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchTerm) + '%\' ' +
                        'LIMIT ' + MAX_LOOKUP_RESULTS
        );
    }

    public LookupRecord getSObjectById(String sObjectType, String searchId) {
        List<LookupRecord> results = querySObjects(
                'SELECT Id, Name FROM ' + String.escapeSingleQuotes(sObjectType) + ' ' +
                        'WHERE Id = \'' + String.escapeSingleQuotes(searchId) + '\' ' +
                        'LIMIT 1'
        );

        if(results.isEmpty()){
            throw new LookupNotFoundException('Lookup doesn\'t exist');
        }

        return results[0];
    }

    private List<LookupRecord> querySObjects(String query) {
        List<LookupRecord> results = new List<LookupRecord>();
        List<sObject> sObjects = Database.query(query);

        for(sObject row: sObjects){
            results.add(new LookupRecord(row));
        }

        return results;
    }

    public class LookupRecord {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String name;

        public LookupRecord(sObject obj) {
            this.id = (String) obj.get('Id');
            this.name = (String) obj.get('Name');
        }
    }

    public class LookupNotFoundException extends Exception{}
}