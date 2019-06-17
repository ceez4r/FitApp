/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   FitAppMealEditModalHelper.js
History
<Date>      <Authors Name>     <Brief Description of Change>
26.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    timer:{},
    removeProductById: function (cmp, productIdToRemove) {
        let products = cmp.get('v.meal.products');

        let productToRemoveIdx = products.findIndex(product => product.id = productIdToRemove);

        if(productIdToRemove !== -1) {
            products.splice(productToRemoveIdx);
        }
    },

    addNewProduct: function(cmp) {
        var newProducts = cmp.get('v.newProducts');

        newProducts.push({
            name: '',
            protein: 0,
            carbs: 0,
            fat: 0,
            kcal: 0,
            weight: 100
        });

        cmp.set('v.newProducts', newProducts);
    },

    removeProduct: function(cmp, index, listName) {
        let products = cmp.get('v.' + listName);

        if(!$A.util.isEmpty(products[index].id)) {
            let productIdsToBeRemoved = cmp.get('v.meal.productIdsToBeRemoved') || [];
            productIdsToBeRemoved.push(products[index].id);
            cmp.set('v.meal.productIdsToBeRemoved', productIdsToBeRemoved);
        }

        products.splice(index, 1);

        cmp.set('v.' + listName, products);

        let meal = cmp.get('v.meal');
        this.calculateMacroElements(cmp, meal);
        cmp.set('v.meal', meal);
    },

    selectProduct: function(cmp, product) {
        let meal = cmp.get('v.meal');

        meal.products.push(product);

        this.calculateMacroElements(cmp, meal);

        cmp.set('v.meal', meal);
    },

    calculateMacroElements: function (cmp, meal) {
        let products = meal.products;
        const defaultProductWeight = cmp.get('v.DEFAULT_PRODUCT_WEIGHT');
        let proteins = 0;
        let carbs = 0;
        let fat = 0;
        let kcal = 0;

        products.forEach(function(product) {
            proteins += (product.protein / defaultProductWeight) * product.weight;
            carbs += (product.carbs / defaultProductWeight) * product.weight;
            fat += (product.fat / defaultProductWeight) * product.weight;
            kcal += (product.kcal / defaultProductWeight) * product.weight;
        });

        meal.protein = proteins
        meal.carbs = carbs;
        meal.fat = fat;
        meal.kcal = kcal;
    },

    modifyWeight: function(cmp, event, isAddition, isLong) {
        let element = this.getEventTarget(event);
        let index = parseInt(element.dataset.index);

        let meal = cmp.get('v.meal');
        let weight = parseFloat(meal.products[index].weight) + (isAddition ? 5 : -5);
        meal.products[index].weight = weight;

        this.calculateMacroElements(cmp, meal);

        cmp.set('v.meal', meal);
    }
})