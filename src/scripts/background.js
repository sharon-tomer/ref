import ext from "./utils/ext";
import {getServiceFromUrl} from './utils/urls';

ext.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {  
  if(!changeInfo.status === 'complete') return;
  let service = getServiceFromUrl(changeInfo.url);
  if(service) {
    let message = {type: 'ref-msg', action: 'prompt-to-add-code'};
    // ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabId, message, () => console.log('todo: handle response from contentscript'));
    // });
  }
});

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", request.data);

      sendResponse({ action: "saved" });
    }
  }
);