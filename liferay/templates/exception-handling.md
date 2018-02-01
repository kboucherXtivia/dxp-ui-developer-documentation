# Exception Handling

Use FreeMarker's `attempt/recover` block to gracefully handle template exceptions:

```
<#attempt>
    <#assign is_full_width = page.getExpandoBridge().getAttribute("is-full-width-layout") />
<#recover>
    <p>
        This template requires a boolean page-level custom field named "full-width-layout." See
        excellus-bcbs-theme/README.md for more information.
    </p>
    <#assign is_full_width = false>
</#attempt>
```
