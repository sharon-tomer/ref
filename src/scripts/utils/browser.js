import {promisify} from './helpers';
import ext from './ext';
import {APP_ID} from './constants';
  
export function executeScriptInTab(tabId, props) {
	return promisify(ext.tabs.executeScript, [tabId, props]);
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

function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement('textarea');
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
  
	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}
  
	document.body.removeChild(textArea);
}

export async function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(function() {
		return true;
	}, function(err) {
		console.error('Async: Could not copy text: ', err);
		return false;
	});
}

export function setElemValueToText(elem, text) {
	elem.focus();
	elem.select();
    
	var val = elem.value;
	var endIndex;
	var range;
	var doc = elem.ownerDocument;
	if (typeof elem.selectionStart === 'number' &&
        typeof elem.selectionEnd === 'number') {
		endIndex = elem.selectionEnd;
		elem.value = val.slice(0, endIndex) + text + val.slice(endIndex);
		elem.selectionStart = elem.selectionEnd = endIndex + text.length;
		return true;
	} else if (doc.selection !== 'undefined' && doc.selection.createRange) {
		range = doc.selection.createRange();
		range.collapse(false);
		range.text = text;
		range.select();
		return true;
	}
	return false;
}

export function findByXpath(xpath) { // assuming only 1 result. todo: error handling
	var xpathResults = document.evaluate(xpath, document.body);
	return xpathResults.iterateNext() || false;
}

export async function asyncClick(elem) {
	return new Promise(resolve => {

		let removeListenerAndResolve = (event) => {
			if(event.target === elem) {
				document.body.removeEventListener('click', removeListenerAndResolve);
				resolve(elem);
			}
		}; 
		// using body ensures this event handler would fire LAST
		document.body.addEventListener('click', removeListenerAndResolve);

		elem.click();
		setTimeout( ()=>{} , 0);
	});
}

export function closeTab(tabId) {
	ext.tabs.remove(tabId);
}