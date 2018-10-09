import {SERVICES} from './constants'
export function getServiceFromUrl(url) {
    if(!url) return false;
    for (var key in SERVICES) {
        let rootDomain = extractRootDomain(url);
        if(rootDomain.match(SERVICES[key].ROOT_DOMAIN)) {
            return SERVICES[key];
        }      
    }

    return false;
}

export function getUserServices() {
    let serviceIdentifiers = ['riders.uber.com'];
}

export function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function extractHostname(url) {
    var hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}