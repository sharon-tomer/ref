import ext from './utils/ext';
import Notification from './components/Notification';
import {ACTIONS, COPY, APP_ID} from './utils/constants';
import {sendMessageToBackground} from './utils/browser';
import Navigator from './modules/navigator';
import serviceActions from './utils/scraping-recipes';
import scrapingRecipes from './utils/scraping-recipes';

class Referral {
	constructor(){
		this.notification = new Notification();
		document.body.appendChild(this.notification.init());
		this.navigator = new Navigator();
		ext.runtime.onMessage.addListener(this.onRequest.bind(this));
	}

	onRequest(request, sender, sendResponse) {
		if(!request.type === APP_ID) return;
		switch (request.action) {
		case ACTIONS.PROMPT_TO_SET_REFERRAL_INFO:
			this.buildAddReferralPrompt(request.service);
			sendResponse('success'); 
			break;
		case ACTIONS.SCRAPE_REFERRAL_INFO:
			this.scrapeReferralInfo(request.service)
				.then(sendResponse);
			break;
		case ACTIONS.PROMPT_TO_GET_REWARD_ON_REGISTERATION: 
			this.buildGetRewardOnRegisterationPrompt(request.service);
			sendResponse('success'); 
			break;

		case ACTIONS.PROMPT_TO_GET_REWARD:
			this.buildGetRewardPrompt(request.service);
			sendResponse('success'); 
			break;
		default:
			console.log('ref' + 'unknown action:', request.action);
		}
		return true;
	}
  
	buildAddReferralPrompt (service) {
		let promptDescription = 
			`${COPY.UI.PROMPTS.ADD_REFERRAL.TITLE_PRE}` + 
			`${service.name}` + 
			`${COPY.UI.PROMPTS.ADD_REFERRAL.TITLE_MID}` + 
			`<b>${service.copy.REFER_REWARD}</b>?`;
		let promptActionButton = {
			onclick: () => this.onAddReferralClick(service), 
			text: COPY.UI.PROMPTS.ADD_REFERRAL.ACTIVATE_NOW
		};
		let promptOptions = [{
			text: COPY.UI.PROMPTS.ADD_REFERRAL.ACTIVATE_LATER, 
			onclick: () => this.notification.remove()
		}]; 
  
		return this.notification.update(false, promptDescription, promptActionButton, promptOptions);
	}

	buildGetRewardPrompt(service) {
		let promptDescription = 
			`${COPY.UI.PROMPTS.GET_REWARD.TITLE_PRE}` + 
			`${service.name}` + 
			`${COPY.UI.PROMPTS.GET_REWARD.TITLE_MID}` + 
			`<b>${service.copy.REFERRED_REWARD}</b>` +
			`${COPY.UI.GET_REWARD.TITLE_POST}`;
		let promptActionButton = {
			onclick: () => this.onAddReferralClick(service), 
			text: COPY.UI.PROMPTS.GET_REWARD.ACTIVATE_NOW
		};
		let promptOptions = [
			{
				text: COPY.UI.PROMPTS.GET_REWARD.ACTIVATE_LATER, 
				onclick: () => this.notification.remove()
			},
			{
				text: COPY.UI.PROMPTS.GET_REWARD.LEAVE_ME_ALONE,
				// todo: update background 
				onclick: () => this.notification.remove()
			},
			{
				text: COPY.UI.PROMPTS.GET_REWARD.HAVE_AN_ACCOUNT,
				// todo: update background
				onclick: () => this.notification.remove()
			}
		]; 
  
		return this.notification.update(false, promptDescription, promptActionButton, promptOptions);
	}

	buildGetRewardOnRegisterationPrompt(service) {
		let promptDescription = 
			`${COPY.UI.PROMPTS.GET_REWARD_ON_REGISTERATION.TITLE_PRE}` + 
			`${service.copy.REFERRED_REWARD}` + 
			`${COPY.UI.PROMPTS.GET_REWARD.TITLE_POST}`;
		let promptActionButton = {
			onclick: () => this.handleApplyReferral(service), 
			text: COPY.UI.PROMPTS.GET_REWARD.ACTIVATE_NOW
		};
		let promptOptions = [
			{
				text: COPY.UI.PROMPTS.GET_REWARD.LEAVE_ME_ALONE, 
				//todo: update background
				onclick: () => this.notification.remove()
			}
		]; 
		return this.notification.update(false, promptDescription, promptActionButton, promptOptions);
	}

	buildReferralInfoWasSetPrompt(isSuccessful, codeOrLink) {
		let promptDescription, promptOptions, promptTitle;
		if(isSuccessful) {
			promptTitle = COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.TITLE;
			promptDescription = 
				`${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.DESCRIPTION1}` +
				`<b>${codeOrLink}</b>` + 
				`${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.DESCRIPTION2}`;
			promptOptions = [{
				text: COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.CLOSE_BUTTON, 
				onclick: () => this.notification.remove()
			}];
		} else {
			promptDescription = `${COPY.UI.PROMPTS.FAILED_ADDING.TITLE}`;
			promptOptions = [{
				text: COPY.UI.PROMPTS.FAILED_ADDING.CLOSE_BUTTON, 
				onclick: () => this.notification.remove()
			}];
		}
		return this.notification.update(promptTitle, promptDescription, false, promptOptions);
	}

	buildReferralWasUsedPrompt(wasSuccessful) {
		let promptDescription, promptOptions, promptTitle;
		if(wasSuccessful) {
			promptTitle = COPY.UI.PROMPTS.REFERRAL_WAS_USED.TITLE;
			promptDescription = 
				`${COPY.UI.PROMPTS.REFERRAL_WAS_USED.DESCRIPTION1}` +
				`${COPY.UI.PROMPTS.REFERRAL_WAS_USED.DESCRIPTION2}`;
			promptOptions = [{
				text: COPY.UI.PROMPTS.REFERRAL_WAS_USED.CLOSE_BUTTON, 
				onclick: () => this.notification.remove()
			}];
		} else {
			promptDescription = `${COPY.UI.PROMPTS.REFERRAL_USE_FAILED.TITLE}`;
			promptOptions = [{
				text: COPY.UI.PROMPTS.REFERRAL_USE_FAILED.CLOSE_BUTTON, 
				onclick: () => this.notification.remove()
			}];
		}
		return this.notification.update(promptTitle, promptDescription, false, promptOptions);
	}
  
	onAddReferralClick(service) {
		this.notification.update(false, '<i class="spinner"></i>', false, false);
		sendMessageToBackground({action: ACTIONS.SET_REFERRAL_INFO, service})
			.then(this.handleSetReferralInfoResponse.bind(this));
	}

	onOptOutClick(service) {
		this.notification.update(false, COPY.UI.PROMPTS.OPT_OUT.DESCRIPTION, false, false);
		sendMessageToBackground({action: ACTIONS.OPT_OUT, service});
	}

	// onNavToRewardLinkClick(service) { //todo
	// 	sendMessageToBackground({action: ACTIONS.NAV_TO_REF_LINK, service})
	// 		// .then(code => this.injectCode(service, code))
	// 		// .then(this.promptCodeAdded);
	// }

	onHaveAccountClick() {
		// todo
		// sendMessageToBackground({action: ACTIONS.HAS_ACCOUNT, service})
		//   .then(this.handleSetReferralInfoResponse.bind(this));
	}
  
	handleSetReferralInfoResponse(response) {
		console.log('ref' + 'got set referral info response from server: ', response);
		if(response.success) {
			this.buildReferralInfoWasSetPrompt(true, response.code || response.link);
		} else {
			this.buildReferralInfoWasSetPrompt(false);
			console.log('ref' + 'Failed fetching referral info.');
		}
	}
  
	async scrapeReferralInfo(service) {
		let scrapedInfo = {};
		let serviceGetRecipes = scrapingRecipes.get[service.id];
		if(serviceGetRecipes.code) {
			let scrapeCodeRecipe = serviceGetRecipes.code();
			scrapedInfo.code = await this.navigator.exec(scrapeCodeRecipe);
		}
		if(serviceGetRecipes.link) {
			let scrapeLinkRecipe = serviceGetRecipes.link();
			scrapedInfo.link = await this.navigator.exec(scrapeLinkRecipe);
		}
		if(scrapedInfo.code || scrapedInfo.link) return scrapedInfo;
		return false;
	}

	async handleApplyReferral(service) {
		let response = await this.getReferralToUse(service);
		this.applyCode(service.id, response.code)
			.then(success => this.buildReferralWasUsedPrompt(success));
	}

	async applyCode(serviceId, codeToInject) {
		let codeInjectionActions = serviceActions.set[serviceId].code(codeToInject);
		return this.navigator.exec(codeInjectionActions);
	}

	async getReferralToUse(service) {
		return sendMessageToBackground({action: ACTIONS.GET_REFERRAL, service});
	}
}

new Referral();