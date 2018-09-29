import ext from "./utils/ext";
import {getServiceFromUrl} from './utils/urls';

ext.webNavigation.onCompleted.addListener(({tabId, url}) => {  
  let service = getServiceFromUrl(url);
  if(service) {
    console.log('service recognized');
    let message = {type: 'ref-msg', action: 'prompt-to-add-code'};
    chrome.tabs.sendMessage(tabId, message, () => console.log('todo: handle response from contentscript'));
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