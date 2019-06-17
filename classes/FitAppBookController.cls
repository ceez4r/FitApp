/**
 * Created by czeleznick002 on 03.10.2018.
 */

public with sharing class FitAppBookController {
    private static final FitAppBookService service = new FitAppBookService();

    @AuraEnabled
    public static List<FitAppBookService.MealPlan> getMealPlansAura(String mealPlanId) {
        return service.getMealPlans(mealPlanId);
    }

    @AuraEnabled
    public static void saveMealPlansAura(String mealPlansJson) {
        if(String.isEmpty(mealPlansJson)) {
            throw new AuraHandledException(Label.SomethingWentWrong_Error); //TODO use label
        }

        List<FitAppBookService.MealPlan> mealPlans = (List<FitAppBookService.MealPlan>) JSON.deserialize(
                mealPlansJson, List<FitAppBookService.MealPlan>.class
        );

        service.saveMealPlans(mealPlans);
    }

    @AuraEnabled
    public static FitAppBookService.MealPlan saveMealPlanAura(String mealPlanJson) {
        if(String.isEmpty(mealPlanJson)) {
            throw new AuraHandledException(Label.SomethingWentWrong_Error); //TODO use label
        }

        FitAppBookService.MealPlan mealPlan = (FitAppBookService.MealPlan) JSON.deserialize(
            mealPlanJson, FitAppBookService.MealPlan.class
        );

        return service.saveMealPlan(mealPlan);
    }

    @AuraEnabled
    public static FitAppBookService.Meal saveMealAura(String mealJson, String mealPlanJson) {
        if(String.isEmpty(mealJson)) {
            throw new AuraHandledException(Label.SomethingWentWrong_Error); //TODO use label
        }

        FitAppBookService.Meal meal = (FitAppBookService.Meal) JSON.deserialize(
            mealJson, FitAppBookService.Meal.class
        );

        FitAppBookService.MealPlan mealPlan = (FitAppBookService.MealPlan) JSON.deserialize(
                mealPlanJson, FitAppBookService.MealPlan.class
        );

        return service.saveMeal(meal, mealPlan);
    }

    @AuraEnabled
    public static List<FitAppBookService.Product> getProductsAura(String searchPhrase) {
        return service.getProducts(searchPhrase);
    }
}