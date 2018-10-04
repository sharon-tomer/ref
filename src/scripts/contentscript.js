import ext from "./utils/ext";
import Notification from './components/Notification';
import {ACTIONS, COPY, APP_ID} from './utils/constants';
import {sendMessageToBackground} from './utils/browser';

class Referral {
  constructor(){
    this.notification = new Notification();
    this.notificationContainer = null;
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
        console.log('ref' + 'scrapping for service: ', request.service);
        let code = this.scrapeTextByXpath(request.service.CODE_XPATH);
        console.log('ref' + 'code: ', code);
        sendResponse({code});
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
      `<b>${service.COPY.REWARD}</b>?`;
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

  buildCodeRetrieved(isSuccessful, code) {
    let promptDescription, promptOptions, promptTitle;
    if(isSuccessful) {
      promptTitle = COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.TITLE;
      promptDescription = 
        `${code}` + 
        `${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.DESCRIPTION}`;
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
    console.log('ref' + 'scraping by xpath: ', xpath)
    var xpathResults = document.evaluate(xpath, document.body);
    var elem = xpathResults.iterateNext();
    console.log('ref' + 'elem found:', elem);
    if(elem) return elem.innerText;
    return false;
  }
}

new Referral();