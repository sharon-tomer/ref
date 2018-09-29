export default class Notification {
    constructor(title, description, button) {
        this.container = document.createElement('div');
        if(title) {
            this.title = this.buildTitle(title);
            this.container.appendChild(this.title);
        }
        if(description) {
            this.description = this.buildDescription(description);
            this.container.appendChild(this.description);
        }
        if(typeof onClick === 'function') {
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
        actionButton.innerText = button.text;
        return actionButton;
    }
}