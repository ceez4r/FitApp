/**
 * Created by czeleznick002 on 08.10.2018.
 */
({
    selectProduct: function(cmp, event, helper) {
        let source = event.getSource();
        let productIndex = source.get('v.value');
        let products = cmp.get('v.products');

        source.set('v.selected', true);
        // let element = $A.getComponent(document.getElementById("product-container-" + productIndex));
        // let parentBody = element.get('v.body')[0];
        // let concreteElement = $A.getComponent(elId);
        // let cmpProduct = concreteElement.find('productContainer');
        // let productCmp = element.getElement();
        // let prodCmpId = productCmp.getLocalId();
        let productCmp = cmp.find('productContainer')[productIndex];
        let isValid = true;
        if(!$A.util.isUndefinedOrNull(productCmp)) {
            isValid = productCmp.validate();
        }

        if(isValid) {
            helper.sendComponentEvent(cmp, 'selectProduct', {"product" : products[productIndex]});
        }
    },

    searchProducts: function(cmp, event, helper) {
        helper.searchProducts(cmp);
    },

    hideSpinner: function(cmp, event, helper) {
        helper.hideElement(cmp, 'spinner');
    },

    keyCheck : function(cmp, event, helper){
        if (event.which == 13){
            helper.searchProducts(cmp);
        }
    }
})