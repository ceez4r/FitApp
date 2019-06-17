/**
 * Created by czeleznick002 on 08.10.2018.
 */
({
    doClose: function (component, event, helper) {
        helper.closeDialog(component);
    },
    handleBackgroundClick: function (component, event, helper) {
        if(component.get('v.backgroundCloseAllowed') !== true || ! helper.isTargetDivAndContainsBackgroundClass(event.target)){
            return;
        }

        var modalBody = component.find('modal-body');
        var coords = modalBody.getElement().getBoundingClientRect();

        if (event.clientX < coords.left || event.clientX > coords.right || event.clientY < coords.top || event.clientY > coords.bottom) {
            helper.closeDialog(component);
        }
    },
})