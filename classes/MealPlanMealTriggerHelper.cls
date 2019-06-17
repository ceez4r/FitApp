/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   MealPlanMealHelper
History
<Date>      <Authors Name>     <Brief Description of Change>
08/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public class MealPlanMealTriggerHelper implements ITrigger{

    public void beforeInsert(List<MealPlanMeal__c> newMealPlanMeals) {
        populateAllMacroElements(newMealPlanMeals);
    }

    public void afterInsert(List<MealPlanMeal__c> newMealPlanMeals){}

    public void beforeUpdate(List<MealPlanMeal__c> newMealPlanMeals, List<MealPlanMeal__c> oldMealPlanMeals){
        populateAllMacroElements(newMealPlanMeals);
    }

    public void afterUpdate(List<MealPlanMeal__c> newMealPlanMeals, List<MealPlanMeal__c> oldMealPlanMeals){}

    private void populateAllMacroElements(List<MealPlanMeal__c> newMealPlanMeals) {
        Map<Id, Meal__c> id2Meal = getAllMeals(newMealPlanMeals);

        for(MealPlanMeal__c mpm : newMealPlanMeals) {
            if(!id2Meal.containsKey(mpm.Meal__c)) {
                continue;
            }

            Meal__c meal = id2Meal.get(mpm.Meal__c);

            mpm.Protein__c = meal.Protein__c;
            mpm.Carbs__c = meal.Carbs__c;
            mpm.Fat__c = meal.Fat__c;
            mpm.Kcal__c = meal.Kcal__c;
        }
    }

    private Map<Id, Meal__c> getAllMeals(List<MealPlanMeal__c> newMealPlanMeals) {
        Set<Id> mealIds = new Set<Id>();

        for(MealPlanMeal__c mp : newMealPlanMeals) {
            mealIds.add(mp.Meal__c);
        }

        Map<Id, Meal__c> id2Meal = new Map<Id, Meal__c>([SELECT Id, Protein__c, Carbs__c, Fat__c, Kcal__c FROM Meal__c WHERE Id IN :mealIds]);

        return id2Meal;
    }
}