import ext from "./utils/ext";
import {getServiceFromUrl} from './utils/urls';
import {ACTIONS, APP_ID, SERVICES, SUCCESS, FAILED} from './utils/constants';

ext.webNavigation.onCompleted.addListener(({tabId, url}) => {  
  let service = getServiceFromUrl(url);
  if(service) {
    let message = {type: APP_ID, action: ACTIONS.PROMPT_TO_ADD_CODE, service};
    chrome.tabs.sendMessage(tabId, message, () => console.log('todo: handle response from contentscript'));
  }
});

ext.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === APP_ID) {
    switch (message.action) {
      case ACTIONS.GET_CODE: 
        getCode(message.service)
          .then(res => sendResponse(res));
        break;

      default: 
        throw 'Unknown action in message: ' + message;
    } 
  }
  return true;
});

function getCode(service) {
  return ext.tabs.create({ url: SERVICES[service.id].REF_URL, active: false })
    .then(tab => stringifyFunc(tab.id, SERVICES[service.id].XPATH))
    .then(result => result && result.length ? registerLink(result, service) && SUCCESS : FAILED)
    .catch(() => FAILED);
}

function scrapeReferralLink(xpath) {
  var xpathResults = document.evaluate(xpath, document.body);
  var elem = refXpath.iterateNext();
  if(elem) return elem.innerText;
  return false;
}

function registerLink(link, service) { // todo 
  console.log('link:', link);
  return true;
}

function stringifyFunc(tabId, xpath) {
  return ext.tabs.executeScript(tabId, {code: scrapeReferralLink.toString()})
    .then(() => {
      return ext.tabs.executeScript(tabId, {code: `scrapeReferralLink(${xpath});`});
    });
}
