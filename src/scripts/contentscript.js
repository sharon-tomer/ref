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
        console.log('scrapping for service: ', request.service);
        let code = this.scrapeTextByXpath(request.service.CODE_XPATH);
        console.log('code: ', code);
        sendResponse({code});
        break;
    }
    return true;
  }
  
  buildAddCodePrompt (service) {
    let promptDescription = 
      `${COPY.UI.PROMPTS.ADD_CODE.TITLE_PRE}` + 
      `${service.name}` + 
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
    let promptDescription, promptOptions;
    if(isSuccessful) {
      promptDescription = 
        `${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.TITLE_PART1}` + 
        `${code}` + 
        `${COPY.UI.PROMPTS.ADDED_SUCCESSFULLY.TITLE_PART1}`;
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
    return this.notification.init(false, promptDescription, false, promptOptions);
  }
  
  onAddCodeClick(service) {
    sendMessageToBackground({action: ACTIONS.GET_CODE, service})
    .then(this.handleAddCodeResponse.bind(this));
  }
  
  handleAddCodeResponse(response) {
    console.log('got code response from background: ', response);
    if(response.success) {
      this.notificationContainer = this.buildCodeRetrieved(true, response.code);
    } else {
      this.notificationContainer = this.buildCodeRetrieved(false);
      console.log('Failed fetching code.');
    }
    document.body.appendChild(this.notificationContainer);
  }
  
  scrapeTextByXpath(xpath) {
    var xpathResults = document.evaluate(xpath, document.body);
    var elem = xpathResults.iterateNext();
    if(elem) return elem.innerText;
    return false;
  }
}

new Referral();