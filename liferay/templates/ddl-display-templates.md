# Dynamic Data List Display Templates

This is an incomplete article designed to capture a known working implementation of a DDL Display Template in Liferay DXP.

Additional information can be found in the Liferay Knowledge Base: [USING TEMPLATES TO DISPLAY FORMS AND LISTS](https://dev.liferay.com/discover/portal/-/knowledge_base/7-0/using-templates-to-display-forms-and-lists).

## Template Data Access

DDL templates use the `DDLRecordLocalService` and `ddlDisplayTemplateHelper` to access records in a Dynamic Data List:

```
<#assign DDLRecordLocalService = serviceLocator.findService("com.liferay.dynamic.data.lists.service.DDLRecordLocalService")>
<#assign records = ddlDisplayTemplateHelper.getRecords(reserved_record_set_id)>
```

## Displaying Record Data

Looping through the records and displaying fields makes use of the `ddlDisplayTemplateHelper.renderRecordFieldValue` and `DDLRecord.getDDMFormFieldValues` methods.

```
<#if records?has_content>
    <#list records as cur_record>
        <#assign region_name = ddlDisplayTemplateHelper.renderRecordFieldValue(cur_record.getDDMFormFieldValues("RegionName")?first, locale)>
        <#assign locales = cur_record.getDDMFormFieldValues("Locale")> <#-- This is a repeatable field -->
        <div class="areas-group">
            <h2>
                ${region_name}:
            </h2>
            <div class="areas-list-container">
                <#if locales?has_content>
                    <ul class="areas__list">
                        <#list locales as cur_locale>
                            <#assign cur_locale_name = ddlDisplayTemplateHelper.renderRecordFieldValue(cur_locale, locale)>
                            <li class="areas__item">
                                ${cur_locale_name}
                            </li>
                        </#list>
                    </ul>
                </#if>
            </div>
        </div>
    </#list>
</#if>
```
