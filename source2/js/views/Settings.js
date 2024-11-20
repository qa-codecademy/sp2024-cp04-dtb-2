import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";
import SessionService from "../modules/SessionService.js";
import apiCaller from "../modules/ApiCaller.js";

const sessionService = new SessionService();

const buttonService = new ButtonService();
export default class Settings extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Account Settings");
    this.params = params;
  }

  async getHtml() {
    buttonService.filterBtn.style.display = "none";
    buttonService.loadMoreBtn.style.display = "none";
    
    const found = sessionService.Get();
    let result;
    if (found) {
        let fetchedUser = await apiCaller.fetchFromDB("https://localhost:7073/api/User/userdetails", "GET", null, found.token);
        
      result = `
            <form>
                <h3 id="settingsWelcomeMessage">Hi ${fetchedUser.firstName} ${fetchedUser.lastName}!</h3>
                <div class="col-md-4">
                    <div class="form-group mb-3 ">
                        <label for="firstNameSettings" class="form-label">First Name</label>
                        <div class="input-group">
                            <input disabled=true type="text" class="form-control" id="firstNameSettings" value="${fetchedUser.firstName}" placeholder="First Name">
                            <button class="btn btn-outline-warning" id="firstNameSettingsBtn" type="button">Edit</button>
                        </div>
                    </div>

                    <div class="form-group mb-3">
                        <label for="lastNameSettings" class="form-label">Last Name</label>
                        <div class="input-group">
                            <input disabled=true type="text" class="form-control " id="lastNameSettings" value="${fetchedUser.lastName}" placeholder="Last Name">
                            <button class="btn btn-outline-warning" id="lastNameSettingsBtn" type="button">Edit</button>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="emailSettings" class="form-label">Email</label>
                        <div class="input-group">
                            <input disabled=true type="text" class="form-control " id="emailSettings" value="${fetchedUser.email}" placeholder="Email">
                            <button class="btn btn-outline-warning" id="emailSettingsBtn" type="button">Edit</button>
                        </div>
                    </div>
                    <div>
                    <h5>
                    Subscribed: ${fetchedUser.isSubscribed? '<img style="max-width: 30px; max-height: 30px;" src="data/icons/greenCheckMark.png">':'<img style="max-width: 30px; max-height: 30px;" src="data/icons/redXMarkpng.png">'}
                    </h5>
                    <h5>
                    Admin: ${fetchedUser.isAdmin? '<img style="max-width: 30px; max-height: 30px;" src="data/icons/greenCheckMark.png">':'<img style="max-width: 30px; max-height: 30px;" src="data/icons/redXMarkpng.png">'}
                    </h5>
                    </div>
                </div>
            </form>            
            <a class="btn btn-primary" href="/settings/myposts" id ="myPostsBtn" data-link>MY POSTS</a>
            <button class="btn btn-danger" id="deleteUserBtn">DELETE ACCOUNT</button>
        `;
    } else {
      result = "<h1>Not currently logged in!</h1>";
    }

    return result;
  }
}
