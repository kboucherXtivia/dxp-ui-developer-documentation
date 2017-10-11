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

### Separators

When grouping fields into a `Separator` you can reference the children as expected:
```
<a href="${SectionButton.URL.data}" class="btn btn-default big-btn btnAtag">
    ${SectionButton.Label.data}
</a>
```