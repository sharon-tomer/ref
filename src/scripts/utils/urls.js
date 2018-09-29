import {supportedServices} from './constants'
export function getServiceFromUrl(url) {
    if(!url) return false;
    for(let i = 0; i< supportedServices.length; i++) {
        if(url.match(supportedServices[i].regex)) {
            return supportedServices[i];
        }
    }
    return false;
}