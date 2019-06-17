/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   CommonComponentHelper.js
History
<Date>      <Authors Name>     <Brief Description of Change>
16.03.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    services: {},

    callServer: function (cmp, actionName, parameters, onSuccess, onError, isStorable, isAbortable, isBackground){
        var action = cmp.get(actionName);
        if(parameters){
            action.setParams(parameters);
        }
        if(isAbortable){
            action.setAbortable();
        }
        if(isStorable){
            action.setStorable();
        }
        if(isBackground){
            action.setBackground();
        }
        action.setCallback(this, function(response){
            if(response){
                var state = response.getState();
                if(cmp.isValid()){
                    if (state === "SUCCESS"){
                        var result = response.getReturnValue();
                        onSuccess(result);
                    } else if(state == "ERROR"){
                        var errors = response.getError();
                        if(!onError){
                            this.handleError(cmp, errors);
                        } else {
                            onError(errors);
                        }
                    }
                }
            } else {
                onSuccess();
            }
        });
        $A.enqueueAction(action);
    },

    showToast : function(type, title, message, cmp, mode) {
        var toastMode = 'sticky';

        if(mode) {
            toastMode = mode;
        }

        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent) {
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,
                "duration": 10000,
                "mode": toastMode
            });
            toastEvent.fire();
        } else if(type === 'error' && !$A.util.isUndefined(cmp.get('v.errorMessage'))) {
            cmp.set('v.errorMessage', message);
        }
    },

    hideElement: function (cmp, elementId) {
        var elm = cmp.find(elementId);
        $A.util.addClass(elm, 'slds-hide');
    },

    hideOwnElement: function(element) {
        $A.util.addClass(element, 'slds-hide');
    },

    showElement: function (cmp, elementId) {
        var elm = cmp.find(elementId);
        $A.util.removeClass(elm, 'slds-hide');
    },

    showOwnElement: function(element) {
        $A.util.removeClass(element, 'slds-hide');
    },

    clone: function (sourceElm, targetElm) {
        if(targetElm){
            for(var k in targetElm){
                targetElm[k]=undefined;
            }
        }
        for(var k in sourceElm){
            targetElm[k]=sourceElm[k];
        }
    },

    deepClone: function (sourceElm, targetElm) {
        var clone = JSON.parse(JSON.stringify(sourceElm));
        this.clone(clone, targetElm);
    },

    refreshView: function(){
        var refreshEvent = $A.get('e.force:refreshView');
        if(refreshEvent){
            refreshEvent.fire();
        }
    },

    handleError: function(cmp, errors, spinner){
        if(errors) {
            if(console){
                console.log('errors',errors);
            }
            this.showToast('error', 'Error', errors[0].message || errors[0].pageErrors[0].message);
        }

        if(spinner) {
            this.hideOwnElement(spinner);
        } else if(!$A.util.isUndefinedOrNull(cmp.find('spinner'))) {
            this.hideElement(cmp, 'spinner');
        }
    },

    navigateToURL : function(url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },

    openUrlInNewTab: function(url, closingEvent, isExternal) {
        var newWin = window.open(url, '_blank');

        if(closingEvent) {
            if(isExternal) {
                setTimeout(function checkIfClosed(){
                    if(newWin.closed === true) {
//                        $A.getCallback(closingEvent);
                        closingEvent();
                    } else {
                        setTimeout(checkIfClosed, 1000);
                    }

                }, 1000);
            } else {
                newWin.addEventListener('beforeunload', closingEvent);
            }
        }

        if(!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            alert('Popup Blocker is enabled! Please add this site to your exception list.')
        }
    },

    generateUniqueId: function () {
        return (this.s4() + this.s4() + "-" + this.s4() + "-4" + this.s4().substr(0, 3) + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4()).toLowerCase();
    },

    s4: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    validateAllInputs: function(cmp, formId, radioGroupIds) {
        var allInputs = cmp.find(formId).find({instancesOf: "lightning:input"});
        var allSelects = cmp.find(formId).find({instancesOf: "lightning:select"});
        var allRadios = cmp.find(formId).find({instancesOf: "lightning:radioGroup"});
        var allTextAreas = cmp.find(formId).find({instancesOf: "lightning:textarea"});
        var allInputLookups = cmp.find(formId).find({instancesOf: "c:COM_InputLookup"});
        var inputsToVerify = [];

        if(radioGroupIds && radioGroupIds.length > 0) {
            radioGroupIds.forEach(function(id) {
                allRadios.push(cmp.find(id));
            });
        }

        if(!$A.util.isEmpty(allInputs)) {
            inputsToVerify = inputsToVerify.concat(allInputs);
        }

        if(!$A.util.isEmpty(allSelects)) {
            inputsToVerify = inputsToVerify.concat(allSelects);
        }

        if(!$A.util.isEmpty(allRadios)) {
            inputsToVerify = inputsToVerify.concat(allRadios);
        }

        if(!$A.util.isEmpty(allTextAreas)) {
            inputsToVerify = inputsToVerify.concat(allTextAreas);
        }

        if(!$A.util.isEmpty(allInputLookups)) {
            inputsToVerify = inputsToVerify.concat(allInputLookups);
        }

        var allValid = inputsToVerify.reduce(function (validFields, inputCmp) {
            var valid = true;

            if(inputCmp.isValid() && typeof inputCmp.showHelpMessageIfInvalid === 'function') {
                inputCmp.showHelpMessageIfInvalid();
                valid = inputCmp.get('v.validity').valid;
            }

            return validFields && valid;
        }, true);

        if (allValid) {
            return(true);
        }
        return(false);
    },

    validateAllInputsNew: function(cmp, formId, fieldsToSkip) {
        var helper = this;
        var inputs = cmp.find(formId);
        if(!$A.util.isArray(inputs)) {
            inputs = inputs.get('v.body');
        }

        var allElements = this.flattenComponents(inputs);

        var allValid = allElements.reduce(function (validFields, inputCmp) {
            var valid = true;

            if(inputCmp.isValid() && helper.isInputComponent(inputCmp) && typeof inputCmp.showHelpMessageIfInvalid === 'function' &&
                !$A.util.isUndefinedOrNull(inputCmp.get('v.validity'))) {
                if(!$A.util.isEmpty(fieldsToSkip) && fieldsToSkip.includes(inputCmp.getLocalId())) {
                    return validFields;
                }

                inputCmp.showHelpMessageIfInvalid();
                valid = inputCmp.get('v.validity').valid;
            }

            return validFields && valid;
        }, true);

        if (allValid) {
            return(true);
        }
        return(false);
    },

    isInputComponent: function (cmp) {
        var inputs = [
            "lightning:input",
            "lightning:select",
            "lightning:radioGroup",
            "lightning:textarea",
            "c:InputPicklist",
            "lightning:checkboxGroup"
        ];

        return !$A.util.isUndefinedOrNull(inputs.find(function(element) {
            return cmp.isInstanceOf(element);
        }));
    },

    createRecord: function (objectType) {
        return {
            attributes: {
                type: objectType,
                url: '/services/data/v42.0/sobjects/' + objectType
            }
        }
    },

    flattenComponents: function(arr) {
        var helper = this;
        return arr.reduce(function (flat, toFlatten) {
            var body = toFlatten.get('v.body');
            return flat.concat($A.util.isArray(body) && body.length > 0 ? helper.flattenComponents(body) : helper.flattenBody(toFlatten));
        }, []);
    },

    flattenBody: function(cmp, arr) {
        if($A.util.isUndefinedOrNull(arr)) {
            arr = [];
        }

        var body = cmp.get('v.body');
        if(!$A.util.isUndefinedOrNull(body) && body.length > 0) {
            if($A.util.isArray(body)) {
                return arr.concat(this.flattenComponents(body));
            } else {
                return arr.concat(this.flattenBody(body, arr));
            }
        }

        return arr.concat(cmp);
    },

    addLeadingZero: function(event, callback) {
        var inputVal = parseInt(event.getSource().get('v.value'));

        if(isNaN(inputVal)) {
            return;
        }

        if(inputVal < 10) {
            event.getSource().set('v.value', '0' + inputVal);
        }

        if(callback) {
            callback();
        }
    },

    addLeadingZeroToField: function(field) {
        if($A.util.isUndefinedOrNull(field)) {
            return;
        }

        if(field < 10) {
            field = '0' + field;
        }

        return field;
    },

    addLeadingZeroToObjectField: function(obj, fieldName) {
        if($A.util.isUndefinedOrNull(obj[fieldName])) {
            return;
        }

        var fieldVal = parseInt(obj[fieldName]);

        if(fieldVal < 10) {
            obj[fieldName] = '0' + fieldVal;
        }
    },

    limitCharNumber: function (event) {
        var inputVal = event.getSource().get('v.value');
        var maxLength = event.getSource().get('v.maxlength');
        if(!maxLength){
            return;
        }
        if(inputVal.toString().length > maxLength) {
            inputVal = inputVal.substring(0, maxLength);
            event.getSource().set('v.value', inputVal);
        }
    },

    getEventTarget: function(event) {
        return (event.currentTarget) ? event.currentTarget : event.srcElement;
    },

    getFirstElementIfArray: function(element) {
        if($A.util.isArray(element)) {
            return element[0];
        } else {
            return element;
        }
    },

    isNumeric: function(num){
        return !isNaN(num)
    },

    isValidDate: function(d) {
        return d instanceof Date && !isNaN(d);
    },

    serviceExists: function(serviceName) {
        return this.services.hasOwnProperty(serviceName) && !$A.util.isUndefinedOrNull(this.services[serviceName]);
    },

    createService: function(cmp, serviceName, callback) {
        this.services[serviceName] = null;

        $A.createComponent(
            'c:' + serviceName,
            {},
            this.createServiceCallback.bind(null, cmp, this, callback)
        );
    },

    createServiceCallback: function(cmp, helper, callback, newCmp) {
        var componentName = newCmp.getName().substr(1);
        helper.services[componentName] = newCmp;
        callback(newCmp);
    },


    checkIfValueChanged: function(event, verifyObject) {
        var value = event.getParam('value');
        var oldValue = event.getParam('oldValue');
        var index = event.getParam('index');

        if(verifyObject && !$A.util.isUndefinedOrNull(value) && !$A.util.isUndefinedOrNull(index)) {
            value = value[index];
        }

        if(verifyObject && !$A.util.isUndefinedOrNull(oldValue) && !$A.util.isUndefinedOrNull(index)) {
            oldValue = oldValue[index];
        }

        return value !== oldValue;
    },

    functionAsPromise : function(component, helperFunction) {
        return new Promise($A.getCallback(function(resolve, reject) {
            helperFunction(component, resolve, reject);
        }));
    },

    convertToBoolean: function(event) {
        var field = event.getSource();
        field.set('v.value', $A.util.getBooleanValue(field.get('v.value')));
    },

    isBoolean: function(variable) {
        return typeof(variable) == typeof(true);
    },

    sendComponentEvent: function(cmp, eventName, params) {
        let cmpEvent = cmp.getEvent(eventName);
        cmpEvent.setParams(params);
        cmpEvent.fire();
    },

    consoleLog: function(elementToLog) {
        if(console) {
            console.log(JSON.parse(JSON.stringify(elementToLog)));
        }
    },

    getDayOfWeek: function(date) {
        if($A.util.isUndefinedOrNull(date)) {
            return '';
        }

        let dateObj = new Date(date);
        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
//        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        let day = days[ dateObj.getDay() ];
//        var month = months[ now.getMonth() ];

        return day;
    }
})