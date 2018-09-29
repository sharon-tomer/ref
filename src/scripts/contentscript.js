import ext from "./utils/ext";
import Notification from './components/Notification';

function onRequest(request, sender, sendResponse) {
  if(!request.type === 'ref-msg') return;
  if (request.action === 'prompt-to-add-code') {
    let prompt = new Notification();
    let onclick = () => console.log('add code clicked');
    let options = [{text: 'Activate Later', onclick: prompt.remove.bind(prompt)}];
    let promptContainer = prompt.init(false, false, {onclick, text: 'I want free money!'}, options);
    document.body.appendChild(promptContainer);
    sendResponse('success'); 
  }
}

ext.runtime.onMessage.addListener(onRequest);