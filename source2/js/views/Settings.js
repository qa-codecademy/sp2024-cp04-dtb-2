import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";

const buttonService = new ButtonService();
export default class Settings extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        this.params = params;
    }
    

    async getHtml() {
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";
        return `
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="exampleCheck1">First Name</label>
                        <input type="" class="form-check-input" id="exampleCheck1">
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="exampleCheck1">First Name</label>
                        <input type="" class="form-check-input" id="exampleCheck1">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
            </form>            
            <a href="/settings/myposts" id ="myPostsBtn" data-link> <p>MY POSTS</p> </a>
        `;
    }
}