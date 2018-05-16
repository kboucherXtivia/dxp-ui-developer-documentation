/*
    Updates URL environment segments in page links (anchor hrefs)

    1. Determines the current environment by parsing location.hostname.
    2. Selects a list of links with absolute URIs or network-path references:
       (`a[href^="http"], a[href^="//"]`).
    3. Iterates over the list of links and takes action only on items that
       contain _excellusbcbs.com_ or _univerahealthcare.com_ in the `href`
       attribute.
        a. If environment is production, removes the environment segment
        b. If downstream environment, adds or updates environmnet segment to
           match the current environment.
        c. Also adds/updates/removes port numbers based on window.location.port

    Supported domain names and environment segments are located in the `domains`
    and `environments` arrays. (Note: Does not support _localhost_ without the
    accompanying domain name.)
 */

(function() {
    const url = window.location;

    const domains = ['excellusbcbs.com', 'univerahealthcare.com'];
    const environments = ['athg', 'intg', 'intg2', 'localhost', 'qa', 'sys'];
    const domainRegEx = new RegExp(
        domains.map(domain => `(${domain})`.replace(/\./gi, '\\.')).join('|'),
        'i',
    );
    const envRegEx = new RegExp(
        `\\b(?:${environments.map(env => `${env}\\.`).join('|')})`,
        'i',
    );
    const portRegEx = new RegExp('(:\\d{2,5})', 'i');

    function getEnvironment(host) {
        const match = host.match(envRegEx);

        if (match) {
            return match[0];
        }

        return 'production';
    }

    function getQuerystring(href) {
        const segments = href.split('?');

        return segments.length > 1 ? `?${segments.slice(1).join('')}` : '';
    }

    function hasEnvironment(href) {
        return envRegEx.test(href);
    }

    function hasPortNumber(href) {
        return portRegEx.test(href);
    }

    function isDomainSupported(href) {
        return domainRegEx.test(href);
    }

    function handlePort(href) {
        const hrefHasPort = hasPortNumber(href);

        if (url.port && hrefHasPort) {
            // Replace port
            return href.replace(portRegEx, `:${url.port}`);
        } else if (url.port) {
            // Add port
            return href.replace(domainRegEx, `$&:${url.port}`);
        } else if (hrefHasPort) {
            // Remove port
            return href.replace(portRegEx, '');
        }

        return href;
    }

    function addUpdateEnvironment(href, env) {
        if (hasEnvironment(href)) {
            return handlePort(href).replace(envRegEx, env);
        }

        return handlePort(href).replace(domainRegEx, `${env}$&`);
    }

    function removeEnvironment(href) {
        return handlePort(href).replace(envRegEx, '');
    }

    function updateLinks() {
        const environment = getEnvironment(url.hostname);
        const links = document.querySelectorAll('a[href^="http"], a[href^="//"]');

        links.forEach((link) => {
            const href = link.getAttribute('href');
            const hostAndPath = href.split('?')[0];
            const query = getQuerystring(href);

            if (isDomainSupported(hostAndPath)) {
                /*
                    If production, remove environment segment. Otherwise, ensure
                    correct environment segment. (Also, ensure correct port and
                    replace querystring.)
                */
                link.setAttribute(
                    'href',
                    environment === 'production' ?
                        `${removeEnvironment(hostAndPath)}${query}` :
                        `${addUpdateEnvironment(hostAndPath, environment)}${query}`,
                );
            }
        });
    }

    window.addEventListener('DOMContentLoaded', updateLinks);
}());
