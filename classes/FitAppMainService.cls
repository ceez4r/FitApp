/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMainService
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public class FitAppMainService extends BaseComponent{

    public ContactWrapper getContact() {
        ContactWrapper cw;

        List<Contact> contacts = [
            SELECT Id, FirstName, LastName, Birthdate, Age__c, Body_shape__c, Carbs__c, Daily_Activity__c,
                Diet_goal__c, Expected_Weight__c, Fat__c, Height__c, Kcal__c, Manual_Calculation__c,
                Protein__c, Sex__c, Weight__c, Goal_Kcal_Diff__c, Daily_Protein__c, Daily_Carbs__c, Daily_Fat__c,
                (SELECT Id, Duration__c, Intensitivity__c, Quantity__c, Type__c FROM Trainings__r)
            FROM Contact
            WHERE Id IN (SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId())
        ];

        if(!contacts.isEmpty()) {
            cw = new ContactWrapper(contacts[0]);
            cw.picklists = loadPicklists();
        }

        return cw;
    }

    public void saveContact(ContactWrapper contact) {

        upsert contact.record;

        if(contact.trainings != null && !contact.trainings.isEmpty()) {
            saveTrainings(contact.trainings);
        }
    }

    private void saveTrainings(List<Training__c> trainings) {
        upsert trainings;
    }

    private ContactPicklists loadPicklists() {
        ContactPicklists picklists = new ContactPicklists();

        picklists.sex = getPicklistValues(Contact.class.toString(), 'Sex__c');
        picklists.dailyActivity = getPicklistValues(Contact.class.toString(), 'Daily_Activity__c');
        picklists.dietGoal = getPicklistValues(Contact.class.toString(), 'Diet_goal__c');
        picklists.bodyShape = getPicklistValues(Contact.class.toString(), 'Body_shape__c');
        picklists.intensivity = getPicklistValues(Training__c.class.toString(), 'Intensitivity__c');
        picklists.trainingType = getPicklistValues(Training__c.class.toString(), 'Type__c');

        return picklists;
    }

    public class ContactWrapper {
        @AuraEnabled
        public Contact record;
        @AuraEnabled
        public List<Training__c> trainings;
        @AuraEnabled
        public Boolean isSetupCompleted;
        @AuraEnabled
        public ContactPicklists picklists;

        public ContactWrapper(Contact record) {
            this.record = record;
            this.isSetupCompleted = record.Age__c != null && record.Body_shape__c != null && record.Carbs__c != null &&
                record.Daily_Activity__c != null && record.Diet_goal__c != null && record.Fat__c != null &&
                record.Height__c != null && record.Kcal__c != null && record.Protein__c != null &&
                record.Manual_Calculation__c != null && record.Sex__c != null && record.Weight__c != null;
        }
    }

    public class ContactPicklists {
        @AuraEnabled
        public List<PicklistValue> sex;
        @AuraEnabled
        public List<PicklistValue> dailyActivity;
        @AuraEnabled
        public List<PicklistValue> dietGoal;
        @AuraEnabled
        public List<PicklistValue> bodyShape;
        @AuraEnabled
        public List<PicklistValue> intensivity;
        @AuraEnabled
        public List<PicklistValue> trainingType;
    }
}