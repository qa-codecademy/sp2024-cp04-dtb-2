export default class AbstractView {
    constructor() {
        this.title = null;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}
