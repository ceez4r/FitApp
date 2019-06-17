/**
 * Created by czeleznick002 on 03.10.2018.
 */

public class FitAppBookService {
    public List<MealPlan> getMealPlans(String mealPlanId) {
        List<MealPlan> mealPlans = new List<MealPlan>();

        mealPlans = loadMealPlans(mealPlanId);
        return mealPlans;
    }

    private List<MealPlan> loadMealPlans(String mealPlanId) {
        List<MealPlan> mealPlansWrapped = new List<MealPlan>();
        List<MealPlanMeal__c> mealPlanMeals = new List<MealPlanMeal__c>();
        Map<Id, List<MealPlanMeal__c>> mealId2MealPlanMeals = new Map<Id, List<MealPlanMeal__c>>();

        User user = [SELECT Id, ContactId FROM User WHERE Id = : UserInfo.getUserId()];

        if(user.ContactId == null) {
            return mealPlansWrapped;
        }

        if(String.isBlank(mealPlanId)) {
            mealPlanMeals = [
                SELECT Id, Carbs__c, Protein__c, Fat__c, Kcal__c, Name, Meal_Plan__r.Name, Meal__c, Meal_Plan__r.Starting_Day__c,
                        Meal_Plan__c, Meal_Plan__r.Id,
                    (SELECT Id, Carbs__c, Protein__c, Fat__c, Weight__c, Kcal__c, Product__c, Product_Name__c,
                            Product__r.Name, Product__r.Protein__c, Product__r.Carbs__c, Product__r.Fat__c, Product__r.Kcal__c,
                            MealPlanMeal__c
                    FROM MealPlanMealProducts__r)
                FROM MealPlanMeal__c
                WHERE Meal_Plan__r.Contact__c = :user.ContactId
                ORDER BY Meal_Plan__r.Starting_Day__c ASC
            ];
        } else {
            mealPlanMeals = [
                SELECT Id, Carbs__c, Protein__c, Fat__c, Kcal__c, Name, Meal_Plan__r.Name, Meal__c, Meal_Plan__r.Starting_Day__c,
                    Meal_Plan__c, Meal_Plan__r.Id,
                    (SELECT Id, Carbs__c, Protein__c, Fat__c, Weight__c, Kcal__c, Product__c, Product_Name__c,
                            Product__r.Name, Product__r.Protein__c, Product__r.Carbs__c, Product__r.Fat__c, Product__r.Kcal__c,
                            MealPlanMeal__c
                    FROM MealPlanMealProducts__r)
                FROM MealPlanMeal__c
                WHERE Meal_Plan__r.Contact__c = :user.ContactId AND Meal_Plan__r.Id =: mealPlanId
                ORDER BY Meal_Plan__r.Starting_Day__c ASC
            ];
        }

        for(MealPlanMeal__c mpm : mealPlanMeals) {
            if(mealId2MealPlanMeals.containsKey(mpm.Meal_Plan__c)) {
                mealId2MealPlanMeals.get(mpm.Meal_Plan__c).add(mpm);
            } else {
                mealId2MealPlanMeals.put(mpm.Meal_Plan__c, new List<MealPlanMeal__c>{mpm});
            }
        }

        for(Id mpmId : mealId2MealPlanMeals.keySet()) {
            List<MealPlanMeal__c> mpms = mealId2MealPlanMeals.get(mpmId);
            mealPlansWrapped.add(new MealPlan(mpms[0].Meal_Plan__r, mpms));
        }

        return mealPlansWrapped;
    }

    public void saveMealPlans(List<MealPlan> mealPlans) {
        //
    }

    public MealPlan saveMealPlan(MealPlan mealPlan) {
        Meal_Plan__c mealPlanRecord = mealPlan.getSobject();
        List<MealPlanMeal__c> mealPlanMeals = new List<MealPlanMeal__c>();

        upsert mealPlanRecord;
        System.debug('Meal plan ' + mealPlanRecord);

//        for(Meal meal : mealPlan.meals) {
//            if(meal.id == null) {
//                continue;
//            }
//
//            mealPlanMeals.add(new MealPlanMeal__c(Meal_Plan__c = mealPlanRecord.Id, Meal__c = meal.mealTemplateId));
//        }
//
//        upsert mealPlanMeals;

        if(mealPlan.mealPleanMealIdsToRemove != null && !mealPlan.mealPleanMealIdsToRemove.isEmpty()) {
            Database.delete(mealPlan.mealPleanMealIdsToRemove);
        }

        return loadMealPlans(mealPlanRecord.Id)[0];
    }

    public void saveMeals() {

    }

    public Meal saveMeal(Meal meal, MealPlan mealPlan) {
        List<MealPlanMealProduct__c> mealPlanMealProducts = new List<MealPlanMealProduct__c>();
        List<MealProduct__c> mealProducts = new List<MealProduct__c>();
        List<Product__c> newProducts = new List<Product__c>();
        Map<Integer, Product__c> productsWithNoMealJunction = new Map<Integer, Product__c>();
        List<Decimal> newProductWeights = new List<Decimal>();
        Meal__c mealToInsert = meal.getMealSobject();

        if(String.isEmpty(mealPlan.id)) {
            Meal_Plan__c mealPlanRecord = mealPlan.getSobject();
            insert mealPlanRecord;
            mealPlan.id = mealPlanRecord.Id;
        }

        meal.mealPlanId = mealPlan.id;
        MealPlanMeal__c mealToUpsert = meal.getSobject();

        for(Integer i = 0; i < meal.products.size(); i++) {
            Product product = meal.products[i];
            System.debug('product ' + product);
            if(product.productId == null) {
                newProducts.add(product.getSobjectForProduct());
                newProductWeights.add(product.weight);
            } else if (product.id == null || String.valueOf(product.id).substring(0, 3) != MealPlanMealProduct__c.SObjectType.getDescribe().getKeyPrefix()){
                productsWithNoMealJunction.put(i, product.getSobjectForProduct());
            } else {
                mealPlanMealProducts.add(new MealPlanMealProduct__c(Id = product.id, Weight__c = product.weight));
            }
        }

        System.debug('newProducts ' + newProducts);
        System.debug('productsWithNoMealJunction ' + productsWithNoMealJunction);
        System.debug('mealPlanMealProducts ' + mealPlanMealProducts);

        insert newProducts;
        upsert mealToUpsert;

        if(String.isEmpty(meal.mealTemplateId)) {
            insert mealToInsert;
        }

        for(Integer i = 0; i < newProducts.size(); i++) {
            Product__c productWithNoMealJunction = newProducts[i];
            Decimal weight = newProductWeights[i];
            mealPlanMealProducts.add(new MealPlanMealProduct__c(MealPlanMeal__c = mealToUpsert.Id, Product__c = productWithNoMealJunction.Id, Weight__c = weight));

            if(mealToInsert.Id != null) {
                mealProducts.add(new MealProduct__c(Meal__c = mealToInsert.Id, Product__c = productWithNoMealJunction.Id, Weight__c = weight));
            }
        }

        for(Integer index : productsWithNoMealJunction.keySet()) {
            Product__c productWithNoMealJunction = productsWithNoMealJunction.get(index);
            Decimal weight = meal.products[index].weight;
            mealPlanMealProducts.add(new MealPlanMealProduct__c(MealPlanMeal__c = mealToUpsert.Id, Product__c = productWithNoMealJunction.Id, Weight__c = weight));
        }

        upsert mealPlanMealProducts;

        if(meal.productIdsToBeRemoved != null && !meal.productIdsToBeRemoved.isEmpty()) {
            Database.delete(meal.productIdsToBeRemoved);
        }

        return getSingleMealFromDb(mealToUpsert.Id, meal.mealPlanId);
    }

    private Meal getSingleMealFromDb(Id mealId, Id mealPlanId) {
        MealPlanMeal__c mealRecord = [
            SELECT Id, Carbs__c, Protein__c, Fat__c, Kcal__c, Name, Meal__c, Meal_Plan__r.Name, Meal_Plan__r.Starting_Day__c,
                    Meal_Plan__c, Meal_Plan__r.Id,
                (SELECT Id, Carbs__c, Protein__c, Fat__c, Weight__c, Product__c, Kcal__c, Product_Name__c,
                    Product__r.Name, Product__r.Protein__c, Product__r.Carbs__c, Product__r.Fat__c, Product__r.Kcal__c,
                    MealPlanMeal__c
            FROM MealPlanMealProducts__r)
            FROM MealPlanMeal__c
                WHERE Id = :mealId AND Meal_Plan__c = :mealPlanId
        ];

        return new Meal(mealRecord, mealPlanId);
    }

    public Meal getSingleMealFromDb(Id mealId) {
        Meal__c mealRecord = [
            SELECT Id, Carbs__c, Protein__c, Fat__c, Kcal__c, Name,
                (SELECT Id, Carbs__c, Protein__c, Fat__c, Weight__c, Product__c, Kcal__c, Product_Name__c, Meal__c,
                    Product__r.Name, Product__r.Protein__c, Product__r.Carbs__c, Product__r.Fat__c, Product__r.Kcal__c
                FROM MealProducts__r)
            FROM Meal__c
            WHERE Id = :mealId
        ];

        return new Meal(mealRecord, null);
    }

    public List<Product> getProducts(String searchPhrase) {
        List<Product> products = new List<Product>();
        searchPhrase = '%' + String.escapeSingleQuotes(searchPhrase) + '%';

        for(Product__c product : [
            SELECT Id, Name, Carbs__c, Fat__c, Protein__c, Weight__c, Kcal__c
            FROM Product__c WHERE Name LIKE :searchPhrase]
        ) {
            products.add(new Product(product));
        }

        return products;
    }

    public class MealPlan {
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Date day;
        @AuraEnabled
        public List<Meal> meals;
        @AuraEnabled
        public List<Id> mealPleanMealIdsToRemove;
        @AuraEnabled
        public String contactId;
        @AuraEnabled
        public Id id;

        public MealPlan(Meal_Plan__c mealPlan, List<MealPlanMeal__c> mealPlanMeals) {
            this.day = mealPlan.Starting_Day__c;
            this.id = mealPlan.Id;
            this.meals = populateMeals(mealPlanMeals);
        }

        private List<Meal> populateMeals(List<MealPlanMeal__c> mealPlanMeals){
            List<Meal> mealsWrapped = new List<Meal>();

            for(MealPlanMeal__c mealPlanMeal: mealPlanMeals) {
                mealsWrapped.add(new Meal(mealPlanMeal, this.id));
            }

            return mealsWrapped;
        }

        private List<Id> getMealsWithMealPlanMeal(Meal_Plan__c mealPlan) {
            List<Id> mealPlansIds = new List<Id>();

            for(MealPlanMeal__c mpm : mealPlan.MealPlanMeals__r) {
                mealPlansIds.add(mpm.Meal__c);
            }

            return mealPlansIds;
        }

        public Meal_Plan__c getSobject() {
            Meal_Plan__c mp = new Meal_Plan__c();

            if(id != null) {
                mp.Id = this.id;
            } else {
                mp.Contact__c = this.contactId;
            }

            mp.Starting_Day__c = this.day;

            return mp;
        }
    }

    public class Meal {
        @AuraEnabled
        public List<Product> products;
        @AuraEnabled
        public List<Id> productIdsToBeRemoved;
        @AuraEnabled
        public Decimal protein;
        @AuraEnabled
        public Decimal carbs;
        @AuraEnabled
        public Decimal fat;
        @AuraEnabled
        public Decimal weight;
        @AuraEnabled
        public Decimal kcal;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Id id;
        @AuraEnabled
        public Id mealPlanId;
        @AuraEnabled
        public Id mealTemplateId;

        public Meal(MealPlanMeal__c meal, Id mealPlanId) {
            this.mealPlanId = mealPlanId;
            this.name = meal.Name;
            this.protein = meal.Protein__c;
            this.carbs = meal.Carbs__c;
            this.fat = meal.Fat__c;
            this.kcal = meal.Kcal__c;
            this.id = meal.Id;
            this.mealTemplateId = meal.Meal__c;

            this.products = populateProducts(meal.MealPlanMealProducts__r);
        }

        public Meal(Meal__c meal, Id mealPlanId) {
            this.mealPlanId = mealPlanId;
            this.name = meal.Name;
            this.protein = meal.Protein__c;
            this.carbs = meal.Carbs__c;
            this.fat = meal.Fat__c;
            this.kcal = meal.Kcal__c;
            this.mealTemplateId = meal.Id;

            this.products = populateProducts(meal.MealProducts__r);
        }

        private List<Product> populateProducts(List<MealPlanMealProduct__c> products) {
            List<Product> productsWrapped = new List<Product>();

            for(MealPlanMealProduct__c product : products) {
                productsWrapped.add(new Product(product, product.MealPlanMeal__c, product.Product__r));
            }

            return productsWrapped;
        }

        private List<Product> populateProducts(List<MealProduct__c> products) {
            List<Product> productsWrapped = new List<Product>();

            for(MealProduct__c product : products) {
                productsWrapped.add(new Product(product, product.Meal__c, product.Product__r));
            }

            return productsWrapped;
        }

        public MealPlanMeal__c getSobject() {
            MealPlanMeal__c meal = new MealPlanMeal__c();

            if(this.id != null) {
                meal.Id = this.id;
            } else {
                meal.Meal_Plan__c = this.mealPlanId;
            }

            meal.Name = this.name;
            meal.Meal__c = this.mealTemplateId;

            return meal;
        }

        public Meal__c getMealSobject() {
            Meal__c meal = new Meal__c();

            if(this.mealTemplateId != null) {
                meal.Id = this.mealTemplateId;
            }

            meal.Name = this.name;

            return meal;
        }
    }

    public class Product {
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Decimal protein;
        @AuraEnabled
        public Decimal carbs;
        @AuraEnabled
        public Decimal fat;
        @AuraEnabled
        public Decimal kcal;
        @AuraEnabled
        public Decimal weight;
        @AuraEnabled
        public Id id;
        @AuraEnabled
        public Id mealId;
        @AuraEnabled
        public Id productId;

        public Product(MealPlanMealProduct__c mpmProduct, Id mealId, Product__c product) {
            this.name = mpmProduct.Product_Name__c;
            this.protein = mpmProduct.Protein__c;
            this.carbs = mpmProduct.Carbs__c;
            this.fat = mpmProduct.Fat__c;
            this.kcal = mpmProduct.Kcal__c;
            this.weight = mpmProduct.Weight__c;
            this.id = mpmProduct.Id;
            this.mealId = mealId;
            this.productId = product.Id;
        }

        public Product(MealProduct__c mealProduct, Id mealId, Product__c product) {
            this.name = mealProduct.Product_Name__c;
            this.protein = product.Protein__c;
            this.carbs = product.Carbs__c;
            this.fat = product.Fat__c;
            this.kcal = product.Kcal__c;
            this.weight = mealProduct.Weight__c;
            this.id = mealProduct.Id;
            this.mealId = mealId;
            this.productId = product.Id;
        }

        public Product(Product__c product) {
            this.name = product.Name;
            this.protein = product.Protein__c;
            this.carbs = product.Carbs__c;
            this.fat = product.Fat__c;
            this.kcal = product.Kcal__c;
            this.productId = product.Id;
        }

        public MealPlanMealProduct__c getSobject() {
            MealPlanMealProduct__c mealProduct = new MealPlanMealProduct__c();

            if(this.id != null) {
                mealProduct.Id = this.id;
            }

            mealProduct.MealPlanMeal__c = this.mealId;
            mealProduct.Product__c = this.productId;
            mealProduct.Weight__c = this.weight;
            return mealProduct;
        }

        public Product__c getSobjectForProduct() {
            Product__c product = new Product__c();
            product.Name = this.name;
            product.Protein__c = this.protein;
            product.Carbs__c = this.carbs;
            product.Fat__c = this.fat;
            product.Kcal__c = this.kcal;
            product.Weight__c = 100;

            if(this.productId != null) {
                product.Id = this.productId;
            }

            return product;
        }
    }
}