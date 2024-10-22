export default class AbstractView {
    constructor(params) {
        this.params = params;

        console.log(this.params);
        
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}
