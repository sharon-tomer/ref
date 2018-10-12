import ext from './utils/ext';
import {getServiceFromUrl} from './utils/urls';
import {ACTIONS, APP_ID} from './utils/constants';
import {createNewTab} from './utils/browser';
import api from './utils/api';
import {postData} from './utils/xhr';
import ReferralManager from './modules/ReferralManager';
import storage from './utils/storage';

class BackgroundProcess {
	constructor() {
		this.endpoint = 'http://localhost:3000';
		this.userid = 'test_user_id';
		this.referralManager = new ReferralManager(this.userid); 
		this.currentSessionServices = {};
	}

	init() {
		this.setupListeners();
		this.setupStorage();
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
			this.currentSessionServices[service.id] = service;
			let promptMessage = this.shouldPromptInTab(url, service);
			if(!promptMessage) return;
			console.log('ref' + 'prompting to add referral for service:', service);
			chrome.tabs.sendMessage(tabId, promptMessage, () => console.log('ref' + 'todo: handle response from contentscript'));
		}
	}

	onMessageFromTab(request, sender, sendResponse) {
		if(request.type === APP_ID) {
			switch (request.action) {

			case ACTIONS.SET_REFERRAL_INFO:  
				this.referralManager.setUserReferralInfo(request.service)
					.then(result => sendResponse({success: !!result, ...result}));
				break;

			case ACTIONS.NAV_TO_REF_LINK:
				this.navToRefLink(sender.tab.id, request.service)
					.then(response => sendResponse(response));
				break;

			case ACTIONS.GET_REFERRAL:
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

	async getRandomRefUrl(serviceid) { //todo fix and test
		return postData(this.endpoint + api.referrals.get, {serviceid})
			.then(res => {
				if(res.code || res.link) return res;
				else {
					console.log('ref' + 'error getting referral info from server: ' + res.error || 'unspecified error');
					return false; 
				}
			});
	}

	shouldPromptInTab(url, service) {
		let res = false;
		if(url.match(service.urls.registeration_form_regex)) {
			res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD_ON_REGISTERATION, service};
		} else if(url.match(service.urls.member_url_regex)){
			res = {type: APP_ID, action: ACTIONS.PROMPT_TO_SET_REFERRAL_INFO, service};
		} else if(url.match(service.urls.non_member_url_regex)) {
			res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD, service};
		}
		return res;
	}

	
	navToRefLink(service) {
		this.getRandomRefUrl(service.id)
			.then(url => createNewTab(url, true));
	}

	async setupStorage() {
		let servicesStorage = await storage.get('services');
		if(!servicesStorage) {
			await storage.set({'services': {}});
			servicesStorage = {};
		}
		this.servicesStorage = servicesStorage;

		//todo: user storage
	}
}

let mainProcess = new BackgroundProcess();
mainProcess.init();




