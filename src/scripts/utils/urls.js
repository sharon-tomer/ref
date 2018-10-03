import {SERVICES} from './constants'
export function getServiceFromUrl(url) {
    if(!url) return false;
    for (var key in SERVICES) {
        if(url.match(SERVICES[key].URL_REGEX)) {
            return SERVICES[key];
        }      
    }

    return false;
}