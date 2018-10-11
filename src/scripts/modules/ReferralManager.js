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
		let tabForScrapping = await this.createNewTabForScraping(service.CODE_URL);
		let scrappingResult = await this.sendScrapingRequestToTab(tabForScrapping.id, service);
		// closeTab(tabForScrapping.id);
		return await this.saveNewReferral(scrappingResult, service);
	}

	async getReferralInfoFromAFriend(friendUserId, service) {
		return getData(this.endpoint + api.referrals.get, {serviceid: service.ID, friendUserId});
	}

	async getReferralInfoFromAStranger(service) {
		return getData(this.endpoint + api.referrals.get, {serviceid: service.ID});
	}

	async createNewTabForScraping(url) {
		return await createNewTab(url, false);
	}

	async sendScrapingRequestToTab (tabId, service) {
		let message = {type: APP_ID, action: ACTIONS.SCRAPE_REFERRAL_INFO, service};
		return sendMessageToTab(tabId, message);
	}

	async saveNewReferral(referral, service) {
		let payload = {};
		if(!referral) {
			return false;
		}

		if(referral.code) payload.code = referral.code;
		if(referral.link) payload.link = referral.link;
		payload.serviceid = service.ID;
		payload.userid = this.userid;

		return postData(this.endpoint + api.referrals.new, payload)
			.then(res => {
				console.log('ref' + 'server replyed with: ', res);
				if(res.code || res.link) return {code: res.code, link: res.link};
			}).catch(err => {
				console.log('ref' + 'error posting new code: ' + err || 'unspecified error');
				return false; 
			});
	}
}