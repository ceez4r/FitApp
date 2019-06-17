/**
 * Created by czeleznick002 on 09.10.2018.
 */
({
    openEditModal: function(cmp, event, helper) {
        let index = cmp.get('v.index');
        let mealPlanIndex = cmp.get('v.mealPlanIndex');
        let meal = cmp.get('v.meal');
        let mealString = JSON.parse(JSON.stringify(meal));

        helper.sendComponentEvent(cmp, 'showModal', {meal: meal, mealIndex: index, mealPlanIndex: mealPlanIndex});
    },
})