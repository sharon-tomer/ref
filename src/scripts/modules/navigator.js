import {copyTextToClipboard, setElemValueToText, findByXpath, asyncClick} from '../utils/browser';
import { getFirstRegexMatch } from '../utils/helpers';

export default class Navigator {
	constructor() {
		this.actionsMap = {
			find: (elem, xpath) => findByXpath(xpath),
			gettext: (elem) => elem.innerText,
			click: elem => asyncClick(elem),
			copy: (elem, text) => copyTextToClipboard(text),
			paste: (elem, text) => setElemValueToText(elem, text),
			regex: (elem, regex) => getFirstRegexMatch(elem, regex)
		};
	}

	async exec(actions) {
		if(!actions) return false;
		let prevResult = true;
		for(let i = 0; i < actions.length; i++) { // for loop instead of reduce for improved performance
			let action = actions[i];
			prevResult = await this.actionsMap[action.key](prevResult, action.val);
			if (!prevResult) {
				console.log('navigator failed on action:', actions[i-1]);
				return false;
			}
		}
		return prevResult;
	}
}