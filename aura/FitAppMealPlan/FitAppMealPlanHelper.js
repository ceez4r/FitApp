/**
 * Created by czeleznick002 on 09.10.2018.
 */
({
    selectProduct: function (cmp) {
        cmp.set('v.showSearchProductModal', false);
        let product = event.getParam('product');
        let mealId = cmp.get('v.mealIdInEdit');
        let mealPlan = cmp.get('v.mealPlan');

        let mealIdx = mealPlan.meals.findIndex(meal => meal.Id === mealdId);

        if(mealIdx === -1) {
            return;
        }

        let mealInEdit = mealPlan.meals[mealIdx];

        mealInEdit.products.push(product);

        this.sendComponentEvent(cmp, 'saveMeal', {"meal": mealInEdit});
    },

    removeMeal: function (cmp, mealIndex) {
        let mealPlan = cmp.get('v.mealPlan');
        let mealPlanIndex = cmp.get('v.index');

        let meal = mealPlan.meals[mealIndex];

        mealPlan.meals.splice(mealIndex, 1);

        if(!$A.util.isEmpty(meal.mealPlanMealId)) {
            this.sendComponentEvent(cmp, 'removeMealPlanMeal', {mealPlanMealId: meal.mealPlanMealId, mealPlanIndex: mealPlanIndex});
        } else {
            cmp.set('v.mealPlan', mealPlan);
        }
    }
})