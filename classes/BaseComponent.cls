/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   BaseComponent
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public abstract class BaseComponent {
    public List<PicklistValue> getPicklistValues(String objectName, String fieldName) {
        List<PicklistValue> options = new List<PicklistValue>();
        Schema.DescribeFieldResult fieldResult =
                Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldName).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry f : ple) {
            options.add(new PicklistValue(f.getLabel(), f.getValue()));
        }
        return options;
    }

    public class PicklistValue {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public Boolean selected;
        @AuraEnabled
        public String value;

        public PicklistValue(String label, String value) {
            this.value = value;
            this.label = label;
            this.selected = false;
        }
    }
}