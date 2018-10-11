import ext from './utils/ext';
import {getServiceFromUrl} from './utils/urls';
import {ACTIONS, APP_ID} from './utils/constants';
import {createNewTab} from './utils/browser';
import api from './utils/api';
import {postData} from './utils/xhr';
import ReferralManager from './modules/ReferralManager';

class BackgroundProcess {
	constructor() {
		this.endpoint = 'http://localhost:3000';
		this.userid = 'test_user_id';
		this.referralManager = new ReferralManager(this.userid); 
	}

	init() {
		this.setupListeners();
	}

	setupListeners() {
		ext.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
		ext.runtime.onMessage.addListener(this.onMessageFromTab.bind(this));
	}

	onTabUpdated(tabId, changeInfo, tab) {
		let {status} = changeInfo;  
		if(status !== 'complete') return;  
		let url = tab.url;
		let service = getServiceFromUrl(url);
		if(service) {
			let promptMessage = this.shouldPromptInTab(url, service);
			if(!promptMessage) return;
			console.log('ref' + 'prompting to add code in service:', service);
			chrome.tabs.sendMessage(tabId, promptMessage, () => console.log('ref' + 'todo: handle response from contentscript'));
		}
	}

	onMessageFromTab(request, sender, sendResponse) {
		if(request.type === APP_ID) {
			switch (request.action) {
			case ACTIONS.ADD_NEW_CODE:  
				this.referralManager.setUserReferralInfo(request.service)
					.then(result => sendResponse({success: !!result, ...result}));
				break;
			case ACTIONS.NAV_TO_REF_LINK:
				this.navToRefLink(sender.tab.id, request.service)
					.then(response => sendResponse(response));
				break;
			case ACTIONS.GET_CODE:
				if(request.friendId) {
					this.referralManager.getReferralInfoFromAFriend(request.friendId, request.service)
						.then(sendResponse);
				} else {
					this.referralManager.getReferralInfoFromAStranger(request.service)
						.then(sendResponse);
				}
				break;
			default: 
				throw 'Unknown action in message: ' + request;
			} 
			return true; 
		}
	}

	async getRandomRefUrl(serviceid, code) {
		if(typeof code !== 'string') {
			console.log('ref' + 'couldn\'t scrape the code');
			return false;
		}
		console.log('ref' + 'got code:', code);
		return postData(this.endpoint + api.code.new, {code, serviceid})
			.then(res => {
				console.log('ref' + 'server replyed with: ', res);
				if(res.code) return res.code;
				else {
					console.log('ref' + 'error posting new code: ' + res.error || 'unspecified error');
					return false; 
				}
			});
	}

	shouldPromptInTab(url, service) {
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

	
	navToRefLink(service) {
		this.getRandomRefUrl(service.id)
			.then(url => createNewTab(url, true));
	}
}

let mainProcess = new BackgroundProcess();
mainProcess.init();




