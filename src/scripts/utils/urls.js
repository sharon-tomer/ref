import servicesProps from '../utils/services-props';
import Service from '../modules/Service';

export function getServiceFromUrl(url) {

	if(!url) return false;
	for (var serviceId in servicesProps) {
		let rootDomain = extractRootDomain(url);
		if(rootDomain.match(servicesProps[serviceId].ROOT_DOMAIN)) {
			return new Service(serviceId, servicesProps[serviceId]);
		}      
	}

	return false;
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

	if (url.indexOf('//') > -1) {
		hostname = url.split('/')[2];
	}
	else {
		hostname = url.split('/')[0];
	}

	hostname = hostname.split(':')[0];
	hostname = hostname.split('?')[0];

	return hostname;
}