/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   MealPlanMealProductTriggerHelper
History
<Date>      <Authors Name>     <Brief Description of Change>
08/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public class MealPlanMealProductTriggerHelper implements ITrigger{
    public void beforeInsert(List<MealPlanMealProduct__c> newMealProducts) {
        populateAllMacroElements(newMealProducts);
    }

    public void afterInsert(List<MealPlanMealProduct__c> newMealProducts){}

    public void beforeUpdate(List<MealPlanMealProduct__c> newMealProducts, List<MealPlanMealProduct__c> oldMealProducts){
        populateAllMacroElements(newMealProducts);
    }

    public void afterUpdate(List<MealPlanMealProduct__c> newMealProducts, List<MealPlanMealProduct__c> oldMealProducts){}

    private void populateAllMacroElements(List<MealPlanMealProduct__c> newMealProducts) {
        Map<Id, Product__c> id2Product = getAllProducts(newMealProducts);

        for(MealPlanMealProduct__c mp : newMealProducts) {
            if(!id2Product.containsKey(mp.Product__c)) {
                continue;
            }

            Product__c product = id2Product.get(mp.Product__c);

            mp.Protein__c = (product.Protein__c / product.Weight__c) * mp.Weight__c;
            mp.Carbs__c = (product.Carbs__c / product.Weight__c) * mp.Weight__c;
            mp.Fat__c = (product.Fat__c / product.Weight__c) * mp.Weight__c;
            mp.Kcal__c = (product.Kcal__c / product.Weight__c) * mp.Weight__c;
        }
    }

    private Map<Id, Product__c> getAllProducts(List<MealPlanMealProduct__c> newMealProducts) {
        Set<Id> productIds = new Set<Id>();

        for(MealPlanMealProduct__c mp : newMealProducts) {
            productIds.add(mp.Product__c);
        }

        Map<Id, Product__c> id2Product = new Map<Id, Product__c>([SELECT Id, Protein__c, Carbs__c, Fat__c, Kcal__c, Weight__c FROM Product__c WHERE Id IN :productIds]);

        return id2Product;
    }
}