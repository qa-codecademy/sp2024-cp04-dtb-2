import SessionService from "../modules/SessionService.js";
import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";

const buttonService = new ButtonService();
const sessionService = new SessionService();

export default class AdminPanel extends AbstractView{
    constructor(params) {
        super(params);
        this.setTitle("Admin Panel");
        this.params = params;
      }

      getHtml(){
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";

        const found = sessionService.Get();
        let result ="";
        if(found){
            result = `<h1>You're inside Admin Panel!</h1>
            <a class="btn btn-primary" href="/adminpanel/users" data-link>Users</a>
            `;

        } else {
            result = "<h1>Not currently logged in!</h1>";
        }

        return result;
      }
}