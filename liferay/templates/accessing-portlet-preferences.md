# Accessing Portlet Preferences

First, get the PortletDisplay and PortletPreferences object:
```
<#assign portletDisplay = themeDisplay.getPortletDisplay() />
<#assign portletSetup = portletDisplay.getPortletSetup() />
```

## Getting the Custom Title (Configured in _Look & Feel Configuration_)
Is _Use Custom Title_ on?
```
<#-- returns a truthy/falsy string rather than a boolean -->
<#assign useCustomTitle = portletSetup.getValue("portletSetupUseCustomTitle", "false") />
```
If so, then get the Custom Title:
```
<#if useCustomTitle == "true">
    <#assign portletId = portletDisplay.getId() />
    <#assign portletCustomTitle = portletDisplay.getTitle() />
    <#assign portletCustomTitle = portletSetup.getValue("portletSetupTitle_" + themeDisplay.getLanguageId(), portletCustomTitle) />

    <h2>${portletCustomTitle}</h2>
</#if>
```

## Getting a List (HashMap) of Preferences:
```
<#assign preferences = portletSetup.getMap() />

<#list preferences?keys as k>
  ${k}<br>
</#list>
```
