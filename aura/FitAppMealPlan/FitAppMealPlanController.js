/**
 * Created by czeleznick002 on 09.10.2018.
 */
({
    showSearchProductsModal: function(cmp, event, helper) {
        let mealId = event.getParam('mealId');
        cmp.set('v.mealIdInEdit', mealId);
    },

    selectProduct: function(cmp, event, helper) {
        helper.selectProduct(cmp);
    },

    addNewMeal: function (cmp, event, helper) {
        let mealPlanIndex = cmp.get('v.index');

        helper.sendComponentEvent(cmp, 'addNewMeal', {mealPlanIndex: mealPlanIndex});
    },

    removeMeal: function (cmp, event, helper) {
        let mealIndex = helper.getEventTarget(event).dataset.index;

        helper.removeMeal(cmp, mealIndex);
    }
})