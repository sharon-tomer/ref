export default class Notification {
    constructor() {
    }

    init(title, description, actionButtom, options) {
        this.container = document.createElement('div');
        this.container.className = 'ref-container';
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
        return this.container;
    }

    get() {
        return this.container;
    }

    remove() {
        this.container.parentElement.removeChild(this.container);
    }

    buildActionButton(props) {
        let actionButton = document.createElement('button');
        actionButton.className = 'ref-button';
        actionButton.onclick = props.onclick;
        actionButton.innerText = props.text;
        return actionButton;
    }

    buildTitle(titleText) {
        let title = document.createElement('div');
        title.innerText = titleText;
        return title;
    }

    buildDescription(descriptionText) {
        let description = document.createElement('div');
        description.innerText = descriptionText;
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