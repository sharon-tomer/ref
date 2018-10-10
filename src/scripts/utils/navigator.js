import {copyTextToClipboard, setElemValueToText, findByXpath, asyncClick} from './browser';

export default class Navigator {
    constructor() {
        this.actionsMap = {
            find: (elem, xpath) => findByXpath(xpath),
            click: elem => asyncClick(elem),
            copy: (elem, text) => copyTextToClipboard(text),
            paste: (elem, text) => setElemValueToText(elem, text),
        }
    }

    async exec(actions, documentFallback) {
        if(!actions) return false;
        if(!document) document = documentFallback;
        let prevResult = true;
        for(let i = 0; i < actions.length; i++) { // loop instead of reduce for improved performance
            let action = actions[i];
            prevResult = await this.actionsMap[action.key](prevResult, action.val);
            if (!prevResult) {
                console.log('navigator failed on action:', actions[i-1]);
                return false;
            }
        }
        return true;
    }
}