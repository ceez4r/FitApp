/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppSearchMealController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
07/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    doInit: function(cmp, event, helper) {
        let meal = cmp.get('v.meal');

        if($A.util.isUndefinedOrNull(meal)) {
            return;
        }

        cmp.set('v.mealTemplate', {id: meal.mealTemplateId, name: meal.name});
    },

    loadMeal: function(cmp, event, helper) {
        const mealTemplate = cmp.get('v.mealTemplate');

        if(!$A.util.isUndefinedOrNull(mealTemplate.id)) {
            helper.loadMeal(cmp);
        }
    }
})