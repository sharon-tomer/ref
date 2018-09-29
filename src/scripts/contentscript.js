import ext from "./utils/ext";
import Notification from './components/Notification';

function onRequest(request, sender, sendResponse) {
  if(!request.type === 'ref-msg') return;
  if (request.action === 'prompt-to-add-code') {
    let title = 'Add your referral code to get some $$$'
    let description = false;
    let onclick = () => console.log('add code clicked');
    let prompt = new Notification(title, description, {onclick, text: 'I want free money!'});
    document.body.appendChild(prompt);
    sendResponse('success');
  }
}

ext.runtime.onMessage.addListener(onRequest);