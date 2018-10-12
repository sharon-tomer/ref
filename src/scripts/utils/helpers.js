export function promisify(f, args) { // assuming last arg is cb 
	return new Promise((resolve) => {
		f(...args, res => resolve(res));
	});
}

export function getFirstRegexMatch(elem, regex) {
	let string;
	if(typeof elem === 'string') {
		string = elem;
	} else {
		string = elem.innerText;
	}
	let res = string.match(regex);
	return res && res[1];
}