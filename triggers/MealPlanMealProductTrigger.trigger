/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   MealPlanMealProduct
History
<Date>      <Authors Name>     <Brief Description of Change>
08/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

trigger MealPlanMealProductTrigger on MealPlanMealProduct__c (before insert, before update) {
    TriggerFactory.createHandler(MealPlanMealProduct__c.sObjectType);
}