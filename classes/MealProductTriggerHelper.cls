public class MealProductTriggerHelper implements ITrigger{

    public void beforeInsert(List<MealProduct__c> newMealProducts) {
        populateAllMacroElements(newMealProducts);
    }

    public void afterInsert(List<MealProduct__c> newMealProducts){}

    public void beforeUpdate(List<MealProduct__c> newMealProducts, List<MealProduct__c> oldMealProducts){
        populateAllMacroElements(newMealProducts);
    }

    public void afterUpdate(List<MealProduct__c> newMealProducts, List<MealProduct__c> oldMealProducts){}

    private void populateAllMacroElements(List<MealProduct__c> newMealProducts) {
        Map<Id, Product__c> id2Product = getAllProducts(newMealProducts);

        for(MealProduct__c mp : newMealProducts) {
            if(!id2Product.containsKey(mp.Product__c)) {
               continue;
            }
            
            Product__c product = id2Product.get(mp.Product__c);
            System.debug('product ' + product);
            mp.Protein__c = (product.Protein__c / product.Weight__c) * mp.Weight__c;
            mp.Carbs__c = (product.Carbs__c / product.Weight__c) * mp.Weight__c;
            mp.Fat__c = (product.Fat__c / product.Weight__c) * mp.Weight__c;
            mp.Kcal__c = (product.Kcal__c / product.Weight__c) * mp.Weight__c;
        }
    }
    
    private Map<Id, Product__c> getAllProducts(List<MealProduct__c> newMealProducts) {
        Set<Id> productIds = new Set<Id>();
        
        for(MealProduct__c mp : newMealProducts) {
            productIds.add(mp.Product__c);
        }
        
        Map<Id, Product__c> id2Product = new Map<Id, Product__c>([SELECT Id, Protein__c, Carbs__c, Fat__c, Kcal__c, Weight__c FROM Product__c WHERE Id IN :productIds]);
       
        return id2Product;
    }
}