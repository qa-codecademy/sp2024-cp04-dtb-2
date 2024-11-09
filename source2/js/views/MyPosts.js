import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";
import SessionService from "../modules/SessionService.js";
import apiCaller from "../modules/ApiCaller.js";

const sessionService = new SessionService();
const buttonService = new ButtonService();

export default class MyPosts extends AbstractView {
    
    constructor(params) {
        super(params);
        this.setTitle("MyPosts"); 
    }

    async getHtml() {
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";
        let url = null;
        const found = sessionService.Get();
        let resultHtml = '';
        if(found){
            if (found.isAdmin) {
                url = `https://localhost:7073/api/Posts`;
            } else {
                url =`https://localhost:7073/api/Posts/authorposts/${found.id}`
            }
            const result = await apiCaller.fetchFromDB(url, "GET");
            result.forEach(post => {
                resultHtml += `
                <div class="card" style="width: 25vw" id="card-${post.id}">
                    <div class="card-body title">
                        <a class="post-link" href="posts/${post.id}" data-link><h5 class="card-title">${post.title}</h5></a>
                        <p class="card-text">${post.description}</p>
                    </div>
                    <div class="card-body icons">
                        <div> 
                            
                            <p>${post.rating} <img src="/data/icons/star.svg" alt="Star Icon" class="starsIcon"></p>
                        </div>
                        <div>
                            <p>${post.comments} <img src="/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon"></p>
                        </div>
                        <br>
                        <div class="tags">
                        <button type="button" class="btn btn-secondary btn-sm disabled">${post.tags}</button>
                        <br>
                        <br>
                        <button class ="btn btn-outline-danger deletePost" value="${post.id}">Delete</button>
                        <a href="/posts/${post.id}" class ="btn btn-outline-primary" value="${post.id}" data-link>Go to post</a>
                        </div>  
                        </div>
                        </div>
                        `;
            });
            if(result.length < 1){
                resultHtml = '<h3>You currently have no posts ] ;</h3>'
            }
        } else{
            resultHtml = "You're not currently logged in!";
        }
        return resultHtml;
    }
}
