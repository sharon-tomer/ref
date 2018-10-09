import ext from "./utils/ext";
import Notification from './components/Notification';
import {ACTIONS, COPY, APP_ID} from './utils/constants';
import {sendMessageToBackground, findByXpath} from './utils/browser';
import Navigator from './utils/navigator';
import serviceActions from './utils/serviceactions';

class Referral {
  constructor(){
    this.notification = new Notification();
    this.notificationContainer = null;
    this.navigator = new Navigator();
    ext.runtime.onMessage.addListener(this.onRequest.bind(this));
  };

  onRequest(request, sender, sendResponse) {
    if(!request.type === APP_ID) return;
    switch (request.action) {
      case ACTIONS.PROMPT_TO_ADD_CODE:
        this.notificationContainer = this.buildAddCodePrompt(request.service);
         document.body.appendChild(this.notificationContainer);
        sendResponse('success'); 
        break;
      case ACTIONS.SCRAPE_CODE:
        let code = this.scrapeTextByXpath(request.service.CODE_XPATH);
        sendResponse({code});
        break;
      case ACTIONS.PROMPT_TO_GET_REWARD_ON_REGISTERATION:
        this.notificationContainer = this.buildGetRewardOnRegisterationPrompt(request.service);
        document.body.appendChild(this.notificationContainer);
        sendResponse('success'); 
      break;

      case ACTIONS.PROMPT_TO_GET_REWARD:
        this.notificationContainer = this.buildGetRewardPrompt(request.service);
        document.body.appendChild(this.notificationContainer);
        sendResponse('success'); 
      break;
      default:
        console.log('ref' + 'unknown action:', request.action);
    }
    return true;
  }
  
  buildAddCodePrompt (service) {
    let promptDescription = 
      `${COPY.UI.PROMPTS.ADD_CODE.TITLE_PRE}` + 
      `${service.NAME}` + 
      `${COPY.UI.PROMPTS.ADD_CODE.TITLE_MID}` + 
      `<b>${service.COPY.REFER_REWARD}</b>?`;
    let promptActionButton = {
      onclick: () => this.onAddCodeClick(service), 
      text: COPY.UI.PROMPTS.ADD_CODE.ACTIVATE_NOW
    };
    let promptOptions = [{
      text: COPY.UI.PROMPTS.ADD_CODE.ACTIVATE_LATER, 
      onclick: () => this.notification.remove()
    }]; 
  
    return this.notification.init(false, promptDescription, promptActionButton, promptOptions);
  }

  buildGetRewardPrompt(service) {
    let promptDescription = 
      `${COPY.UI.PROMPTS.GET_REWARD.TITLE_PRE}` + 
      `${service.NAME}` + 
      `${COPY.UI.PROMPTS.GET_REWARD.TITLE_MID}` + 
      `<b>${service.COPY.REFERRED_REWARD}</b>` +
      `${COPY.UI.GET_REWARD.TITLE_POST}`;
    let promptActionButton = {
      onclick: () => this.onAddCodeClick(service), 
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
  
    return this.notification.init(false, promptDescription, promptActionButton, promptOptions);
  }

  buildGetRewardOnRegisterationPrompt(service) {
    let promptDescription = 
      `${COPY.UI.PROMPTS.GET_REWARD_ON_REGISTERATION.TITLE_PRE}` + 
      `${service.COPY.REFERRED_REWARD}` + 
      `${COPY.UI.PROMPTS.GET_REWARD.TITLE_POST}`;
    let testCode = 'testCode'; // todo: remove
    let promptActionButton = {
      onclick: () => this.applyCode(service, testCode), 
      text: COPY.UI.PROMPTS.GET_REWARD.ACTIVATE_NOW
    };
    let promptOptions = [
      {
        text: COPY.UI.PROMPTS.GET_REWARD.LEAVE_ME_ALONE, 
        //todo: update background
        onclick: () => this.notification.remove()
      }
    ]; 
    return this.notification.init(false, promptDescription, promptActionButton, promptOptions);
  }

  buildCodeRetrieved(isSuccessful, code) {
    let promptDescription, promptOptions, promptTitle;
    if(isSuccessful) {
      promptTitle = COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.TITLE;
      promptDescription = 
        `${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.DESCRIPTION1}` +
        `<b>${code}</b>` + 
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
    return this.notification.init(promptTitle, promptDescription, false, promptOptions);
  }
  
  onAddCodeClick(service) {
    this.notificationContainer = this.notification.init(false, '<i class="spinner"></i>', false, false);
    document.body.appendChild(this.notificationContainer);
    sendMessageToBackground({action: ACTIONS.GET_CODE, service})
      .then(this.handleAddCodeResponse.bind(this));
  }

  onOptOutClick(service) {
    this.notificationContainer = this.notification.init(false, COPY.UI.PROMPTS.OPT_OUT.DESCRIPTION, false, false);
    sendMessageToBackground({action: ACTIONS.OPT_OUT, service});
  }

  onNavToRewardLinkClick(service) {
    sendMessageToBackground({action: ACTIONS.NAV_TO_REF_LINK, service})
      .then(code => this.injectCode(service, code))
      .then(this.promptCodeAdded);
  }

  onHaveAccountClick(service) {
    // todo
    // sendMessageToBackground({action: ACTIONS.HAS_ACCOUNT, service})
    //   .then(this.handleAddCodeResponse.bind(this));
  }
  
  handleAddCodeResponse(response) {
    console.log('ref' + 'got code response from background: ', response);
    if(response.success) {
      this.notificationContainer = this.buildCodeRetrieved(true, response.code);
    } else {
      this.notificationContainer = this.buildCodeRetrieved(false);
      console.log('ref' + 'Failed fetching code.');
    }
    document.body.appendChild(this.notificationContainer);
  }
  
  scrapeTextByXpath(xpath) {
    var elem = findByXpath(xpath);
    console.log('ref' + 'elem found:', elem);
    if(elem) return elem.innerText;
    return false;
  }

  applyCode(service, code) {
    let codeInjectionActions = serviceActions[service.ID].buildCodeInjectionActions(code);
    this.navigator.exec(codeInjectionActions, document);
  }
}

new Referral();