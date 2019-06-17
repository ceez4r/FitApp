/**
 * Created by czeleznick002 on 09.10.2018.
 */
({
    searchProducts: function(cmp) {
        this.showElement(cmp, 'spinner');
        let searchPhrase = cmp.get('v.searchPhrase');
        let spinner = cmp.find('spinner');

        if(!$A.util.isEmpty(searchPhrase)) {
            this.sendComponentEvent(cmp, 'searchProductEvent', {searchPhrase: searchPhrase, spinner: spinner});
        } else {
            this.hideElement(cmp, 'spinner');
        }
    },

    processSearchProductsResult: function(cmp, result) {
        //TODO hideSpinner
    }
})