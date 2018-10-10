import ext from './utils/ext';
import {getServiceFromUrl} from './utils/urls';
import {ACTIONS, APP_ID} from './utils/constants';
import {createNewTab, sendMessageToTab} from './utils/browser';
import api from './utils/api';
import {postData, getData} from './utils/xhr';
require('dotenv').config();

var endpoint = 'http://localhost:3000';
        
ext.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	let {status} = changeInfo;  
	if(status !== 'complete') return;  
	let url = tab.url;
	let service = getServiceFromUrl(url);
	if(service) {
		let promptMessage = shouldPromptInTab(url, service);
		if(!promptMessage) return;
		console.log('ref' + 'prompting to add code in service:', service);
		chrome.tabs.sendMessage(tabId, promptMessage, () => console.log('ref' + 'todo: handle response from contentscript'));
	}
});

ext.runtime.onMessage.addListener((request, sender, sendResponse) => { 
	if(request.type === APP_ID) {
		console.log('ref' + 'got request:', request.action);
		switch (request.action) {
		case ACTIONS.ADD_NEW_CODE:  
			getNewCode(request.service)
				.then(result => sendResponse({success: !!result, code: result}));
			break;
		case ACTIONS.NAV_TO_REF_LINK:
			navToRefLink(sender.tab.id, request.service)
				.then(response => sendResponse(response));
			break;
		case ACTIONS.GET_CODE:
			fetchCodeForService(request.service)
				.then(response => sendResponse(response));
			break;
		default: 
			throw 'Unknown action in message: ' + request;
		} 
		return true; 
	}
}); 

async function getNewCode(service) {
	console.log('ref' + 'getting code...');
	let newTab = await createNewTab(service.CODE_URL, false);
	let response = await sendScrapingRequest(newTab.id, service);
	console.log('ref' + 'got - new tab:', newTab, 'response:', response, 'closing tab...');
	ext.tabs.remove(newTab.id);
	console.log('ref' + 'tab closed.');
	if(response && response.code)
		return await saveNewCode(response.code, service.ID);
	else return false;
}

async function fetchCodeForService(service) {
	return getData(endpoint + api.code.get, {serviceid: service.ID});
}

async function sendScrapingRequest(tabId, service) {
	let message = {type: APP_ID, action: ACTIONS.SCRAPE_CODE, service};
	console.log('ref' + 'sending scraping request to tab ', tabId, 'for service: ', service);
	return sendMessageToTab(tabId, message);
}

async function saveNewCode(code, serviceid) {
	if(typeof code !== 'string') {
		console.log('ref' + 'couldn\'t scrape the code');
		return false;
	}
	console.log('ref' + 'got code:', code);
	return postData(endpoint + api.code.new, {code, serviceid})
		.then(res => {
			console.log('ref' + 'server replyed with: ', res);
			if(res.code) return res.code;
			else {
				console.log('ref' + 'error posting new code: ' + res.error || 'unspecified error');
				return false; 
			}
		});
}

async function getRandomRefUrl(serviceid, code) {
	if(typeof code !== 'string') {
		console.log('ref' + 'couldn\'t scrape the code');
		return false;
	}
	console.log('ref' + 'got code:', code);
	return postData(endpoint + api.code.new, {code, serviceid})
		.then(res => {
			console.log('ref' + 'server replyed with: ', res);
			if(res.code) return res.code;
			else {
				console.log('ref' + 'error posting new code: ' + res.error || 'unspecified error');
				return false; 
			}
		});
}

function shouldPromptInTab(url, service) {
	let res = false;
	if(url.match(service.REGISTERATION_FORM_REGEX)) {
		res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD_ON_REGISTERATION, service};
	} else if(url.match(service.MEMBER_URL_REGEX)){
		res = {type: APP_ID, action: ACTIONS.PROMPT_TO_ADD_CODE, service};
	} else if(url.match(service.NON_MEMBER_URL_REGEX)) {
		res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD, service};
	}
	return res;
}

function navToRefLink(service) {
	getRandomRefUrl(service.id)
		.then(url => createNewTab(url, true));
}

