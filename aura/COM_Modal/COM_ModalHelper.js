/**
 * Created by czeleznick002 on 08.10.2018.
 */
({
    closeDialog: function (component) {
        component.set('v.isOpen', false);
    },

    isTargetDivAndContainsBackgroundClass: function (target) {
        return target.nodeName === 'DIV' && ($A.util.hasClass(target, 'slds-modal') || $A.util.hasClass(target, 'slds-modal__container'));
    },
})