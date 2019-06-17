/*------------------------------------------------------------
Author:        Cezary Zeleznicki
Company:
Description:   InputPicklistHelper.js
History
<Date>      <Authors Name>     <Brief Description of Change>
04.10.2018  Cezary Zeleznicki       creation
------------------------------------------------------------*/
({
    setDefaultOnChangeIfNotSet: function(cmp) {
        var onChange = cmp.get('v.onchange');

        if($A.util.isUndefinedOrNull(onChange)) {
            cmp.set('v.onchange', cmp.getReference('c.defaultOnChange'));
        }
    }
})