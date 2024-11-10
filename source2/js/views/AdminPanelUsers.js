import SessionService from "../modules/SessionService.js";
import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";
import apiCaller from "../modules/ApiCaller.js";

const buttonService = new ButtonService();
const sessionService = new SessionService();

export default class AdminPanelUsers extends AbstractView{
    constructor(params) {
        super(params);
        this.setTitle("Users");
        this.params = params;
      }

      getHtml = async() =>{
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";

        const found = sessionService.Get();
        let resultHtml ="";
        if(found){
            const result = await apiCaller.fetchFromDB(`https://localhost:7073/api/User`, "GET");
            let resultRecords = '';
            result.forEach(user =>{
                resultRecords += `
                    <tr>
                        <th>${user.id}</th>
                        <td>${user.fullname}</td>
                        <td>${user.email}</td>
                        ${user.isAdmin ? '<td>No can\'t do</td>' : `<td><a class="btn btn-outline-danger">Delete</a></td>` }
                        <td><a href="/authorposts/${user.id}" class="btn btn-primary" data-link>Posts</a></td>
                    </tr>
                `
            })
            
            resultHtml = `<h1>You're viewing users in Admin Panel!</h1>
            <hr>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Delete User</th>
                    <th scope="col">Posts</th>
                    </tr>
                </thead>
                <tbody>
                    ${resultRecords}
                </tbody>
                </table>
            `;

        } else {
            resultHtml = "<h1>Not currently logged in!</h1>";
        }

        return resultHtml;
      }
}