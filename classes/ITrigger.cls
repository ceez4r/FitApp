/**
 * Created by ceezar on 19.06.2017.
 */

public interface ITrigger {

    void beforeInsert(List<sObject> sos);

    void beforeUpdate(List<sObject> sos, List<sObject> oldSos);

    void afterInsert(List<sObject> sos);

    void afterUpdate(List<sObject> sos, List<sObject> oldSos);
}