/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppSearchMealCtrl
History
<Date>      <Authors Name>     <Brief Description of Change>
07/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/

public with sharing class FitAppSearchMealCtrl {
    private static final FitAppBookService service = new FitAppBookService();

    @AuraEnabled
    public static FitAppBookService.Meal loadMealAura(String mealId) {

        return service.getSingleMealFromDb(mealId);
    }
}