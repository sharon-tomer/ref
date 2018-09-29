import ext from "./utils/ext";
import {getServiceFromUrl} from './utils/urls';

let supportedUrls = ['*://*.uber.com/*'];

ext.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {  
  let service = getServiceFromUrl(url);
  if(service) {
    let message = {type: 'ref-msg', action: 'prompt-to-add-code'};
    ext.runtime.sendMessage(message, () => console.log('todo: handle response from contentscript'));
  }
});

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", request.data);

      sendResponse({ action: "saved" });
    }
  },
);