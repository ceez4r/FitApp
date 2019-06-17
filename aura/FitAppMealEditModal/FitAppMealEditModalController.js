/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMealEditModalController.js
History
<Date>      <Authors Name>     <Brief Description of Change>
26.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    doInit: function(cmp, event, helper) {
        // helper.addNewProduct(cmp);
    },

    removeProductFromMeal: function(cmp, event, helper) {
        let element = helper.getEventTarget(event);

        helper.removeProduct(cmp, parseInt(element.dataset.index), 'meal.products');
    },

    addProduct: function(cmp, event, helper) {
//        helper.sendComponentEvent(cmp, 'addProduct', {
//            "mealId" : cmp.get('v.meal.id')
//        });
//
//        cmp.set('v.showSearchProducts', true);
        helper.addNewProduct(cmp);
    },

    removeProduct: function(cmp, event, helper) {
        let element = helper.getEventTarget(event);
        helper.removeProduct(cmp, parseInt(element.dataset.index), 'newProducts');
    },

    saveMeal: function(cmp, event, helper) {
        let meal = cmp.get('v.meal');
        let idFormValid = helper.validateAllInputs(cmp, 'mealForm');

        if(!idFormValid) {
            return;
        }

        if(meal.toClone) {
            delete meal.toClone;
            meal.id = null;
        }

        let newProducts = cmp.get('v.newProducts');
        let mealIndex = cmp.get('v.mealIndex');
        let mealPlanIndex = cmp.get('v.mealPlanIndex');
        meal.products = meal.products.concat(newProducts);
        cmp.set('v.newProducts', []);

        helper.sendComponentEvent(cmp, 'saveMeal', {meal: meal, mealIndex: mealIndex, mealPlanIndex: mealPlanIndex});

        cmp.set('v.products', []);
        cmp.set('v.showModal', false);
    },

    selectProduct: function(cmp, event, helper) {
        let product = event.getParam('product');

        helper.selectProduct(cmp, product);
    },

    addWeight: function(cmp, event, helper) {
//        let type = event.type;

//         if (type === 'mouseup' && helper.timer){
//            clearTimeout(timer);
//            return;
//        }

        helper.modifyWeight(cmp, event, true);

//        if(type === 'mousedown') {
//            helper.timer = setTimeout($A.getCallback(helper.modifyWeight(cmp, event, true, true)), 2000);
//        }
    },

    removeWeight: function(cmp, event, helper) {
        helper.modifyWeight(cmp, event, false);
    }
})