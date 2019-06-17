/**
 * Created by ceezar on 22.06.2017.
 */
@isTest
private class EmailUtils_Test {

    static testMethod void test_mergeTemplate_NoTemplate() {
        List<Map<String, String>> records = new List<Map<String, String>>();

        Test.startTest();
        EmailTemplate et = EmailUtils.mergeTemplate('Test Tony Stark 999999999', records);
        Test.stopTest();

        System.assertEquals(null, et, 'There should be no template returned');
    }

    static testMethod void test_mergeTemplate() {
        List<Map<String, String>> records = new List<Map<String, String>>();
        List<String> allValues = new List<String>();
        for(Integer i = 0; i < 100; i++) {
            Map<String, String> fieldName2Value = new Map<String, String>();
            String customId = String.ValueOf(1234 * Math.random());
            String accNum = String.ValueOf(i);

            fieldName2Value.put(Label.MergeFieldCustomId, customId);
            fieldName2Value.put(Label.MergeFieldNumberOfAccounts, accNum);

            records.add(fieldName2Value);
            allValues.add(customId);
            allValues.add(accNum);
        }

        Test.startTest();
        EmailTemplate et = EmailUtils.mergeTemplate('New_Accounts_Notification', records);
        Test.stopTest();

        System.assert(!et.HtmlValue.contains(Label.MergeFieldCustomId), 'Html value doesn\'t contain custom id merge label');
        System.assert(!et.HtmlValue.contains(Label.MergeFieldNumberOfAccounts),
            'Html value doesn\'t contain number of accounts merge label');
        System.assert(!et.Body.contains(Label.MergeFieldCustomId), 'Plain text value doesn\'t contain custom id merge label');
        System.assert(!et.Body.contains(Label.MergeFieldNumberOfAccounts),
            'Plain text value doesn\'t contain number of accounts merge label');

        for(String value : allValues) {
            System.assert(et.HtmlValue.contains(value), 'Value was correctly merged into html text in template: ' + value);
            System.assert(et.Body.contains(value), 'Value was correctly merged into plain text in template: ' + value);
        }
    }

    static testMethod void test_mergeTemplate_NotMergableTemplate() {
        String templateName = 'No_New_Accounts_Notification';
        List<Map<String, String>> records = new List<Map<String, String>>();
        for(Integer i = 0; i < 100; i++) {
            Map<String, String> fieldName2Value = new Map<String, String>();
            fieldName2Value.put(Label.MergeFieldCustomId, String.ValueOf(1234 * Math.random()));
            fieldName2Value.put(Label.MergeFieldNumberOfAccounts, '2');
            records.add(fieldName2Value);
        }

        Test.startTest();
        EmailTemplate et = EmailUtils.mergeTemplate(templateName, records);
        Test.stopTest();

        EmailTemplate etOriginal = [SELECT HtmlValue, Body, Subject FROM EmailTemplate WHERE DeveloperName = :templateName];

        System.assertEquals(etOriginal.HtmlValue, et.HtmlValue, 'Html value has not been changed');
        System.assertEquals(etOriginal.Body, et.Body, 'Plain text value has not been changed');
    }
}