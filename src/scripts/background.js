import ext from './utils/ext';
import {getServiceFromUrl} from './utils/urls';
import {ACTIONS, APP_ID} from './utils/constants';
import {createNewTab, sendMessageToTab} from './utils/browser';
import endpoints from './utils/endpoints';
import {postData} from './utils/xhr';
        
ext.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let {status} = changeInfo;  
  if(status !== 'complete') return;  
  let url = tab.url;
  let service = getServiceFromUrl(url);
  if(service) {
    promptMessage = shouldPromptInTab(url, service);
    if(!promptMessage) return;
    console.log('ref' + 'prompting to add code in service:', service);
    chrome.tabs.sendMessage(tabId, promptMessage, () => console.log('ref' + 'todo: handle response from contentscript'));
  }
});

ext.runtime.onMessage.addListener((request, sender, sendResponse) => { 
  if(request.type === APP_ID) {
    console.log('ref' + 'got request:', request.action);
    switch (request.action) {
      case ACTIONS.GET_CODE:  
        getCode(request.service)
          .then(result => sendResponse({success: !!result, code: result}));
        break;

      default: 
        throw 'Unknown action in message: ' + request;
    } 
    return true; 
  }
}); 

async function getCode(service) {
  console.log('ref' + 'getting code...');
  let newTab = await createNewTab(service.CODE_URL, false);
  let response = await sendScrapingRequest(newTab.id, service);
  console.log('ref' + 'got - new tab:', newTab, 'response:', response, 'closing tab...');
  ext.tabs.remove(newTab.id);
  console.log('ref' + 'tab closed.');
  if(response && response.code)
    return await saveNewCode(response.code);
  else return false;
}

async function sendScrapingRequest(tabId, service) {
  let message = {type: APP_ID, action: ACTIONS.SCRAPE_CODE, service};
  console.log('ref' + 'sending scraping request to tab ', tabId, 'for service: ', service);
  return sendMessageToTab(tabId, message);
}

async function saveNewCode(code) {
  if(typeof code !== 'string') {
    console.log('ref' + 'couldn\'t scrape the code');
    return false;
  }
  console.log('ref' + 'got code:', code);
  return postData(endpoints.code.new, {code})
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
    res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD, service};
  } else if(url.match(service.MEMBER_URL_REGEX)){
    res = {type: APP_ID, action: ACTIONS.PROMPT_TO_ADD_CODE, service};
  } else if(url.match(service.NON_MEMBER_URL_REGEX)) {
    res = {type: APP_ID, action: ACTIONS.PROMPT_TO_GET_REWARD, service};
  }
  return res;
}

