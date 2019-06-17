trigger MealProductTrigger on MealProduct__c (before insert, after insert, before update) {
    TriggerFactory.createHandler(MealProduct__c.sObjectType);
}