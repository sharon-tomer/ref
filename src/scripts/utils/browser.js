import {promisify} from './helpers';
import ext from './ext';
import {APP_ID} from './constants';
  
export function executeScriptInTab(tabId, props) {
    return promisify(ext.tabs.executeScript, [tabId, props])
}
  
export function sendMessageToTab(tabId, message) {
    console.log('ref' + 'sending message to tab:', [tabId, Object.assign({type: APP_ID}, message)]);
    return promisify(chrome.tabs.sendMessage, [tabId, Object.assign({type: APP_ID}, message)]);
}

export function sendMessageToBackground(message) {
    console.log('ref' + 'sending message to background:', [Object.assign({type: APP_ID}, message)]);
    return promisify(ext.runtime.sendMessage, [Object.assign({type: APP_ID}, message)]);
}

export function createNewTab (url, active) {
    return new Promise(resolve => {
        chrome.tabs.create({url, active}, async tab => {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve(tab);
                }
            });
        });
    });
}