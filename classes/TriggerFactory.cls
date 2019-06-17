/**
 * Created by ceezar on 19.06.2017.
 */

public with sharing class TriggerFactory {
    public class TriggerException extends Exception {}

    public static void createHandler(Schema.sObjectType soType) {
        ITrigger handler = getHandler(soType);

        if(handler == null) {
            throw new TriggerException('No Trigger Handler registered for Object Type: ' + soType);
        }

        execute(handler);
    }

    private static ITrigger getHandler(Schema.sObjectType soType) {
        if(soType == Account.sObjectType) {
            return new AccountTriggerHandler();
        }

        if(soType == Notification_Message__c.sObjectType) {
            return new MessagesTriggerHandler();
        }

        if(soType == MealProduct__c.sObjectType) {
            return new MealProductTriggerHelper();
        }

        if(soType == User.sObjectType) {
            return new UserTriggerHelper();
        }
//
//        if(soType == MealPlanMeal__c.sObjectType) {
//            return new MealPlanMealTriggerHelper();
//        }

        if(soType == MealPlanMealProduct__c.sObjectType) {
            return new MealPlanMealProductTriggerHelper();
        }

        return null;
    }

    private static void execute(ITrigger handler) {
        if(Trigger.isBefore) {
            if(Trigger.isInsert) {
                handler.beforeInsert(Trigger.new);
            }
            else if(Trigger.isUpdate) {
                handler.beforeUpdate(Trigger.new, Trigger.old);
            }
        }
        else {
            if(Trigger.isInsert) {
                handler.afterInsert(Trigger.new);
            }
            else if(Trigger.isUpdate) {
                handler.afterUpdate(Trigger.new, Trigger.old);
            }
        }
    }
}