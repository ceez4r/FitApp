/**
 * Created by ceezar on 20.06.2017.
 */

public class EmailUtils {

    public static EmailTemplate mergeTemplate(String templateName, List<Map<String, String>> data){
        List<EmailTemplate> templates = [SELECT HtmlValue, Body, Subject FROM EmailTemplate WHERE DeveloperName = :templateName];
        if(templates.isEmpty()){
            return null;
        }
        EmailTemplate emTempl = templates[0];
        emTempl.HtmlValue = mergeRepeat(emTempl.HtmlValue, data);
        emTempl.Body = mergeRepeat(emTempl.Body, data);
        return emTempl;
    }

    private static String mergeRepeat(String body, List<Map<String, String>> records) {
        String patternStr = '(?si)<!REPEAT>(.*)</!REPEAT>';
        Matcher m = Pattern.compile(patternStr).matcher(body);
        String newBody = '';

        while(m.find()) {
            for(Map<String, String> record : records) {
                newBody += mergeFields(m.group(1), record);
            }
            body = body.replace(m.group(1), newBody);
        }
        return body;
    }

    private static String mergeFields(String body, Map<String, String> record){
        String patternStr = '(\\{!([A-Za-z_]+)\\})';
        Matcher m = Pattern.compile(patternStr).matcher(body);

        while(m.find()){
            String merge_field = m.group(1);
            String field = m.group(2);
            String value;

            if(record.containsKey(field)) {
                value = record.get(field);
            }

            if(value != null) {
                body = body.replace(merge_field, value);
            }
        }
        return body;
    }
}