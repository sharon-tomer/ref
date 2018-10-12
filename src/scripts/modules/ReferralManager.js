import { getData, postData } from '../utils/xhr';
import api from '../utils/api';
import { closeTab, createNewTab, sendMessageToTab } from '../utils/browser';
import { APP_ID, ACTIONS } from '../utils/constants';

export default class ReferralManager {
	constructor(userid) {
		this.endpoint = 'http://localhost:3000';
		this.userid = userid;
	}

	async setUserReferralInfo(service) {
		let tabForscraping = await this.createNewTabForScraping(service.urls.referral_url);
		let scrapingResult = await this.sendScrapingRequestToTab(tabForscraping.id, service);
		closeTab(tabForscraping.id);
		return await this.saveNewReferral(scrapingResult, service);
	}

	async getReferralInfoFromAFriend(friendUserId, service) {
		return getData(this.endpoint + api.referrals.get, {serviceid: service.id, friendUserId});
	}

	async getReferralInfoFromAStranger(service) {
		return getData(this.endpoint + api.referrals.get, {serviceid: service.id});
	}

	async createNewTabForScraping(url) {
		return await createNewTab(url, false);
	}

	async sendScrapingRequestToTab (tabId, service) {
		let message = {type: APP_ID, action: ACTIONS.SCRAPE_REFERRAL_INFO, service};
		return await sendMessageToTab(tabId, message);
	}

	async saveNewReferral(referral, service) {
		let payload = {};
		if(!referral) {
			return false;
		}

		if(referral.code) payload.code = referral.code;
		if(referral.link) payload.link = referral.link;
		payload.serviceid = service.id;
		payload.userid = this.userid;

		return postData(this.endpoint + api.referrals.new, payload)
			.then(res => {
				console.log('ref' + 'server replyed with: ', res);
				if(res.code || res.link) return {code: res.code, link: res.link};
			}).catch(err => {
				console.log('ref' + 'error posting new referral info: ' + err || 'unspecified error');
				return false; 
			});
	}
}