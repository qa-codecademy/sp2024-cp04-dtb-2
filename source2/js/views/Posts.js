import AbstractView from "./AbstractView.js";
import apiCaller from "../modules/ApiCaller.js";
import  ButtonService  from "../modules/ButtonService.js";
import postFilterService from "../modules/PostFilterService.js";
import eventService from "../modules/EventService.js";

const btnService = new ButtonService();

export default class Posts extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Posts");
        this.params = params;
        this.initialLoadComplete = false;
    }

    async getHtml() {
        if (!this.initialLoadComplete) {
            const body = this.params;
            let result = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", body);
            this.initialLoadComplete = true; 

            postFilterService.updateFilter({ pageIndex: result.pageIndex, totalPages: result.totalPages});
            console.log(postFilterService.filters);
            
            result.posts.forEach(post => {
                const date = new Date(post.postingTime);
                post.postingTime = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",  // Ex: Sep, Oct, Nov
                    year: "numeric"
                });
            })
            return this.renderPosts(result.posts);
        }
        
        return ''; 
    }

    renderPosts(posts) {
        btnService.filterBtn.style.display = "block";
        btnService.loadMoreBtn.style.display = "block";
        let resultHtml = "";
        if(posts && posts.length < 1){
            resultHtml = "<h3>No results were found!</h3";
            return resultHtml;
        }
        posts.forEach(element => {
            element.tags = element.tags.map(x => `#${x}`).join(' ');
            let imgSrc = `data:image/png;base64,${element.image}`;
            resultHtml += `
                <div class="card" style="width: 25vw" id="card-${element.id}">
                    <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${element.id}">
                    <div class="card-body title">
                        <a class="post-link" href="posts/${element.id}" data-link><h5 class="card-title">${element.title}</h5></a>
                        <h6>By ${element.user.fullname} - <small>${element.postingTime}</small></h6>
                        
                        <p class="card-text">${element.description}</p>
                    </div>
                    <div class="card-body icons">
                        <div> 
                            <p>${element.rating} <img src="/data/icons/star.svg" alt="Star Icon" class="starsIcon"> ${element.rating !== 0 ? `(${element.ratings !== 1 ? `${element.ratings} ratings` : `${element.ratings} rating`})` : ''}</p>
                        </div>
                        <div>
                            <p>${element.comments} <img src="/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon"></p>
                        </div>
                        <br>
                        <div class="tags">
                            <button type="button" class="btn btn-secondary btn-sm disabled">${element.tags}</button>
                        </div>  
                    </div>
                </div>
                        `;
                    });
                    return resultHtml;
                }
            }
            // <p><small>Tags: ${element.tags}</small></p>