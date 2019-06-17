/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppSearchMealHelper.js
History
<Date>      <Authors Name>     <Brief Description of Change>
07/12/2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    loadMeal: function(cmp) {
        let mealTemplate = cmp.get('v.mealTemplate');

        let params = {
            mealId: mealTemplate.id
        };

        this.callServer(cmp, 'c.loadMealAura', params,
            this.processMealResults.bind(this, cmp)
        );
    },

    processMealResults: function(cmp, results) {
        results.toClone = true;
//        this.clearMealProductIds(results.products);
        cmp.set('v.meal', results);
    },

    clearMealProductIds: function(mealProducts) {
        mealProducts.forEach(mealProduct => mealProduct.id = null);
    }
})