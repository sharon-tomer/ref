import {promisify} from './helpers';
import ext from './ext';
import {APP_ID} from './constants';

export function createNewTab(url, active) {
    return promisify(ext.tabs.create, [{ url, active }])
}
  
export function executeScriptInTab(tabId, props) {
    return promisify(ext.tabs.executeScript, [tabId, props])
}
  
export function sendMessageToTab(tabId, message) {
    return promisify(chrome.tabs.sendMessage, [tabId, Object.assign({type: APP_ID}, message)]);
}

export function sendMessageToBackground(message) {
    return promisify(ext.runtime.sendMessage, [Object.assign({type: APP_ID}, message)]);
}