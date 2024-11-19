import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";
import SessionService from "../modules/SessionService.js";
import apiCaller from "../modules/ApiCaller.js";
import eventService from "../modules/EventService.js";

const sessionService = new SessionService();
const buttonService = new ButtonService();

export default class SearchPosts extends AbstractView {
    
    constructor(params) {
        super(params);
        this.setTitle("Posts"); 
    }
    async getHtml() {
        
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";
        document.querySelector("#searchInput").value = '';
        document.querySelector("#contentPart").innerHTML = '';
        const result = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts/search?query=${encodeURIComponent(this.params.query)}`, "GET");
        let resultHtml = '';
        if(result){
                result.forEach(post => {
                    const tags = post.tags.map(tag => `#${tag}`).join(' ');
                    const imgSrc = `data:image/png;base64,${post.image}`;
                resultHtml += `
                
                <div class="card" style="width: 25vw" id="card-${post.id}">
                    <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${post.id}">
                    <div class="card-body title">
                        <a class="post-link" href="/posts/${post.id}" data-link><h5 class="card-title">${post.title}</h5></a>
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
                            <button type="button" class="btn btn-secondary btn-sm disabled">${tags}</button>
                        </div>  
                    </div>
                </div>
                        
                        `;
            });
            if(result.length < 1){
                resultHtml = '<h3>There\'s no results!</h3>'
            }
        } else{
            resultHtml = '<h3>There\'s no results!</h3>'
        }
        return resultHtml;
    }
}
