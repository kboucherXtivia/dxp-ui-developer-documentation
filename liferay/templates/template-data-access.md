# Accessing Data in Web Content Article and Asset Display Templates

## Null Checking

To omit elements when a data item is null use `??`:
```
<#if SectionImage??>
    <img src="${SectionImage.getData()}" class="post-img">
</#if>
```

## Conditional Output

To omit elements when a data item has no content use the `has_content` property (combines null checking from above with `has_content`):
```
<#if SectionImage?? && SectionImage.data?has_content>
    <img src="${SectionImage.getData()}" class="post-img">
</#if>
```

## Data Types

### Boolean

Though, structures allow you to define a `boolean` type field, the value that is passed to the template is actually a string. Two ways to handle this situation are:

1. Compare to string value:

```
<#if HorizontalRule.data == "true">
    ...
</#if>
```
2. Use `getterUtil`:

```
<#if getterUtil.getBoolean(HorizontalRule.data)>
    ...
</#if>
```
Using `getterUtil.getBoolean()` method will convert the value to `boolean` type for conditional comparison.

### Link to Page
```
LinkToPage.getFriendlyUrl()
```

### Separators

When grouping fields into a `Separator` you can reference the children as expected:
```
<a href="${SectionButton.URL.data}" class="btn btn-default big-btn btnAtag">
    ${SectionButton.Label.data}
</a>
```

### Repeatables

To loop over defined items marked as `Repeatable: Yes` in your structure, use the `getSiblings()` method:
```
<#list RepeatableItem.getSiblings() as cur_Item>
    <h2>${cur_Item.Title.data}</h2>
    <p>${cur_Item.Body.data}</p>
</#list>
```

[comment]: # (This is a commented addition to invoke a change for merge request test)

### Web Content

To access web content type fields you will need to import the `JournalArticleLocalService`. Where `WebContent` is the name of the web content field in your structure:
```
<#assign JournalArticleLocalService = serviceLocator.findService("com.liferay.journal.service.JournalArticleLocalService")>

<#if WebContent.getSiblings()?has_content>
    <#list WebContent.getSiblings() as cur_webContent>
        <#assign cur_webContent_map = cur_webContent.getData()?eval>
        <#assign cur_webContent_classPK = cur_webContent_map.classPK>

        <#--  Get the article  -->
        <#assign article = JournalArticleLocalService.getLatestArticle(cur_webContent_classPK?number)>

        <#--  Get the article ID -->
        <#assign article_id = article.articleId>
    </#list>
</#if>

<#-- Article (with template) is rendered here: -->
<div>
    <#assign VOID = freeMarkerPortletPreferences.setValue("portletSetupPortletDecoratorId", "barebone") />
    <#assign VOID = freeMarkerPortletPreferences.setValue("articleId", "${article_id}" ) />
    <@liferay_portlet["runtime"]
            defaultPreferences      = "${freeMarkerPortletPreferences}"
            portletProviderAction   = portletProviderAction.VIEW
            instanceId              = "${article_id}"
            portletName             = "com_liferay_journal_content_web_portlet_JournalContentPortlet" />
            ${freeMarkerPortletPreferences.reset()}
</div>
```

## Getting Content IDs

### In Web Content Templates
```
.vars["reserved-article-id"].data
```

## Getting Page Categories
```
<#assign CategoryLocalService = serviceLocator.findService("com.liferay.asset.kernel.service.AssetCategoryLocalService") />
<#assign page = themeDisplay.getLayout() />
<#assign primKey = page.getPrimaryKey() />
<#assign pageCats = CategoryLocalService.getCategories("com.liferay.portal.kernel.model.Layout", primKey) />
${pageCats?size}
```
