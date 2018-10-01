import ext from "./utils/ext";
import Notification from './components/Notification';
import {ACTIONS, COPY, APP_ID} from './utils/constants';

function onRequest(request, sender, sendResponse) {
  if(!request.type === APP_ID) return;
  if (request.action === ACTIONS.PROMPT_TO_ADD_CODE) {
    let promptContainer = buildAddCodePrompt(request.service);
    document.body.appendChild(promptContainer);
    sendResponse('success'); 
  }
  return true;
}

function buildAddCodePrompt (service) {
  let prompt = new Notification();
  let promptTitle = `
    ${COPY.UI.PROMPTS.ADD_CODE.TITLE_PRE}
    ${service.name}
    ${COPY.UI.PROMPTS.ADD_CODE.TITLE_MID}
    ${COPY.SERVICES[service.id]}
    ${COPY.UI.PROMPTS.ADD_CODE.TITLE_POST}`;
  let promptActionButton = {onclick: onAddCodeClick, text: COPY.UI.PROMPTS.ADD_CODE.ACTIVATE_NOW};
  let options = [{text: COPY.UI.PROMPTS.ADD_CODE.ACTIVATE_LATER, onclick: () => prompt.remove()}];

  return prompt.init(promptTitle, false, promptActionButton, options);
}

function onAddCodeClick(service) {
  ext.runtime.sendMessage({type: APP_ID, action: ACTIONS.GET_CODE, service},
    () => doneLoading()
  );
}

function doneLoading() {
}

ext.runtime.onMessage.addListener(onRequest);