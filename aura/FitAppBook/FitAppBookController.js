/**
 * Created by czeleznick002 on 08.10.2018.
 */
({
    doInit: function (cmp, event, helper) {
        helper.loadMealPlans(cmp);
    },

    addMealPlan: function(cmp, event, helper) {
        let day = new Date(); //TODO add logic to retrieve proper date from timeline
        helper.addMealPlan(cmp, day); //TODO add logic to clone meals from another mp
    },

    addMeal: function(cmp, event, helper) {
//        helper.addMeal(cmp);
    },

    addNewMeal: function(cmp, event, helper) {
        let mealPlandIndex = event.getParam('mealPlanIndex');
        let mealPlans = cmp.get('v.mealPlans');

        helper.addMeal(mealPlans[mealPlandIndex]);
        cmp.set('v.mealPlans', mealPlans);
    },

    saveMeals: function (cmp, event, helper) {
        helper.saveMeals(cmp);
    },

    saveMeal: function(cmp, event, helper) {
        let meal = event.getParam('meal');
        let mealPlanIndex = event.getParam('mealPlanIndex');
        let mealIndex = event.getParam('mealIndex');

        helper.saveMeal(cmp, meal, mealPlanIndex, mealIndex);
    },

    removeMealPlanMeal: function (cmp, event, helper) {
        let mealPlanMealId = event.getParam('mealPlanMealId');
        let mealPlanIndex = event.getParam('mealPlanIndex');

        helper.removeMealPlanMeal(cmp, mealPlanMealId, mealPlanIndex);
    },

    nextDay: function(cmp, event, helper) {
        helper.movePage(cmp, true);
    },

    previousDay: function(cmp, event, helper) {
        helper.movePage(cmp, false);
    },

    searchProduct: function(cmp, event, helper) {
        let searchPhrase = event.getParam('searchPhrase');
        let spinner = event.getParam('spinner');
        helper.searchProduct(cmp, searchPhrase, spinner);
    },

    handleMessage: function(cmp, event, helper) {
        const message = event.getParam('recordData');
        const eventType = message.payload.ChangeEventHeader.changeType;
        const entityName = message.payload.ChangeEventHeader.entityName;
        const userId = message.payload.ChangeEventHeader.commitUser.substring(0,15);
        const signedInUser= $A.get("$SObjectType.CurrentUser.Id").substring(0,15);
        let mealPlans = cmp.get('v.mealPlans');

        if(eventType !== "CREATE"){
            Array.from(message.payload.ChangeEventHeader.recordIds).forEach( recordId => {
                if(signedInUser !== userId){
                    console.log(`${eventType} event captured on ${entityName} by user id ${userId}`);

                    let updatedMealPlan = mealPlans.find(mealPlan => mealPlan.id === recordIs);
                    console.log('updated meal plan', updatedMealPlan);
                }
             });
        }
    },

    showModal: function(cmp, event, helper) {
        let meal = event.getParam('meal');
        let mealIndex = event.getParam('mealIndex');
        let mealPlanIndex = event.getParam('mealPlanIndex');
        let modal = cmp.find('mealModal');

        cmp.set('v.showModal', true);
        modal.set('v.meal', meal);
        modal.set('v.mealIndex', mealIndex);
        modal.set('v.mealPlanIndex', mealPlanIndex);
    }
})