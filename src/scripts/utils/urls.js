import {SERVICES} from './constants'
export function getServiceFromUrl(url) {
    if(!url) return false;
    for (var key in SERVICES) {
        if(url.match(SERVICES[key].MEMBER_URL_REGEX)) {
            return SERVICES[key];
        }      
    }

    return false;
}

export function getUserServices() {
    let serviceIdentifiers = ['riders.uber.com'];
}