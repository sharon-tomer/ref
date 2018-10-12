export default class Notification {
	constructor() {
	}

	init() {
		this.container = document.createElement('div');
		this.container.className = 'ref-container';
		this.container.style.display = 'none';
		return this.container;
	}

	update(title, description, actionButtom, options) {
		var parentElement = false;
		if(this.container && this.container.parentElement) {
			parentElement = this.container.parentElement;
			this.container.parentNode.removeChild(this.container);
		}
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
		this.setupContainer(title, description, actionButtom, options);
		if(parentElement) parentElement.appendChild(this.container);
		else document.body.appendChild(this.container);
		this.container.style.display = 'block';
		return this.container;
	}

	setupContainer(title, description, actionButtom, options) {
		if(title) {
			this.title = this.buildTitle(title);
			this.container.appendChild(this.title);
		}
		if(description) {
			this.description = this.buildDescription(description);
			this.container.appendChild(this.description);  
		}
		if(actionButtom) {
			this.actionButtom = this.buildActionButton(actionButtom);
			this.container.appendChild(this.actionButtom);
		}
		if(options) {
			this.optionsContainer = document.createElement('div');
			this.optionsContainer.className = 'ref-options-container';
			let optionElements = this.buildOptionButtons(options);
			optionElements.forEach(optionElem => {
				this.optionsContainer.appendChild(optionElem);
			});
			this.container.appendChild(this.optionsContainer);
		}
	}

	get() {
		return this.container;
	}

	remove() {
		this.container.style.display = 'none';
	}

	buildActionButton(props) {
		let actionButton = document.createElement('button');
		actionButton.className = 'ref-add-user-referral-button';
		actionButton.onclick = props.onclick;
		actionButton.innerText = props.text;
		return actionButton;
	}

	buildTitle(titleText) {
		let title = document.createElement('div');
		title.className = 'ref-header';
		title.innerText = titleText;
		return title;
	}

	buildDescription(descriptionText) {
		let description = document.createElement('div');
		description.className = 'ref-description';
		description.innerHTML = descriptionText;
		return description;
	}

	buildOptionButtons(options){
		return options.map(option => {
			let optionButton = document.createElement('span');
			optionButton.className = 'ref-option';
			optionButton.innerText = option.text;
			optionButton.onclick = option.onclick;
			return optionButton;
		});
	}
}