import ext from './ext';

let browserStorage = ext.storage.sync ? ext.storage.sync : ext.storage.local;

export default {
	get: item => new Promise(resolve => browserStorage.get(item, res => resolve(res))),
	set: item => new Promise(resolve => browserStorage.set(item, () => resolve(item)))
};
