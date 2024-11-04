import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";

const buttonService = new ButtonService();

export default class MyPosts extends AbstractView {
    
    constructor(params) {
        super(params);
        this.setTitle("MyPosts"); 
    }

    async getHtml() {
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";
        return `
            <h1> IT WORKS 2.0</h1>
        `;
    }
}
