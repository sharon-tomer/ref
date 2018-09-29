export default class Notification {
    constructor(title, description, button) {
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
        if(button) {
            this.button = this.buildActionButton(button);
            this.container.appendChild(this.button);
        }
        return this.container;
    }

    get() {
        return this.container;
    }

    buildActionButton(props) {
        let actionButton = document.createElement('button');
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
}