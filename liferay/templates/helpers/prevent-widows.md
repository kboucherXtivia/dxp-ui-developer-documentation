# Prevent Widows

Prevents widows in HTML content by wrapping the last two words of string in a span that can have `white-space: nowrap;` applied to it. Alternately can be used in conjunction with a trailing icon element, in which case the `nowrap` span will be wrapped around the last word and the passed-in icon element.

_Note: Default `nowrap` class is Bootstrap's "text-nowrap" class: [https://getbootstrap.com/docs/3.3/css/#type-alignment](https://getbootstrap.com/docs/3.3/css/#type-alignment). To override this class, pass the desired class name as a parameter._

## Example Usage
`<@preventWidows text="Link to my web page" icon='<i class="icon icon-chevron-right"></i>' />`

Outputs: `Link to my web <span class="text-nowrap">page <i class="icon icon-chevron-right"></i></span>`

### Code

Copy this into your template, or add to your helpers template.
```
<#macro preventWidows text icon="" class="text-nowrap">
    <#compress>
        <#local isIcon = icon != "">
        <#local textSplit = text?split(" ")>
        <#local textCount = textSplit?size>
        <#local textPost = "">
        <#local textPre = "">

        <#--
            If there is an icon, split the last word of the text
            from the rest, if not, split the last two words.
        -->
        <#if isIcon || textCount < 2>
            <#local textPre = textSplit[0..<textCount - 1]?join(" ")>
            <#local textPost = textSplit?last>
        <#else>
            <#local textPre = textSplit[0..<textCount - 2]?join(" ")>
            <#local textPost = textSplit[textCount - 2..<textCount]?join(" ")>
        </#if>

        ${textPre?trim}
        <span class="${class}">
            ${textPost?trim}
            <#if isIcon>
                ${icon}
            </#if>
        </span>
    </#compress>
</#macro>
```
